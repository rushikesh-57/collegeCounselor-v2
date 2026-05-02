import Link from 'next/link';
import Shell from '@/components/next/Shell';
import { getCollegeData, slugify } from '@/lib/data';

export const metadata = {
  title: 'Colleges',
  description: 'Static college list generated from cutoff data.',
};

export const revalidate = 3600;

export default async function CollegesPage() {
  const rows = await getCollegeData();
  const names = [...new Set(rows.map((row) => String(row.college_name || '')).filter(Boolean))].sort();

  return (
    <Shell>
      <section className="card">
        <h1>College List</h1>
        <p>Pre-rendered for SEO and fast first paint. Updated hourly.</p>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>College Name</th>
                <th>Profile</th>
              </tr>
            </thead>
            <tbody>
              {names.map((name) => (
                <tr key={name}>
                  <td>{name}</td>
                  <td>
                    <Link href={`/colleges/${slugify(name)}`} style={{ color: 'var(--brand)', fontWeight: 600 }}>
                      View Branches
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </Shell>
  );
}
