// DatePickerField.tsx
import React from "react";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/pt-br";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";

dayjs.locale("pt-br");

type DatePickerFieldProps = {
  value?: string | null;            
  onChange: (value: string) => void; 
  label?: string;
  placeholder?: string;
  required?: boolean;
  fullWidth?: boolean;
  size?: "small" | "medium";
  minDate?: string;
  maxDate?: string;
};

const DatePickerField: React.FC<DatePickerFieldProps> = ({
  value,
  onChange,
  label,
  placeholder = "DD/MM/YYYY",
  required = false,
  fullWidth = true,
  size = "small",
  minDate,
  maxDate,
}) => {
  const parsed: Dayjs | null = value ? dayjs(value, "YYYY-MM-DD") : null;

  return (
    <DatePicker
      format="DD/MM/YYYY"
      label={label}
      value={parsed}
      onChange={(newValue: Dayjs | null) => {
        if (!newValue) {
          onChange("");
          return;
        }
        onChange(newValue.format("YYYY-MM-DD"));
      }}
			
      minDate={minDate ? dayjs(minDate, "YYYY-MM-DD") : undefined}
      maxDate={maxDate ? dayjs(maxDate, "YYYY-MM-DD") : undefined}
      slotProps={{
				field: {					
					clearable: true,
				},
        textField: {
          size: 'small',
					fullWidth,
          sx: {
            '.MuiPickersInputBase-root': {
							height: 32,                    
							minHeight: 32,
							padding: 0,
						},
						'.MuiFormLabel-root': {
							top: '-3px'
						},
						'.css-1ysp02-MuiButtonBase-root-MuiIconButton-root': {
							right: '15px'
						},
						'.css-15395ss-MuiPickersSectionList-root-MuiPickersInputBase-sectionsContainer-MuiPickersOutlinedInput-sectionsContainer': {
							paddingLeft: '10px'
						}
          },
        },
      }}
    />
  );
};

export default DatePickerField;
