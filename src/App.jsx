import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { Navigate, Route, Routes } from 'react-router-dom';
import Shell from './components/Shell.jsx';
import Home from './pages/Home.jsx';
import CollegeList from './pages/CollegeList.jsx';
import CheckCutoffs from './pages/CheckCutoffs.jsx';
import Branches from './pages/Branches.jsx';
import Downloads from './pages/Downloads.jsx';
import Contact from './pages/Contact.jsx';
import Chatbot from './pages/Chatbot.jsx';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1f5eff' },
    secondary: { main: '#00897b' },
    background: { default: '#f6f8fb', paper: '#ffffff' },
    success: { main: '#19764a' },
    error: { main: '#b42318' },
  },
  typography: {
    fontFamily: ['Inter', 'Roboto', 'Arial', 'sans-serif'].join(','),
    h4: { fontWeight: 800 },
    h5: { fontWeight: 800 },
    h6: { fontWeight: 750 },
    button: { textTransform: 'none', fontWeight: 700 },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { borderRadius: 8 } },
    },
    MuiPaper: {
      styleOverrides: { root: { backgroundImage: 'none' } },
    },
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route element={<Shell />}>
          <Route path="/" element={<Home />} />
          <Route path="/college-list" element={<CollegeList />} />
          <Route path="/check-cutoffs" element={<CheckCutoffs />} />
          <Route path="/branches" element={<Branches />} />
          <Route path="/downloads" element={<Downloads />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}
