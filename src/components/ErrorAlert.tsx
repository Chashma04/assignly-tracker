import React from "react";
import { Alert, AlertTitle, Collapse, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";

interface ErrorAlertProps {
  message: string;
  title?: string;
  severity?: "error" | "warning" | "info" | "success";
  onClose?: () => void;
  open?: boolean;
  autoHideDuration?: number;
}

export default function ErrorAlert({
  message,
  title,
  severity = "error",
  onClose,
  open = true,
  autoHideDuration,
}: ErrorAlertProps) {
  React.useEffect(() => {
    if (autoHideDuration && open) {
      const timer = setTimeout(() => {
        onClose?.();
      }, autoHideDuration);
      return () => clearTimeout(timer);
    }
  }, [autoHideDuration, open, onClose]);

  return (
    <Collapse in={open}>
      <Alert
        severity={severity}
        action={
          onClose && (
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={onClose}
            >
              <Close fontSize="inherit" />
            </IconButton>
          )
        }
        sx={{ mb: 2 }}
      >
        {title && <AlertTitle>{title}</AlertTitle>}
        {message}
      </Alert>
    </Collapse>
  );
}
