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
  const [visible, setVisible] = React.useState(open);

  React.useEffect(() => {
    setVisible(open);
  }, [open]);

  React.useEffect(() => {
    if (autoHideDuration && visible) {
      const timer = setTimeout(() => {
        setVisible(false);
        onClose?.();
      }, autoHideDuration);
      return () => clearTimeout(timer);
    }
  }, [autoHideDuration, visible, onClose]);

  const handleClose = () => {
    setVisible(false);
    onClose?.();
  };

  return (
    <Collapse in={visible}>
      <Alert
        severity={severity}
        action={
          onClose && (
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={handleClose}
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
