import React from "react";
import { useDropzone } from "react-dropzone";
import { Button, Typography, Box } from "@mui/material";
import { CloudUpload } from "@mui/icons-material";

interface FileInputProps {
  onChange: (file: File | null) => void;
  accept?: string;
  multiple?: boolean;
  selectedFile?: File | null;
  placeholder?: string;
  onUpload?: () => void;
  uploadLabel?: string;
  uploading?: boolean;
  fullWidth?: boolean;
  variant?: "outlined" | "contained" | "text";
}

export default function FileInput({
  onChange,
  accept,
  multiple = false,
  selectedFile,
  placeholder = "No file selected",
  onUpload,
  uploadLabel = "Upload",
  uploading = false,
}: FileInputProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      onChange(acceptedFiles[0] || null);
    },
    accept: accept ? { [accept]: accept.split(",") } : undefined,
    multiple,
    noClick: true,
  });

  const handleBrowseClick = () => {
    document.getElementById("file-input")?.click();
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}>
      <Box
        {...getRootProps()}
        sx={{
          flex: 1,
          minWidth: 0,
          border: 1,
          borderColor: isDragActive ? "primary.main" : "divider",
          borderRadius: 1,
          px: 1.5,
          py: 1,
          backgroundColor: (theme) =>
            isDragActive
              ? theme.palette.mode === "dark"
                ? "rgba(92, 107, 192, 0.15)"
                : "rgba(57, 73, 171, 0.08)"
              : theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.05)"
                : "rgba(0, 0, 0, 0.02)",
          "&:hover": {
            backgroundColor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.08)"
                : "rgba(0, 0, 0, 0.04)",
            borderColor: "primary.main",
          },
          transition: "all 0.2s ease",
          cursor: "pointer",
        }}
        onClick={handleBrowseClick}
      >
        <input {...getInputProps()} id="file-input" />
        <Typography
          variant="body2"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            color: selectedFile ? "text.primary" : "text.secondary",
            fontSize: "0.875rem",
          }}
        >
          {isDragActive
            ? "Drop file here..."
            : selectedFile
              ? selectedFile.name
              : placeholder}
        </Typography>
      </Box>
      <Button
        onClick={handleBrowseClick}
        startIcon={<CloudUpload />}
        component="span"
        size="small"
        variant="outlined"
      >
        Browse
      </Button>
      {onUpload && (
        <Button
          variant="contained"
          disabled={!selectedFile || uploading}
          onClick={onUpload}
          sx={{ minWidth: "120px" }}
        >
          {uploading ? "Uploading..." : uploadLabel}
        </Button>
      )}
    </Box>
  );
}
