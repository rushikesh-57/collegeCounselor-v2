import { Alert, Box, CircularProgress, Stack, Typography } from '@mui/material';

export default function AsyncState({ loading, error, isEmpty, emptyMessage = 'No data found.', children, minHeight = 240 }) {
  if (loading) {
    return (
      <Box sx={{ minHeight, display: 'grid', placeItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (isEmpty) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ minHeight, color: 'text.secondary' }}>
        <Typography>{emptyMessage}</Typography>
      </Stack>
    );
  }

  return children;
}
