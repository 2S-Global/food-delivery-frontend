// components/DatePickerComponent.jsx
import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import { format } from "date-fns";
import enGB from "date-fns/locale/en-GB"; // Import enGB locale

const DatePickerComponent = ({
  label,
  value,
  onChange,
  placeholder = "dd-mm-yyyy",
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
      <DatePicker
        label={label}
        value={value}
        onChange={onChange}
        format="dd-MM-yyyy" // Use 'format' instead of 'inputFormat'
        maxDate={new Date()}
        slotProps={{
          textField: {
            onChange: (e) => {
              const parsed = parseDateInput(e.target.value, new Date());
              onChange(parsed);
            },
          },
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            inputProps={{
              ...params.inputProps,
              value: value
                ? format(value, "dd-MM-yyyy", { locale: enGB })
                : "",
              placeholder,
            }}
          />
        )}
      />
    </LocalizationProvider>
  );
};

// Helper function to parse the date input
const parseDateInput = (input, referenceDate) => {
  if (!input) return null;
  try {
    // Parse input as dd-MM-yyyy
    const parsedDate = parse(input, "dd-MM-yyyy", referenceDate, {
      locale: enGB,
    });
    if (isNaN(parsedDate)) return null;
    return parsedDate;
  } catch (err) {
    console.error("Date parsing error:", err);
    return null;
  }
};

export default DatePickerComponent;
