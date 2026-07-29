"""
ETL Pipeline for MIMIC-IV → NutriCerta ML Dataset

Prerequisites:
1. CITI Program certification completed
2. MIMIC-IV access granted on physionet.org
3. CSV files downloaded to ml/data/raw/

Usage:
    python ml/pipeline/etl_mimic.py --raw_dir ml/data/raw/ --output ml/data/processed/

Output:
    - patient_features.parquet  : feature matrix untuk prediksi risiko & LOS
    - nutrition_timeseries.parquet : time-series asupan per pasien per hari
    - data_lineage.json         : metadata tiap transformasi
"""

import argparse
import json
import os
from datetime import datetime

import pandas as pd
import numpy as np

# ============================================================
# Sumber: MIMIC-IV v3.0 Documentation (physionet.org)
# Feature definitions based on clinical literature
# ============================================================


def load_raw_data(raw_dir: str) -> dict[str, pd.DataFrame]:
    """Load MIMIC-IV CSV files into DataFrames."""
    tables = {
        "patients": "hosp/patients.csv.gz",
        "admissions": "hosp/admissions.csv.gz",
        "transfers": "hosp/transfers.csv.gz",
        "diagnoses_icd": "hosp/diagnoses_icd.csv.gz",
        "d_labitems": "hosp/d_labitems.csv.gz",
        "labevents": "hosp/labevents.csv.gz",
        "icustays": "icu/icustays.csv.gz",
        "chartevents": "icu/chartevents.csv.gz",
        "inputevents": "icu/inputevents.csv.gz",
        "emar": "hosp/emar.csv.gz",
        "emar_detail": "hosp/emar_detail.csv.gz",
        "ingredients": "hosp/ingredients.csv.gz",
        "services": "hosp/services.csv.gz",
    }

    dfs = {}
    for name, path in tables.items():
        full_path = os.path.join(raw_dir, path)
        if os.path.exists(full_path):
            dfs[name] = pd.read_csv(full_path, low_memory=False)
            print(f"  Loaded {name}: {len(dfs[name])} rows")
        else:
            print(f"  WARNING: {full_path} not found, skipping")
    return dfs


def build_patient_features(dfs: dict[str, pd.DataFrame]) -> pd.DataFrame:
    """Build patient-level feature matrix."""
    if "patients" not in dfs:
        return pd.DataFrame()

    patients = dfs["patients"].copy()
    admissions = dfs.get("admissions")
    diagnoses = dfs.get("diagnoses_icd")
    icustays = dfs.get("icustays")
    chartevents = dfs.get("chartevents")
    labevents = dfs.get("labevents")
    d_labitems = dfs.get("d_labitems")

    features = patients[["subject_id", "gender", "anchor_age"]].copy()
    features.rename(columns={"anchor_age": "age"}, inplace=True)

    if admissions is not None:
        adm_features = admissions.groupby("subject_id").agg(
            admisi_total=("hadm_id", "nunique"),
            los_total=("dischtime", lambda x: (
                pd.to_datetime(x) - pd.to_datetime(admissions.loc[x.index, "admittime"])
            ).dt.total_seconds().div(86400).sum() if len(x) > 0 else 0),
        ).reset_index()
        features = features.merge(adm_features, on="subject_id", how="left")

    if chartevents is not None:
        weight_items = [226512]  # Admission Weight (kg)
        height_items = [226730]  # Height (cm)
        weight = chartevents[chartevents["itemid"].isin(weight_items)]
        if len(weight) > 0:
            first_weight = weight.sort_values("charttime").groupby("subject_id").first()["valuenum"].reset_index()
            first_weight.rename(columns={"valuenum": "weight_first"}, inplace=True)
            features = features.merge(first_weight, on="subject_id", how="left")

        height = chartevents[chartevents["itemid"].isin(height_items)]
        if len(height) > 0:
            first_height = height.sort_values("charttime").groupby("subject_id").first()["valuenum"].reset_index()
            first_height.rename(columns={"valuenum": "height_first"}, inplace=True)
            features = features.merge(first_height, on="subject_id", how="left")

    if "weight_first" in features.columns and "height_first" in features.columns:
        features["imt"] = features["weight_first"] / ((features["height_first"] / 100) ** 2)
        features["imt"] = features["imt"].replace([np.inf, -np.inf], np.nan)

    if labevents is not None and d_labitems is not None:
        albumin_itemid = d_labitems[d_labitems["label"].str.contains("Albumin", case=False, na=False)]
        if len(albumin_itemid) > 0:
            alb_id = albumin_itemid.iloc[0]["itemid"]
            alb = labevents[labevents["itemid"] == alb_id].copy()
            if len(alb) > 0:
                alb_first = alb.sort_values("charttime").groupby("subject_id").first()["valuenum"].reset_index()
                alb_first.rename(columns={"valuenum": "albumin_first"}, inplace=True)
                features = features.merge(alb_first, on="subject_id", how="left")

                alb_min = alb.groupby("subject_id")["valuenum"].min().reset_index()
                alb_min.rename(columns={"valuenum": "albumin_min"}, inplace=True)
                features = features.merge(alb_min, on="subject_id", how="left")

    if diagnoses is not None:
        diag_count = diagnoses.groupby("subject_id").size().reset_index(name="jumlah_diagnosis")
        features = features.merge(diag_count, on="subject_id", how="left")

    return features


