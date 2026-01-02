import React from "react";
import { Button, CircularProgress, ButtonProps } from "@mui/material";

interface LoadingButtonProps extends Omit<
  ButtonProps,
  "startIcon" | "endIcon"
> {
  loading?: boolean;
  loadingText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export default function LoadingButton({
  loading = false,
  loadingText,
  children,
  disabled,
  startIcon,
  endIcon,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      {...props}
      disabled={disabled || loading}
      startIcon={
        loading && !endIcon ? (
          <CircularProgress size={20} color="inherit" />
        ) : (
          startIcon
        )
      }
      endIcon={
        loading && !startIcon ? (
          <CircularProgress size={20} color="inherit" />
        ) : (
          endIcon
        )
      }
    >
      {loading && loadingText ? loadingText : children}
    </Button>
  );
}
