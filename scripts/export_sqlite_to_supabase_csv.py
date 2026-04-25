"""Export the legacy SQLite data into Supabase-ready CSV files.

This script only reads from the legacy repository. It writes generated CSVs to
the v2 repo's local exports directory, which is intentionally ignored by Git.
"""

from __future__ import annotations

import argparse
import csv
import sqlite3
from pathlib import Path

import pandas as pd


TABLE_MAP = {
    "University": "universities.csv",
    "College": "colleges.csv",
    "Branch": "branches.csv",
    "AllRounds_Cutoff_Agg_Rank_2025": "cutoff_rounds.csv",
    "StudentForm": "student_forms.csv",
}

COLUMN_RENAMES = {
    "University": {
        "university_id": "university_id",
        "university_name": "university_name",
    },
    "College": {
        "college_code": "college_code",
        "college_name": "college_name",
        "university_id": "university_id",
        "District": "district",
    },
    "Branch": {
        "branch_code": "branch_code",
        "branch_name": "branch_name",
        "college_code": "college_code",
        "core_branch": "core_branch",
    },
    "AllRounds_Cutoff_Agg_Rank_2025": {
        "Branch_Code": "branch_code",
        "Category": "category",
        "CAP Round 1": "cap_round_1",
        "CAP Round 2": "cap_round_2",
        "CAP Round 3": "cap_round_3",
        "CAP Round 4": "cap_round_4",
    },
    "StudentForm": {
        "MobileNumber": "mobile_number",
        "Rank": "rank",
        "Gender": "gender",
        "Caste": "caste",
        "EWS": "ews",
        "PWD": "pwd",
        "DEF": "def",
        "TFWS": "tfws",
        "ORPHAN": "orphan",
        "MI": "mi",
        "HomeUniversity": "home_university",
        "PrefferedDistrict": "preferred_districts",
        "PrefferedBranch": "preferred_branches",
    },
}


def split_legacy_list(value: object) -> str:
    if pd.isna(value) or value == "":
        return "{}"
    items = [item.strip() for item in str(value).split(",") if item.strip()]
    escaped = [item.replace('"', '\\"') for item in items]
    return "{" + ",".join(f'"{item}"' for item in escaped) + "}"


def normalize_code(value: object) -> str:
    if pd.isna(value):
        return ""
    text = str(value).strip()
    if text.endswith(".0"):
        text = text[:-2]
    return text


def load_colleges(conn: sqlite3.Connection) -> pd.DataFrame:
    colleges = pd.read_sql_query('SELECT * FROM "College"', conn).rename(columns=COLUMN_RENAMES["College"])
    colleges = colleges[list(COLUMN_RENAMES["College"].values())]
    colleges["college_code"] = colleges["college_code"].apply(normalize_code)

    cap = pd.read_sql_query(
        'SELECT DISTINCT College_Code, College_Name, Home_University FROM "Cap1_cutoff_2025_Rank"',
        conn,
    ).rename(columns={
        "College_Code": "college_code",
        "College_Name": "college_name",
        "Home_University": "university_name",
    })
    cap["college_code"] = cap["college_code"].apply(normalize_code)
    universities = pd.read_sql_query('SELECT university_id, university_name FROM "University"', conn)
    cap = cap.merge(universities, on="university_name", how="left")
    cap["district"] = ""
    cap = cap[["college_code", "college_name", "university_id", "district"]]

    return (
        pd.concat([colleges, cap], ignore_index=True)
        .drop_duplicates(subset=["college_code"], keep="first")
        .sort_values("college_code")
    )


def load_branches(conn: sqlite3.Connection) -> pd.DataFrame:
    branches = pd.read_sql_query('SELECT * FROM "Branch"', conn).rename(columns=COLUMN_RENAMES["Branch"])
    branches = branches[list(COLUMN_RENAMES["Branch"].values())]
    branches["branch_code"] = branches["branch_code"].apply(normalize_code)
    branches["college_code"] = branches["college_code"].apply(normalize_code)

    cap = pd.read_sql_query(
        'SELECT DISTINCT Branch_Code, Branch_Name, College_Code FROM "Cap1_cutoff_2025_Rank"',
        conn,
    ).rename(columns={
        "Branch_Code": "branch_code",
        "Branch_Name": "branch_name",
        "College_Code": "college_code",
    })
    cap["branch_code"] = cap["branch_code"].apply(normalize_code)
    cap["college_code"] = cap["college_code"].apply(normalize_code)
    cap["core_branch"] = cap["branch_name"]

    return (
        pd.concat([branches, cap], ignore_index=True)
        .drop_duplicates(subset=["branch_code"], keep="first")
        .sort_values("branch_code")
    )


def export_table(conn: sqlite3.Connection, table: str, output_dir: Path) -> int:
    if table == "College":
        df = load_colleges(conn)
        output_path = output_dir / TABLE_MAP[table]
        df.to_csv(output_path, index=False, quoting=csv.QUOTE_MINIMAL)
        return len(df)

    if table == "Branch":
        df = load_branches(conn)
        output_path = output_dir / TABLE_MAP[table]
        df.to_csv(output_path, index=False, quoting=csv.QUOTE_MINIMAL)
        return len(df)

    df = pd.read_sql_query(f'SELECT * FROM "{table}"', conn)
    df = df.rename(columns=COLUMN_RENAMES[table])
    df = df[list(COLUMN_RENAMES[table].values())]

    if table == "AllRounds_Cutoff_Agg_Rank_2025":
        df["branch_code"] = df["branch_code"].apply(normalize_code)
        df.insert(0, "year", 2025)
    if table == "StudentForm":
        df["preferred_districts"] = df["preferred_districts"].apply(split_legacy_list)
        df["preferred_branches"] = df["preferred_branches"].apply(split_legacy_list)

    output_path = output_dir / TABLE_MAP[table]
    df.to_csv(output_path, index=False, quoting=csv.QUOTE_MINIMAL)
    return len(df)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--legacy-db", default=r"C:\Work\collegeCounselor\backend\database\data.db")
    parser.add_argument("--out", default="exports/supabase-csv")
    args = parser.parse_args()

    legacy_db = Path(args.legacy_db)
    output_dir = Path(args.out)
    output_dir.mkdir(parents=True, exist_ok=True)

    if not legacy_db.exists():
        raise FileNotFoundError(f"Legacy database not found: {legacy_db}")

    with sqlite3.connect(legacy_db) as conn:
      for table in TABLE_MAP:
          count = export_table(conn, table, output_dir)
          print(f"Exported {count:>6} rows from {table} -> {output_dir / TABLE_MAP[table]}")

    print("\nImport order: universities, colleges, branches, cutoff_rounds, student_forms.")


if __name__ == "__main__":
    main()
