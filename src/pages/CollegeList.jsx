import { Alert, Box, CircularProgress, Paper, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import DataGrid from '../components/DataGrid.jsx';
import { api } from '../api/collegeApi.js';

export default function CollegeList() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getCollegeData()
      .then(setRows)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, border: '1px solid #dbe3f0' }}>
      <Stack spacing={0.5} sx={{ mb: 2 }}>
        <Typography variant="h5">College List With Branch Details</Typography>
        <Typography color="text.secondary">Search, filter, and compare available college branch combinations.</Typography>
      </Stack>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading ? (
        <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 320 }}>
          <CircularProgress />
        </Box>
      ) : (
        <DataGrid rows={rows} height="72vh" />
      )}
    </Paper>
  );
}
