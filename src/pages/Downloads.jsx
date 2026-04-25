import { Button, Paper, Stack, Typography } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { publicStorageUrl } from '../api/collegeApi.js';

const files = [
  ['CAP Round 1 cutoff 2019-20', 'cutoffs/Cap 1 cutoff 2019-20.pdf'],
  ['CAP Round 1 cutoff 2020-21', 'cutoffs/Cap 1 cutoff 2020-21.pdf'],
  ['CAP Round 1 cutoff 2021-22', 'cutoffs/Cap 1 cutoff 2021-22.pdf'],
  ['CAP Round 1 cutoff 2022-23', 'cutoffs/Cap 1 cutoff 2022-23.pdf'],
  ['CAP Round 1 cutoff 2023-24', 'cutoffs/Cap 1 cutoff 2023-24.pdf'],
  ['CAP Round 1 cutoff 2024-25', 'cutoffs/Cap 1 cutoff 2024-25.pdf'],
];

export default function Downloads() {
  return (
    <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, border: '1px solid #dbe3f0', maxWidth: 720, mx: 'auto' }}>
      <Typography variant="h5" sx={{ mb: 1 }}>Downloads</Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>Public cutoff PDFs are served from Supabase Storage.</Typography>
      <Stack spacing={1.5}>
        {files.map(([label, path]) => (
          <Button key={path} href={publicStorageUrl(path)} target="_blank" rel="noreferrer" variant="contained" startIcon={<DownloadIcon />}>
            {label}
          </Button>
        ))}
      </Stack>
    </Paper>
  );
}
