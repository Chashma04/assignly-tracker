import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  CardProps,
} from "@mui/material";

interface FormCardProps extends Omit<CardProps, "title"> {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function FormCard({
  title,
  subtitle,
  children,
  ...cardProps
}: FormCardProps) {
  return (
    <Card {...cardProps}>
      {(title || subtitle) && (
        <CardHeader
          sx={{ textAlign: "center" }}
          title={
            title && (
              <Typography variant="h5" component="h1">
                {title}
              </Typography>
            )
          }
          subheader={
            subtitle && (
              <Typography variant="body2" color="textSecondary">
                {subtitle}
              </Typography>
            )
          }
        />
      )}
      <CardContent>{children}</CardContent>
    </Card>
  );
}
