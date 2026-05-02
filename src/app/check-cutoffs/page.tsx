import Shell from '@/components/next/Shell';
import CheckCutoffsClient from '@/components/next/CheckCutoffsClient';

export const metadata = {
  title: 'Check Cutoffs',
  description: 'Compare branch-level CAP cutoff history by college with an interactive server-backed form.',
};

export default function CheckCutoffsPage() {
  return (
    <Shell>
      <CheckCutoffsClient />
    </Shell>
  );
}
