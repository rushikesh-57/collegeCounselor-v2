import { Alert, Box, Button, Paper, Stack, Typography } from '@mui/material';
import { Component } from 'react';
import { captureException } from '../lib/monitoring';

export class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || 'Unexpected rendering error.' };
  }

  componentDidCatch(error, errorInfo) {
    captureException(error, { componentStack: errorInfo?.componentStack });
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', p: 2 }}>
          <Paper sx={{ p: 3, width: 'min(100%, 560px)' }}>
            <Stack spacing={2}>
              <Typography variant="h5">Something went wrong</Typography>
              <Alert severity="error">{this.state.message}</Alert>
              <Button variant="contained" onClick={() => window.location.reload()}>
                Reload App
              </Button>
            </Stack>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}
