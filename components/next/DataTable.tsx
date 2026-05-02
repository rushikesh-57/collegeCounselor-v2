'use client';

type DataRow = Record<string, string | number | null | undefined>;

export default function DataTable({ rows }: { rows: DataRow[] }) {
  if (!rows.length) return <p style={{ color: 'var(--muted)' }}>No data to display.</p>;

  const headers = Object.keys(rows[0]);

  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header.replaceAll('_', ' ')}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx}>
              {headers.map((header) => (
                <td key={`${idx}-${header}`}>{String(row[header] ?? '-')}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
