import { Checkbox, FormControl, InputLabel, ListItemText, MenuItem, OutlinedInput, Select } from '@mui/material';

export default function MultiSelect({ label, value, options, onChange }) {
  return (
    <FormControl fullWidth size="small">
      <InputLabel>{label}</InputLabel>
      <Select
        multiple
        value={value}
        onChange={(event) => onChange(event.target.value)}
        input={<OutlinedInput label={label} />}
        renderValue={(selected) => selected.join(', ')}
        MenuProps={{ PaperProps: { sx: { maxHeight: 360 } } }}
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
