import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { useState } from 'react';
import DataGrid from '../components/DataGrid.jsx';
import MultiSelect from '../components/MultiSelect.jsx';
import { api, downloadBase64File } from '../api/collegeApi.js';
import { branchList, casteOptions, defaultFormData, districtList, homeDistrictGroups } from '../data/formOptions.js';

const yesNoFields = [
  ['ews', 'EWS'],
  ['pwd', 'Disability'],
  ['def', 'Defence'],
  ['tfws', 'TFWS'],
  ['orphan', 'Orphan'],
  ['mi', 'Minority'],
];

export default function Home() {
  const [form, setForm] = useState(defaultFormData);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  async function submit(event) {
    event.preventDefault();
    setError('');
    if (!/^\d{10}$/.test(form.mobileNumber)) {
      setError('Enter a valid 10-digit mobile number.');
      return;
    }
    if (!form.rank || !form.homeUniversity) {
      setError('Rank and 12th board exam district are required.');
      return;
    }
    setLoading(true);
    try {
      setRows(await api.recommendColleges(form));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function exportFile(type) {
    setError('');
    try {
      const result = type === 'excel' ? await api.exportExcel(rows) : await api.exportPdf(rows);
      downloadBase64File(result);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <Stack spacing={3}>
      <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, border: '1px solid #dbe3f0' }}>
        <Stack spacing={0.5} sx={{ mb: 2 }}>
          <Typography variant="h4">Find safer engineering college options</Typography>
          <Typography color="text.secondary">
            Enter your MHT-CET rank and preferences to get a ranked list based on CAP cutoff history.
          </Typography>
        </Stack>

        <Box component="form" onSubmit={submit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth required size="small" label="Mobile Number" value={form.mobileNumber} onChange={(e) => setField('mobileNumber', e.target.value)} inputProps={{ maxLength: 10 }} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth required size="small" label="State General Merit No" type="number" value={form.rank} onChange={(e) => setField('rank', e.target.value)} />
            </Grid>
            <Grid item xs={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Gender</InputLabel>
                <Select label="Gender" value={form.gender} onChange={(e) => setField('gender', e.target.value)}>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Caste</InputLabel>
                <Select label="Caste" value={form.caste} onChange={(e) => setField('caste', e.target.value)}>
                  {casteOptions.map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>

            {yesNoFields.map(([field, label]) => (
              <Grid key={field} item xs={6} sm={4} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>{label}</InputLabel>
                  <Select label={label} value={form[field]} onChange={(e) => setField(field, e.target.value)}>
                    <MenuItem value="No">No</MenuItem>
                    <MenuItem value="Yes">Yes</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            ))}

            <Grid item xs={12} md={4}>
              <FormControl fullWidth required size="small">
                <InputLabel>12th Board Exam District</InputLabel>
                <Select label="12th Board Exam District" value={form.homeUniversity} onChange={(e) => setField('homeUniversity', e.target.value)}>
                  {homeDistrictGroups.map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <MultiSelect label="Preferred Districts" value={form.preferredDistricts} options={districtList} onChange={(value) => setField('preferredDistricts', value)} />
            </Grid>
            <Grid item xs={12} md={4}>
              <MultiSelect label="Preferred Branches" value={form.preferredBranches} options={branchList} onChange={(value) => setField('preferredBranches', value)} />
            </Grid>
          </Grid>

          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 2 }}>
            <Button type="submit" variant="contained" startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <SearchIcon />} disabled={loading}>
              Get Suggestions
            </Button>
            <Button variant="outlined" startIcon={<RestartAltIcon />} onClick={() => { setForm(defaultFormData); setRows([]); }}>
              Reset
            </Button>
          </Stack>
        </Box>
      </Paper>

      <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, border: '1px solid #dbe3f0' }}>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2} sx={{ mb: 2 }}>
          <Box>
            <Typography variant="h6">Recommendation Results</Typography>
            <Typography variant="body2" color="text.secondary">Rows above your rank are marked stronger; lower cutoff rows are reach options.</Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Button disabled={!rows.length} onClick={() => exportFile('excel')} startIcon={<FileDownloadIcon />}>Excel</Button>
            <Button disabled={!rows.length} onClick={() => exportFile('pdf')} startIcon={<PictureAsPdfIcon />}>PDF</Button>
          </Stack>
        </Stack>
        <DataGrid
          rows={rows}
          getRowStyle={(params) => {
            const cutoff = Number(params.data?.cap_round_1 ?? params.data?.['CAP Round 1']);
            const rank = Number(form.rank);
            if (!cutoff || !rank) return undefined;
            return cutoff > rank ? { backgroundColor: '#e7f6ee' } : { backgroundColor: '#fff0ed' };
          }}
        />
      </Paper>
    </Stack>
  );
}
