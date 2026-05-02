import {
  Alert,
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { useMemo, useState } from 'react';
import DataGrid from '../components/DataGrid.jsx';
import MultiSelect from '../components/MultiSelect.jsx';
import { api, downloadBase64File } from '../api/collegeApi.js';
import { branchList, casteOptions, defaultFormData, districtList, homeDistrictGroups } from '../data/formOptions.js';
import { validateMobileNumber, validateRequiredFields } from '../shared/lib/validators.js';
import { useAsyncAction } from '../shared/hooks/useAsyncAction.js';
import Seo from '../shared/ui/Seo.jsx';

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
  const [formError, setFormError] = useState('');

  const recommendation = useAsyncAction(api.recommendColleges);
  const fileExport = useAsyncAction(async (type, dataRows) => {
    const result = type === 'excel' ? await api.exportExcel(dataRows) : await api.exportPdf(dataRows);
    downloadBase64File(result);
  });

  const requestError = formError || recommendation.error || fileExport.error;

  const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  async function submit(event) {
    event.preventDefault();
    setFormError('');

    if (!validateMobileNumber(form.mobileNumber)) {
      setFormError('Enter a valid 10-digit mobile number.');
      return;
    }

    const missing = validateRequiredFields(form, ['rank', 'homeUniversity']);
    if (missing.length) {
      setFormError('Rank and 12th board exam district are required.');
      return;
    }

    try {
      const response = await recommendation.execute(form);
      setRows(response || []);
    } catch {
      // error already handled in hook
    }
  }

  async function exportFile(type) {
    try {
      await fileExport.execute(type, rows);
    } catch {
      // error already handled in hook
    }
  }

  const rowStyle = useMemo(() => (
    (params) => {
      const cutoff = Number(params.data?.cap_round_1 ?? params.data?.['CAP Round 1']);
      const rank = Number(form.rank);
      if (!cutoff || !rank) return undefined;
      return cutoff > rank ? { backgroundColor: '#e8f7ef' } : { backgroundColor: '#fff3ef' };
    }
  ), [form.rank]);

  return (
    <Stack spacing={3}>
      <Seo
        title="College Predictor"
        description="Mobile-first counseling flow to find safer engineering college options based on MHT-CET cutoffs."
      />

      <Paper elevation={0} sx={{ p: { xs: 2, sm: 2.5, md: 3 }, border: '1px solid', borderColor: 'divider' }}>
        <Stack spacing={1} sx={{ mb: 3 }}>
          <Typography variant="h4">Find safer engineering college options</Typography>
          <Typography color="text.secondary">
            Enter your MHT-CET rank and preferences to get ranked recommendations from historical CAP cutoffs.
          </Typography>
        </Stack>

        <Box component="form" onSubmit={submit}>
          <Stack spacing={2.5}>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>Student Details</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} lg={3}>
                  <TextField
                    fullWidth
                    required
                    label="Mobile Number"
                    value={form.mobileNumber}
                    onChange={(e) => setField('mobileNumber', e.target.value.replace(/\D/g, ''))}
                    inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                    helperText="10-digit contact number"
                  />
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                  <TextField
                    fullWidth
                    required
                    label="State General Merit No"
                    type="number"
                    value={form.rank}
                    onChange={(e) => setField('rank', e.target.value)}
                    helperText="Your MHT-CET state rank"
                  />
                </Grid>
                <Grid item xs={6} lg={3}>
                  <FormControl fullWidth>
                    <InputLabel>Gender</InputLabel>
                    <Select label="Gender" value={form.gender} onChange={(e) => setField('gender', e.target.value)}>
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6} lg={3}>
                  <FormControl fullWidth>
                    <InputLabel>Caste</InputLabel>
                    <Select label="Caste" value={form.caste} onChange={(e) => setField('caste', e.target.value)}>
                      {casteOptions.map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>

            <Divider />

            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>Reservation & Quota</Typography>
              <Grid container spacing={2}>
                {yesNoFields.map(([field, label]) => (
                  <Grid key={field} item xs={6} sm={4} md={3} lg={2}>
                    <FormControl fullWidth>
                      <InputLabel>{label}</InputLabel>
                      <Select label={label} value={form[field]} onChange={(e) => setField(field, e.target.value)}>
                        <MenuItem value="No">No</MenuItem>
                        <MenuItem value="Yes">Yes</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                ))}
              </Grid>
            </Box>

            <Divider />

            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>Preferences</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth required>
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
            </Box>
          </Stack>

          {requestError && <Alert severity="error" sx={{ mt: 2 }}>{requestError}</Alert>}

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 2 }}>
            <Button type="submit" variant="contained" startIcon={<SearchIcon />} disabled={recommendation.loading} fullWidth>
              {recommendation.loading ? 'Loading suggestions...' : 'Get Suggestions'}
            </Button>
            <Button variant="outlined" startIcon={<RestartAltIcon />} onClick={() => { setForm(defaultFormData); setRows([]); setFormError(''); }} fullWidth>
              Reset
            </Button>
          </Stack>
        </Box>
      </Paper>

      <Paper elevation={0} sx={{ p: { xs: 2, sm: 2.5, md: 3 }, border: '1px solid', borderColor: 'divider' }}>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2} sx={{ mb: 2 }}>
          <Box>
            <Typography variant="h6">Recommendation Results</Typography>
            <Typography variant="body2" color="text.secondary">Safer options are highlighted green; reach options are highlighted orange.</Typography>
          </Box>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <Button disabled={!rows.length || fileExport.loading} onClick={() => exportFile('excel')} startIcon={<FileDownloadIcon />} fullWidth>
              Excel
            </Button>
            <Button disabled={!rows.length || fileExport.loading} onClick={() => exportFile('pdf')} startIcon={<PictureAsPdfIcon />} fullWidth>
              PDF
            </Button>
          </Stack>
        </Stack>
        <DataGrid rows={rows} getRowStyle={rowStyle} />
      </Paper>
    </Stack>
  );
}
