"""ChromaDB Cloud client for NutriCerta knowledge base vector store."""
import chromadb

client = chromadb.CloudClient(
    api_key="ck-FW8kpLeYWNmz3Sc8ox4zB5dp4o2CHqofCvEEAMVFPsmx",
    tenant="31e70a65-72b8-429e-bfb7-c7c897f247a9",
    database="nutricerta"
)
