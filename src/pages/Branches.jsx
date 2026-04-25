import { Accordion, AccordionDetails, AccordionSummary, Chip, List, ListItem, Paper, Stack, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import WorkIcon from '@mui/icons-material/Work';
import { branchGuides } from '../data/branchGuides.js';

export default function Branches() {
  return (
    <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, border: '1px solid #dbe3f0', maxWidth: 900, mx: 'auto' }}>
      <Typography variant="h5" sx={{ mb: 1 }}>Branches & Careers</Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        A practical overview to help students compare branch fit, career paths, and skill expectations.
      </Typography>
      <Stack spacing={1.5}>
        {branchGuides.map((branch) => (
          <Accordion key={branch.name} disableGutters>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography fontWeight={800}>{branch.name}</Typography>
                <Chip size="small" label="Guide" color="primary" variant="outlined" />
              </Stack>
            </AccordionSummary>
            <AccordionDetails>
              <Typography sx={{ mb: 1.5 }}>{branch.summary}</Typography>
              <Typography fontWeight={800}>Common careers</Typography>
              <List dense>
                {branch.careers.map((career) => (
                  <ListItem key={career} sx={{ gap: 1 }}>
                    <WorkIcon fontSize="small" color="action" />
                    {career}
                  </ListItem>
                ))}
              </List>
              <Typography fontWeight={800}>Skills to build</Typography>
              <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 1 }}>
                {branch.skills.map((skill) => <Chip key={skill} label={skill} />)}
              </Stack>
            </AccordionDetails>
          </Accordion>
        ))}
      </Stack>
    </Paper>
  );
}
