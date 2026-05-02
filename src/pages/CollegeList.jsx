import { Paper, Stack, Typography } from '@mui/material';
import DataGrid from '../components/DataGrid.jsx';
import { api } from '../api/collegeApi.js';
import AsyncState from '../shared/ui/AsyncState.jsx';
import { useAsyncQuery } from '../shared/hooks/useAsyncQuery.js';
import Seo from '../shared/ui/Seo.jsx';

export default function CollegeList() {
  const { data: rows, loading, error } = useAsyncQuery(() => api.getCollegeData(), []);

  return (
    <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, border: '1px solid', borderColor: 'divider' }}>
      <Seo title="College List" description="Explore engineering colleges and branch combinations in one responsive view." />
      <Stack spacing={0.5} sx={{ mb: 2 }}>
        <Typography variant="h5">College List With Branch Details</Typography>
        <Typography color="text.secondary">Search, filter, and compare available college branch combinations.</Typography>
      </Stack>

      <AsyncState loading={loading} error={error} isEmpty={!rows.length}>
        <DataGrid rows={rows} height="72vh" />
      </AsyncState>
    </Paper>
  );
}
