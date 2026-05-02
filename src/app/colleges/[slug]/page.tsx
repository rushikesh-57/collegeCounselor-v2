import { notFound } from 'next/navigation';
import Shell from '@/components/next/Shell';
import { getCollegeData, slugify } from '@/lib/data';

export const revalidate = 3600;

export async function generateStaticParams() {
  const rows = await getCollegeData();
  const names = [...new Set(rows.map((row) => String(row.college_name || '')).filter(Boolean))];
  return names.map((name) => ({ slug: slugify(name) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return {
    title: `College Details - ${slug.replaceAll('-', ' ')}`,
    description: 'Branch-level cutoff and seat profile.',
  };
}

export default async function CollegeProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const rows = await getCollegeData();

  const grouped = rows.filter((row) => slugify(String(row.college_name || '')) === slug);
  if (!grouped.length) notFound();

  const collegeName = String(grouped[0].college_name);

  return (
    <Shell>
      <section className="card">
        <h1>{collegeName}</h1>
        <p>Server-rendered profile page with branch-level data.</p>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Branch</th>
                <th>CAP Round 1</th>
                <th>CAP Round 2</th>
                <th>CAP Round 3</th>
              </tr>
            </thead>
            <tbody>
              {grouped.slice(0, 200).map((row, idx) => (
                <tr key={`${row.branch_name}-${idx}`}>
                  <td>{String(row.branch_name ?? '-')}</td>
                  <td>{String(row.cap_round_1 ?? '-')}</td>
                  <td>{String(row.cap_round_2 ?? '-')}</td>
                  <td>{String(row.cap_round_3 ?? '-')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </Shell>
  );
}
