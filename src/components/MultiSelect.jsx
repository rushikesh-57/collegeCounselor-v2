import { Checkbox, FormControl, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, Typography } from '@mui/material';

export default function MultiSelect({ label, value, options, onChange }) {
  return (
    <FormControl fullWidth size="small">
      <InputLabel>{label}</InputLabel>
      <Select
        multiple
        value={value}
        onChange={(event) => onChange(event.target.value)}
        input={<OutlinedInput label={label} />}
        renderValue={(selected) => {
          if (!selected.length) return `Select ${label.toLowerCase()}`;
          const text = selected.join(', ');
          const preview = text.length > 64 ? `${text.slice(0, 64)}...` : text;
          return <Typography sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{preview}</Typography>;
        }}
        MenuProps={{ PaperProps: { sx: { maxHeight: 360 } } }}
        sx={{ bgcolor: '#fff' }}
      >
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            <Checkbox checked={value.includes(option)} />
            <ListItemText primary={option} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
