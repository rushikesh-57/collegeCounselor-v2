"""Chunk CAP reference PDFs and insert RAG data into Supabase.

Set SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, EMBEDDING_API_URL, and
OPENROUTER_API_KEY in your environment before running.
"""

from __future__ import annotations

import argparse
import os
from pathlib import Path

import requests
from dotenv import load_dotenv
from pypdf import PdfReader
from supabase import create_client


def chunks(text: str, size: int = 900, overlap: int = 160):
    start = 0
    while start < len(text):
        yield text[start:start + size]
        start += size - overlap


def embed(text: str) -> list[float]:
    api_key = os.environ["OPENROUTER_API_KEY"]
    url = os.environ["EMBEDDING_API_URL"]
    model = os.environ.get("EMBEDDING_MODEL", "nomic-embed-text")
    response = requests.post(
        url,
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
        json={"model": model, "input": text},
        timeout=60,
    )
    response.raise_for_status()
    data = response.json()
    return data.get("data", [{}])[0].get("embedding") or data["embedding"]


def extract_pdf(path: Path) -> str:
    reader = PdfReader(str(path))
    return "\n".join(page.extract_text() or "" for page in reader.pages)


def main() -> None:
    load_dotenv()
    parser = argparse.ArgumentParser()
    parser.add_argument("--pdf-dir", default=r"C:\Work\collegeCounselor\backend\filesLLM")
    args = parser.parse_args()

    supabase = create_client(os.environ["SUPABASE_URL"], os.environ["SUPABASE_SERVICE_ROLE_KEY"])
    pdf_dir = Path(args.pdf_dir)
    for pdf_path in sorted(pdf_dir.glob("*.pdf")):
        print(f"Ingesting {pdf_path.name}")
        document = supabase.table("rag_documents").insert({
            "title": pdf_path.stem,
            "storage_path": f"rag-sources/{pdf_path.name}",
        }).execute().data[0]
        text = extract_pdf(pdf_path)
        rows = []
        for index, chunk in enumerate(chunks(text)):
            if chunk.strip():
                rows.append({
                    "document_id": document["id"],
                    "chunk_index": index,
                    "content": chunk,
                    "embedding": embed(chunk),
                })
        if rows:
            supabase.table("rag_chunks").insert(rows).execute()
            print(f"  inserted {len(rows)} chunks")


if __name__ == "__main__":
    main()
