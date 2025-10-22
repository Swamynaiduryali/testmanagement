import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  // "& .MuiDialogContent-root": {
  //   padding: theme.spacing(2),
  // },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

// The component now accepts 'open', 'onClose', 'buttons', and 'width' as props
export const Modalpopup = ({
  header,
  content,
  open,
  onClose,
  buttons,
  width,
  height,
  padding,
}) => {
  return (
    <React.Fragment>
      <BootstrapDialog
        onClose={onClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        sx={{
          "& .MuiPaper-root": {
            width: width,
            maxWidth: "1400px",
            height: height,
            maxHeight: "700px",
          },
        }} // Corrected syntax
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          {header}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent sx={{ padding: padding }} dividers>
          {/* <div>{content}</div> */}
          {content}
          {/* <Typography gutterBottom>{content}</Typography> */}
        </DialogContent>
        {buttons && (
          <DialogActions>
            {buttons} {/* Correctly render the buttons prop here */}
          </DialogActions>
        )}
      </BootstrapDialog>
    </React.Fragment>
  );
};
