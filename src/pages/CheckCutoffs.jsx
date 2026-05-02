import { Autocomplete, Box, Button, Grid, Paper, Stack, TextField, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import DataGrid from '../components/DataGrid.jsx';
import { api } from '../api/collegeApi.js';
import { useAsyncAction } from '../shared/hooks/useAsyncAction.js';
import { useAsyncQuery } from '../shared/hooks/useAsyncQuery.js';
import AsyncState from '../shared/ui/AsyncState.jsx';
import Seo from '../shared/ui/Seo.jsx';

export default function CheckCutoffs() {
  const [selectedCollege, setSelectedCollege] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [rows, setRows] = useState([]);

  const collegeQuery = useAsyncQuery(() => api.getCollegeData(), []);
  const cutoffAction = useAsyncAction((payload) => api.checkCutoff(payload));

  const colleges = useMemo(
    () => [...new Set((collegeQuery.data || []).map((row) => row.college_name))].sort(),
    [collegeQuery.data],
  );

  const branches = useMemo(
    () => [...new Set((collegeQuery.data || []).filter((row) => row.college_name === selectedCollege).map((row) => row.branch_name))].sort(),
    [collegeQuery.data, selectedCollege],
  );

  async function submit(event) {
    event.preventDefault();
    try {
      const result = await cutoffAction.execute({ college_name: selectedCollege, branch_name: selectedBranch });
      setRows(result || []);
    } catch {
      // handled in hook
    }
  }

  return (
    <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, border: '1px solid', borderColor: 'divider' }}>
      <Seo title="Check Cutoffs" description="Review CAP cutoff trends by selecting college and branch." />
      <Stack spacing={0.5} sx={{ mb: 2 }}>
        <Typography variant="h5">Check Cutoffs</Typography>
        <Typography color="text.secondary">Review CAP cutoff history by college and branch.</Typography>
      </Stack>

      <AsyncState loading={collegeQuery.loading} error={collegeQuery.error} isEmpty={!collegeQuery.data.length} emptyMessage="College data is not available.">
        <>
          <Box component="form" onSubmit={submit} sx={{ mb: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={5}>
                <Autocomplete
                  options={colleges}
                  value={selectedCollege}
                  onChange={(_, value) => { setSelectedCollege(value || ''); setSelectedBranch(''); }}
                  renderInput={(params) => <TextField {...params} required label="College Name" />}
                />
              </Grid>
              <Grid item xs={12} md={5}>
                <Autocomplete
                  options={branches}
                  value={selectedBranch}
                  disabled={!selectedCollege}
                  onChange={(_, value) => setSelectedBranch(value || '')}
                  renderInput={(params) => <TextField {...params} required label="Branch Name" />}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <Button fullWidth type="submit" variant="contained" disabled={cutoffAction.loading || !selectedCollege || !selectedBranch} startIcon={<SearchIcon />}>
                  {cutoffAction.loading ? 'Checking...' : 'Check'}
                </Button>
              </Grid>
            </Grid>
          </Box>
          <AsyncState loading={false} error={cutoffAction.error} isEmpty={!rows.length} emptyMessage="Run a search to view cutoff rows.">
            <DataGrid rows={rows} height="62vh" />
          </AsyncState>
        </>
      </AsyncState>
    </Paper>
  );
}
