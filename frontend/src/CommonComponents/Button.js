import * as React from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

export const CommonButton = ({
  variant,
  children,
  height,
  width,
  bgColor,
  hoverBgColor,
  // activeBgColor,
  textTransform,
  onClick,
  startIcon,
  endIcon,
  type = "button",
}) => {
  return (
    <Stack spacing={2} direction="row">
      <Button
        variant={variant}
        onClick={onClick}
        type={type}
        startIcon={startIcon}
        endIcon={endIcon}
        sx={{
          height: height,
          width: width,
          backgroundColor: bgColor,
          textTransform: textTransform || "none", // default none if not provided
          "&:hover": {
            backgroundColor: hoverBgColor || bgColor,
          },
          // "&:active": {
          //   backgroundColor: activeBgColor || bgColor,
          // },
        }}
      >
        {children}
      </Button>
    </Stack>
  );
};
