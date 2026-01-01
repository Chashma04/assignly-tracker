import React from 'react';
import {
  Box,
  Container,
  Paper,
  BoxProps,
} from '@mui/material';

interface CenteredLayoutProps extends Omit<BoxProps, 'maxWidth'> {
  containerMaxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  paper?: boolean;
  paperElevation?: number;
  children: React.ReactNode;
}

export default function CenteredLayout({
  containerMaxWidth = 'sm',
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
      justifyContent="center"
      minHeight="100vh"
      p={2}
      {...boxProps}
    >
      <Container maxWidth={containerMaxWidth}>
        {paper ? (
          <Paper elevation={paperElevation} sx={{ p: 4 }}>
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