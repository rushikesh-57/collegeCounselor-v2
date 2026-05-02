import { useMemo } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

export default function DataGrid({ rows, height = '62vh', getRowStyle }) {
  const headers = useMemo(() => {
    if (!rows?.length) return [];
    const seen = new Set();
    return Object.keys(rows[0])
      .filter((key) => !seen.has(key.toLowerCase()) && seen.add(key.toLowerCase()))
      .map((key) => ({
        key,
        label: key.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase()),
      }));
  }, [rows]);

  if (!rows?.length) {
    return (
      <Box sx={{ py: 5, textAlign: 'center', color: 'text.secondary' }}>
        <Typography>No data to display.</Typography>
      </Box>
    );
  }

  return (
    <Paper variant="outlined" sx={{ borderColor: 'divider' }}>
      <TableContainer sx={{ maxHeight: height, overflowX: 'auto' }}>
        <Table size="small" stickyHeader sx={{ minWidth: 880 }} aria-label="Results table">
          <TableHead>
            <TableRow>
              {headers.map((header) => (
                <TableCell key={header.key} sx={{ fontWeight: 800, whiteSpace: 'nowrap' }}>
                  {header.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, rowIndex) => {
              const style = getRowStyle ? getRowStyle({ data: row, rowIndex }) : undefined;
              return (
                <TableRow key={`row-${rowIndex}`} sx={{ backgroundColor: style?.backgroundColor }}>
                  {headers.map((header) => (
                    <TableCell key={`${rowIndex}-${header.key}`} sx={{ whiteSpace: 'nowrap', py: 1.2 }}>
                      {String(row[header.key] ?? '-')}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
