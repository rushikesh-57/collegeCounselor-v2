import { Box, Skeleton, Stack } from '@mui/material';

export default function PageSkeleton() {
  return (
    <Stack spacing={2.5}>
      <Skeleton variant="rounded" height={48} />
      <Skeleton variant="rounded" height={180} />
      <Box sx={{ display: 'grid', gap: 1 }}>
        {[...Array(6)].map((_, idx) => <Skeleton key={idx} variant="rounded" height={34} />)}
      </Box>
    </Stack>
  );
}
