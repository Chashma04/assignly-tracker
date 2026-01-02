import React from "react";
import { Box, CircularProgress, Typography, BoxProps } from "@mui/material";

interface LoadingSpinnerProps extends BoxProps {
  size?: number | "small" | "medium" | "large";
  message?: string;
  fullScreen?: boolean;
}

export default function LoadingSpinner({
  size = "medium",
  message = "Loading...",
  fullScreen = false,
  ...boxProps
}: LoadingSpinnerProps) {
  const getSize = () => {
    if (typeof size === "number") return size;
    switch (size) {
      case "small":
        return 24;
      case "large":
        return 64;
      case "medium":
      default:
        return 40;
    }
  };

  const spinner = (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={2}
      {...boxProps}
    >
      <CircularProgress size={getSize()} />
      {message && (
        <Typography variant="body2" color="textSecondary">
          {message}
        </Typography>
      )}
    </Box>
  );

  if (fullScreen) {
    return (
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        display="flex"
        alignItems="center"
        justifyContent="center"
        bgcolor="rgba(255, 255, 255, 0.8)"
        zIndex={9999}
      >
        {spinner}
      </Box>
    );
  }

  return spinner;
}
