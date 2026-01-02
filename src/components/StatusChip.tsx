import React from "react";
import { Chip, ChipProps } from "@mui/material";
import { CheckCircle, Cancel, Schedule, Help } from "@mui/icons-material";

export type StatusType =
  | "completed"
  | "pending"
  | "overdue"
  | "cancelled"
  | "in-progress";

interface StatusChipProps extends Omit<ChipProps, "label" | "color" | "icon"> {
  status: StatusType;
  showIcon?: boolean;
}

const statusConfig = {
  completed: {
    label: "Completed",
    color: "success" as const,
    icon: <CheckCircle />,
  },
  pending: {
    label: "Pending",
    color: "warning" as const,
    icon: <Schedule />,
  },
  overdue: {
    label: "Overdue",
    color: "error" as const,
    icon: <Cancel />,
  },
  cancelled: {
    label: "Cancelled",
    color: "default" as const,
    icon: <Cancel />,
  },
  "in-progress": {
    label: "In Progress",
    color: "info" as const,
    icon: <Help />,
  },
};

export default function StatusChip({
  status,
  showIcon = true,
  ...chipProps
}: StatusChipProps) {
  const config = statusConfig[status];

  return (
    <Chip
      label={config.label}
      color={config.color}
      icon={showIcon ? config.icon : undefined}
      size="small"
      {...chipProps}
    />
  );
}
