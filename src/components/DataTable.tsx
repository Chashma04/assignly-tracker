import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TableSortLabel,
  Checkbox,
  IconButton,
  Box,
  Typography,
} from "@mui/material";

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}

export interface TableAction<T> {
  label: string;
  icon?: React.ReactNode;
  onClick: (row: T) => void;
  color?: "primary" | "secondary" | "error" | "info" | "success" | "warning";
}

interface DataTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
  selectable?: boolean;
  onSelectionChange?: (selected: T[]) => void;
  loading?: boolean;
  emptyMessage?: string;
  showSerialNumber?: boolean;
}

export default function DataTable<T extends Record<string, any>>({
  data,
  columns,
  actions = [],
  selectable = false,
  onSelectionChange,
  loading = false,
  emptyMessage = "No data available",
  showSerialNumber = false,
}: DataTableProps<T>) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selected, setSelected] = React.useState<T[]>([]);
  const [orderBy, setOrderBy] = React.useState<keyof T | "">("");
  const [order, setOrder] = React.useState<"asc" | "desc">("asc");

  const handleRequestSort = (property: keyof T) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = data;
      setSelected(newSelected);
      onSelectionChange?.(newSelected);
      return;
    }
    setSelected([]);
    onSelectionChange?.([]);
  };

  const handleClick = (row: T) => {
    if (!selectable) return;

    const selectedIndex = selected.findIndex((item) => item === row);
    let newSelected: T[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, row);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
    onSelectionChange?.(newSelected);
  };

  const isSelected = (row: T) => selected.indexOf(row) !== -1;

  const sortedData = React.useMemo(() => {
    if (!orderBy) return data;

    return [...data].sort((a, b) => {
      const aValue = a[orderBy];
      const bValue = b[orderBy];

      if (aValue < bValue) {
        return order === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return order === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [data, order, orderBy]);

  const paginatedData = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer
        sx={{
          maxHeight: "calc(98vh - 280px)",
          minHeight: "400px",
          overflowX: "auto",
        }}
      >
        <Table
          stickyHeader
          sx={{
            "& .MuiTableCell-root": {
              borderLeft: "none",
              borderRight: "none",
              borderBottom: (theme) =>
                theme.palette.mode === "dark"
                  ? "1px solid rgba(255, 255, 255, 0.12)"
                  : "1px solid rgba(0, 0, 0, 0.12)",
            },
          }}
        >
          <TableHead>
            <TableRow
              sx={{
                borderBottom: "2px solid",
                borderColor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.12)"
                    : "rgba(0, 0, 0, 0.12)",
              }}
            >
              {showSerialNumber && (
                <TableCell
                  sx={{
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    fontWeight: "bold",
                    backgroundColor: (theme) =>
                      theme.palette.mode === "dark" ? "#1a2332" : "#fff",
                  }}
                >
                  Sl No
                </TableCell>
              )}
              {selectable && (
                <TableCell
                  padding="checkbox"
                  sx={{
                    backgroundColor: (theme) =>
                      theme.palette.mode === "dark" ? "#1a2332" : "#fff",
                  }}
                >
                  <Checkbox
                    indeterminate={
                      selected.length > 0 && selected.length < data.length
                    }
                    checked={data.length > 0 && selected.length === data.length}
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
              )}
              {columns.map((column) => (
                <TableCell
                  key={String(column.key)}
                  sx={{
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    fontWeight: "bold",
                    backgroundColor: (theme) =>
                      theme.palette.mode === "dark" ? "#1a2332" : "#fff",
                  }}
                >
                  {column.sortable ? (
                    <TableSortLabel
                      active={orderBy === column.key}
                      direction={orderBy === column.key ? order : "asc"}
                      onClick={() => handleRequestSort(column.key)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
              {actions.length > 0 && (
                <TableCell
                  sx={{
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    fontWeight: "bold",
                    backgroundColor: (theme) =>
                      theme.palette.mode === "dark" ? "#1a2332" : "#fff",
                  }}
                >
                  Actions
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={
                    columns.length +
                    (showSerialNumber ? 1 : 0) +
                    (selectable ? 1 : 0) +
                    (actions.length > 0 ? 1 : 0)
                  }
                  align="center"
                >
                  <Typography variant="body2" color="textSecondary">
                    {emptyMessage}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, index) => {
                const isItemSelected = isSelected(row);
                return (
                  <TableRow
                    key={index}
                    hover
                    onClick={() => handleClick(row)}
                    selected={isItemSelected}
                    sx={{
                      cursor: selectable ? "pointer" : "default",
                      borderBottom: "1px solid",
                      borderColor: (theme) =>
                        theme.palette.mode === "dark"
                          ? "rgba(255, 255, 255, 0.12)"
                          : "rgba(0, 0, 0, 0.12)",
                    }}
                  >
                    {showSerialNumber && (
                      <TableCell
                        sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                      >
                        {page * rowsPerPage + index + 1}
                      </TableCell>
                    )}
                    {selectable && (
                      <TableCell padding="checkbox">
                        <Checkbox checked={isItemSelected} />
                      </TableCell>
                    )}
                    {columns.map((column) => (
                      <TableCell
                        key={String(column.key)}
                        sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                      >
                        {column.render
                          ? column.render(row[column.key], row)
                          : String(row[column.key] || "")}
                      </TableCell>
                    ))}
                    {actions.length > 0 && (
                      <TableCell>
                        <Box display="flex" gap={0.5} justifyContent="center">
                          {actions.map((action, actionIndex) => (
                            <IconButton
                              key={actionIndex}
                              size="small"
                              color={action.color || "primary"}
                              onClick={(e) => {
                                e.stopPropagation();
                                action.onClick(row);
                              }}
                              title={action.label}
                            >
                              {action.icon}
                            </IconButton>
                          ))}
                        </Box>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
