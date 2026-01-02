import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import { SxProps, Theme } from "@mui/material";

interface DatePickerFieldProps {
  label: string;
  value: Dayjs | null;
  onChange: (newValue: Dayjs | null) => void;
  required?: boolean;
  fullWidth?: boolean;
  error?: boolean;
  helperText?: string;
  minDate?: Dayjs;
  maxDate?: Dayjs;
  disabled?: boolean;
  sx?: SxProps<Theme>;
}

export default function DatePickerField({
  label,
  value,
  onChange,
  required = false,
  fullWidth = true,
  error = false,
  helperText,
  minDate,
  maxDate,
  disabled = false,
  sx,
}: DatePickerFieldProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={label}
        value={value}
        onChange={onChange}
        minDate={minDate}
        maxDate={maxDate}
        disabled={disabled}
        slotProps={{
          textField: {
            required,
            fullWidth,
            error,
            helperText,
            sx,
          },
        }}
      />
    </LocalizationProvider>
  );
}
