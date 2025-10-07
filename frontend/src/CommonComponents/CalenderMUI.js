import * as React from "react";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TextField, Box } from "@mui/material";

export default function CalenderMUI({ value, onChange }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ minWidth: 200 }}>
        <DateRangePicker
          startText="Start"
          endText="End"
          value={value}
          onChange={onChange}
          renderInput={(startProps, endProps) => (
            <>
              <TextField {...startProps} size="small" />
              <Box sx={{ mx: 2 }}> — </Box>
              <TextField {...endProps} size="small" />
            </>
          )}
        />
      </Box>
    </LocalizationProvider>
  );
}