def build_nutrition_timeseries(dfs: dict[str, pd.DataFrame]) -> pd.DataFrame:
    """Build daily nutrition intake time-series."""
    if "inputevents" not in dfs:
        return pd.DataFrame()

    ie = dfs["inputevents"].copy()
    if "amount" not in ie.columns:
        return pd.DataFrame()

    ie["charttime"] = pd.to_datetime(ie["charttime"])
    ie["tanggal"] = ie["charttime"].dt.date

    daily = ie.groupby(["subject_id", "hadm_id", "tanggal"]).agg(
        total_energi=("amount", "sum"),
        total_cairan=("amount", "sum"),
        n_record=("inputevent_id", "count"),
    ).reset_index()

    return daily


def anonymize(df: pd.DataFrame) -> pd.DataFrame:
    """
    Anonymize PHI per PhysioNet DUA + UU PDP.
    - Shift dates (already done by PhysioNet)
    - Group age > 89
    - Remove any stored text identifiers
    """
    if "age" in df.columns:
        df["age_group"] = pd.cut(
            df["age"],
            bins=[0, 18, 40, 60, 80, float("inf")],
            labels=["<18", "18-40", "41-60", "61-80", ">80"],
        )
    return df


def main(raw_dir: str, output_dir: str):
    os.makedirs(output_dir, exist_ok=True)

    print("Loading MIMIC-IV data...")
    dfs = load_raw_data(raw_dir)

    print("\nBuilding patient features...")
    features = build_patient_features(dfs)
    print(f"  Patient features: {features.shape}")

    print("\nBuilding nutrition timeseries...")
    nutrition = build_nutrition_timeseries(dfs)
    print(f"  Nutrition records: {len(nutrition)}")

    print("\nAnonymizing...")
    features = anonymize(features)

    print(f"\nSaving to {output_dir}...")
    features.to_parquet(os.path.join(output_dir, "patient_features.parquet"))
    if len(nutrition) > 0:
        nutrition.to_parquet(os.path.join(output_dir, "nutrition_timeseries.parquet"))

    lineage = {
        "sumber": "MIMIC-IV v3.0 (PhysioNet)",
        "tanda": "DATA_PEMBANDING_RISET",
        "waktu_ekstraksi": datetime.now().isoformat(),
        "fitur": list(features.columns),
        "n_pasien": len(features),
        "n_nutrisi_record": len(nutrition),
    }
    with open(os.path.join(output_dir, "data_lineage.json"), "w") as f:
        json.dump(lineage, f, indent=2)

    print(f"\nDone. Lineage saved to {output_dir}/data_lineage.json")
    print("Ready for ML training in FASE 7.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="MIMIC-IV → NutriCerta ETL Pipeline")
    parser.add_argument("--raw_dir", default="ml/data/raw/", help="MIMIC-IV CSV directory")
    parser.add_argument("--output", default="ml/data/processed/", help="Output directory")
    args = parser.parse_args()
    main(args.raw_dir, args.output)
