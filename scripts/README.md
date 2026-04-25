# Migration Scripts

These scripts read from the legacy repo and write either ignored local exports or Supabase tables.

## Export SQLite tables

```powershell
python -m venv .venv
.\.venv\Scripts\pip install -r scripts\requirements.txt
.\.venv\Scripts\python scripts\export_sqlite_to_supabase_csv.py
```

Generated CSVs are written to `exports/supabase-csv`, which is ignored by Git.

Import order:

1. `universities.csv`
2. `colleges.csv`
3. `branches.csv`
4. `cutoff_rounds.csv`
5. `student_forms.csv` only if you want to migrate existing student submissions

## Ingest RAG PDFs

```powershell
$env:SUPABASE_URL="https://your-project-ref.supabase.co"
$env:SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
$env:OPENROUTER_API_KEY="your-openrouter-key"
$env:EMBEDDING_API_URL="https://your-embedding-endpoint"
.\.venv\Scripts\python scripts\ingest_rag_pdfs.py
```
