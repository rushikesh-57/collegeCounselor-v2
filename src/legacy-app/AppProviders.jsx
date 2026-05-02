import { CssBaseline, ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material';

let theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1141c1' },
    secondary: { main: '#0d8f6f' },
    background: { default: '#f4f7fb', paper: '#ffffff' },
    text: { primary: '#101828', secondary: '#475467' },
    error: { main: '#b42318' },
    warning: { main: '#dc6803' },
    success: { main: '#027a48' },
    divider: '#d0dbe9',
  },
  spacing: 8,
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: ['Manrope', 'Inter', 'Segoe UI', 'sans-serif'].join(','),
    h4: { fontWeight: 800, letterSpacing: '-0.02em' },
    h5: { fontWeight: 780, letterSpacing: '-0.01em' },
    h6: { fontWeight: 740 },
    button: { textTransform: 'none', fontWeight: 700 },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true, size: 'medium' },
      styleOverrides: {
        root: { borderRadius: 10, minHeight: 42, paddingInline: 16 },
      },
    },
    MuiTextField: {
      defaultProps: { size: 'small' },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
  },
});

theme = responsiveFontSizes(theme);

export default function AppProviders({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
