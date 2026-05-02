import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import SchoolIcon from '@mui/icons-material/School';
import ListAltIcon from '@mui/icons-material/ListAlt';
import DownloadIcon from '@mui/icons-material/Download';
import ChatIcon from '@mui/icons-material/Chat';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useState } from 'react';

const navItems = [
  { label: 'Home', to: '/', icon: HomeIcon },
  { label: 'College List', to: '/college-list', icon: ListAltIcon },
  { label: 'Check Cutoffs', to: '/check-cutoffs', icon: SchoolIcon },
  { label: 'Branches', to: '/branches', icon: AccountTreeIcon },
  { label: 'Downloads', to: '/downloads', icon: DownloadIcon },
  { label: 'Contact', to: '/contact', icon: ContactMailIcon },
  { label: 'Chatbot', to: '/chatbot', icon: ChatIcon },
];

export default function Shell() {
  const [anchor, setAnchor] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider', backdropFilter: 'blur(8px)', backgroundColor: 'rgba(255,255,255,0.86)' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ gap: 1.25, minHeight: { xs: 64, md: 72 } }}>
            {isMobile && (
              <IconButton onClick={(event) => setAnchor(event.currentTarget)} aria-label="Open navigation" size="large">
                <MenuIcon />
              </IconButton>
            )}
            <Typography
              variant="h6"
              component={NavLink}
              to="/"
              sx={{
                color: 'primary.main',
                fontWeight: 850,
                flexShrink: 0,
                textDecoration: 'none',
                fontSize: { xs: '1rem', md: '1.2rem' },
                letterSpacing: '-0.01em',
              }}
            >
              College Counselor
            </Typography>
            {!isMobile && (
              <Stack direction="row" spacing={0.75} sx={{ ml: 'auto' }}>
                {navItems.map((item) => {
                  const active = location.pathname === item.to;
                  return (
                    <Button
                      key={item.to}
                      component={NavLink}
                      to={item.to}
                      color={active ? 'primary' : 'inherit'}
                      variant={active ? 'contained' : 'text'}
                      startIcon={<item.icon />}
                      sx={{ px: 1.35 }}
                    >
                      {item.label}
                    </Button>
                  );
                })}
              </Stack>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
        {navItems.map((item) => (
          <MenuItem
            key={item.to}
            component={NavLink}
            to={item.to}
            onClick={() => setAnchor(null)}
            sx={{ minHeight: 44 }}
          >
            <item.icon style={{ marginRight: 10 }} fontSize="small" />
            {item.label}
          </MenuItem>
        ))}
      </Menu>

      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 } }}>
        <Outlet />
      </Container>
    </Box>
  );
}
