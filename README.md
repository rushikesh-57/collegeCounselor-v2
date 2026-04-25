# College Counselor v2

Production-oriented Supabase rebuild of the legacy Flask + React college counselling app.

The legacy repo remains read-only source material at `C:\Work\collegeCounselor`. This repo contains the new React + Vite frontend, Supabase schema/RPC migrations, Edge Functions, and migration scripts.

## Stack

- React + Vite
- MUI
- AG Grid
- Supabase Postgres
- Supabase Edge Functions
- Supabase Storage
- Supabase `pgvector`

## Local Frontend

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

Set these values in `.env`:

```text
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Supabase Setup

```powershell
npm run supabase -- login
npm run supabase -- link --project-ref your-project-ref
npm run supabase -- db push
```

Set the custom Edge Function secret:

```powershell
npm run supabase -- secrets set ADMIN_EXPORT_SECRET=your-admin-export-secret
```

Do not set `SUPABASE_SERVICE_ROLE_KEY` manually. Supabase provides `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` to Edge Functions by default.

Optional chatbot secrets, only if AI is enabled later:

```powershell
npm run supabase -- secrets set OPENROUTER_API_KEY=your-openrouter-key
npm run supabase -- secrets set EMBEDDING_API_URL=https://your-embedding-endpoint
npm run supabase -- secrets set CHAT_MODEL=mistralai/mistral-7b-instruct
npm run supabase -- secrets set EMBEDDING_MODEL=nomic-embed-text
```

Deploy functions:

```powershell
npm run supabase -- functions deploy recommend-colleges
npm run supabase -- functions deploy college-data
npm run supabase -- functions deploy college-list
npm run supabase -- functions deploy check-cutoff
npm run supabase -- functions deploy export-excel
npm run supabase -- functions deploy export-pdf
npm run supabase -- functions deploy chatbot
npm run supabase -- functions deploy admin-studentform-export
```

## Data Migration

Install script dependencies and export CSVs:

```powershell
python -m venv .venv
.\.venv\Scripts\pip install -r scripts\requirements.txt
.\.venv\Scripts\python scripts\export_sqlite_to_supabase_csv.py
```

CSV files are generated under `exports/supabase-csv` and are ignored by Git.

Import order:

1. `universities.csv`
2. `colleges.csv`
3. `branches.csv`
4. `cutoff_rounds.csv`
5. `student_forms.csv` only if you want old submissions migrated

## Storage

Create a public bucket named `public-downloads`.

Upload cutoff PDFs to:

```text
public-downloads/cutoffs/
```

The Downloads screen expects filenames matching the old Flask app, such as `Cap 1 cutoff 2024-25.pdf`.

## RAG

The chatbot uses `rag_documents`, `rag_chunks`, and the `match_rag_chunks` RPC. Ingest PDFs with:

```powershell
.\.venv\Scripts\python scripts\ingest_rag_pdfs.py
```

The migration uses `vector(768)` because the legacy app used Nomic embeddings. Change the vector dimension in the first migration if you choose a different embedding model.

## GitHub

Create an empty GitHub repo in the browser, then connect this local repo:

```powershell
git remote add origin https://github.com/your-user/your-empty-repo.git
git push -u origin main
```

Do not commit generated CSVs, PDFs, SQLite files, Chroma data, or secrets.
