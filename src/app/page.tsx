import Shell from '@/components/next/Shell';
import HomeClient from '@/components/next/HomeClient';

export const metadata = {
  title: 'College Predictor',
  description: 'Interactive MHT-CET college recommendation flow with server-rendered shell and SEO metadata.',
};

export default function HomePage() {
  return (
    <Shell>
      <HomeClient />
    </Shell>
  );
}
