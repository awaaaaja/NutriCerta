"""
NutriCerta Backend API
FastAPI server with Rule Engine + Knowledge Base integration.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import assessment, foods, entities, auth_routes

app = FastAPI(
    title="NutriCerta API",
    version="1.0.0",
    description="Clinical Nutrition Assessment API — Rule Engine + Knowledge Base",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router)
app.include_router(assessment.router)
app.include_router(foods.router)
app.include_router(entities.router)


@app.get("/")
def root():
    return {
        "app": "NutriCerta API",
        "version": "1.0.0",
        "docs": "/docs",
    }


@app.get("/health")
def health():
    return {"status": "ok"}
