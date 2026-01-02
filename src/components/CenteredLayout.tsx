import React from "react";
import { Box, Container, Paper, BoxProps } from "@mui/material";

interface CenteredLayoutProps extends Omit<BoxProps, "maxWidth"> {
  containerMaxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false;
  paper?: boolean;
  paperElevation?: number;
  children: React.ReactNode;
}

export default function CenteredLayout({
  containerMaxWidth = "sm",
  paper = false,
  paperElevation = 1,
  children,
  ...boxProps
}: CenteredLayoutProps) {
  const content = (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="flex-start"
      pt={{ xs: 8, sm: 10, md: 12 }}
      p={{ xs: 1.5, sm: 2 }}
      {...boxProps}
    >
      <Container maxWidth={containerMaxWidth}>
        {paper ? (
          <Paper
            elevation={paperElevation}
            sx={{ p: { xs: 2.5, sm: 3, md: 4 } }}
          >
            {children}
          </Paper>
        ) : (
          children
        )}
      </Container>
    </Box>
  );

  return content;
}
