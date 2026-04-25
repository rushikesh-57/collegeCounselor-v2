import { Alert, Autocomplete, Box, Button, CircularProgress, Grid, Paper, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import DataGrid from '../components/DataGrid.jsx';
import { api } from '../api/collegeApi.js';

export default function CheckCutoffs() {
  const [collegeData, setCollegeData] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getCollegeData()
      .then(setCollegeData)
      .catch((err) => setError(err.message))
      .finally(() => setInitialLoading(false));
  }, []);

  const colleges = useMemo(() => [...new Set(collegeData.map((row) => row.college_name))].sort(), [collegeData]);
  const branches = useMemo(() => {
    return [...new Set(collegeData.filter((row) => row.college_name === selectedCollege).map((row) => row.branch_name))].sort();
  }, [collegeData, selectedCollege]);

  async function submit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      setRows(await api.checkCutoff({ college_name: selectedCollege, branch_name: selectedBranch }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, border: '1px solid #dbe3f0' }}>
      <Stack spacing={0.5} sx={{ mb: 2 }}>
        <Typography variant="h5">Check Cutoffs</Typography>
        <Typography color="text.secondary">Review CAP cutoff history by college and branch.</Typography>
      </Stack>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {initialLoading ? (
        <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 320 }}><CircularProgress /></Box>
      ) : (
        <>
          <Box component="form" onSubmit={submit} sx={{ mb: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={5}>
                <Autocomplete
                  options={colleges}
                  value={selectedCollege}
                  onChange={(_, value) => { setSelectedCollege(value || ''); setSelectedBranch(''); }}
                  renderInput={(params) => <TextField {...params} required label="College Name" size="small" />}
                />
              </Grid>
              <Grid item xs={12} md={5}>
                <Autocomplete
                  options={branches}
                  value={selectedBranch}
                  disabled={!selectedCollege}
                  onChange={(_, value) => setSelectedBranch(value || '')}
                  renderInput={(params) => <TextField {...params} required label="Branch Name" size="small" />}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <Button fullWidth type="submit" variant="contained" disabled={loading || !selectedCollege || !selectedBranch} startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <SearchIcon />}>
                  Check
                </Button>
              </Grid>
            </Grid>
          </Box>
          <DataGrid rows={rows} height="62vh" />
        </>
      )}
    </Paper>
  );
}
