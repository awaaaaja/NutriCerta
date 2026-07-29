"""Test PubMed E-utilities and Semantic Scholar API access."""
import requests, json, sys

print("=== PubMed E-utilities API Test ===")
url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi"
params = {"db": "pubmed", "term": "malnutrition screening tool MST", "retmax": 3, "retmode": "json"}
resp = requests.get(url, params=params, timeout=30)
if resp.status_code == 200:
    data = resp.json()
    ids = data.get("esearchresult", {}).get("idlist", [])
    print(f"PubMed API: OK - Found {len(ids)} results (ids: {ids})")
else:
    print(f"PubMed API: FAILED - {resp.status_code}")
    sys.exit(1)

print()
print("=== Semantic Scholar API Test ===")
url = "https://api.semanticscholar.org/graph/v1/paper/search"
params = {"query": "Mifflin-St Jeor energy expenditure", "limit": 3, "fields": "title,year"}
resp = requests.get(url, params=params, timeout=30)
if resp.status_code == 200:
    data = resp.json()
    papers = data.get("data", [])
    print(f"Semantic Scholar API: OK - Found {len(papers)} papers")
    for p in papers:
        title = p.get("title", "?")[:80]
        year = p.get("year", "?")
        print(f"  - {title} ({year})")
else:
    print(f"Semantic Scholar API: FAILED - {resp.status_code}")
    sys.exit(1)

print("\nBoth APIs working correctly.")
