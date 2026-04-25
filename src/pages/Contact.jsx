import { Button, Paper, Stack, Typography } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';

export default function Contact() {
  return (
    <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, border: '1px solid #dbe3f0', maxWidth: 680, mx: 'auto' }}>
      <Typography variant="h5" sx={{ mb: 1 }}>Need Personal College Counselling?</Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Reach out for personalized guidance around college selection, CAP strategy, and branch fit.
      </Typography>
      <Stack spacing={1.5}>
        <Typography><strong>Email:</strong> caproundadvisor@gmail.com</Typography>
        <Typography><strong>Phone:</strong> +91-9585582399</Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <Button href="mailto:caproundadvisor@gmail.com" variant="outlined" startIcon={<EmailIcon />}>Email</Button>
          <Button href="https://wa.me/9585582399?text=Hello%20I%20need%20college%20counselling" target="_blank" rel="noreferrer" variant="contained" color="success" startIcon={<WhatsAppIcon />}>
            WhatsApp
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
