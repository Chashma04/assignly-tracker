import { useState, useMemo } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";

export interface FilterConfig<T> {
  key: string;
  label: string;
  getOptions: (data: T[]) => string[];
  filterFn: (item: T, value: string) => boolean;
}

interface DataFilterProps<T> {
  data: T[];
  title: string;
  filters: FilterConfig<T>[];
  children: (filteredData: T[]) => React.ReactNode;
}

export default function DataFilter<T>({
  data,
  title,
  filters,
  children,
}: DataFilterProps<T>) {
  const [filterValues, setFilterValues] = useState<Record<string, string>>(
    () => {
      const initial: Record<string, string> = {};
      filters.forEach((filter) => {
        initial[filter.key] = "";
      });
      return initial;
    },
  );

  const filterOptions = useMemo(() => {
    const options: Record<string, string[]> = {};
    filters.forEach((filter) => {
      options[filter.key] = filter.getOptions(data);
    });
    return options;
  }, [data, filters]);

  const filteredData = useMemo(() => {
    let result = data;
    filters.forEach((filter) => {
      const value = filterValues[filter.key];
      if (value) {
        result = result.filter((item) => filter.filterFn(item, value));
      }
    });
    return result;
  }, [data, filters, filterValues]);

  const handleFilterChange = (key: string, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h6">{title}</Typography>
        {filters.length > 0 && (
          <Box sx={{ display: "flex", gap: 2 }}>
            {filters.map((filter) => (
              <FormControl
                key={filter.key}
                sx={{ minWidth: filters.length > 1 ? 150 : 200 }}
                size="small"
              >
                <InputLabel>{filter.label}</InputLabel>
                <Select
                  value={filterValues[filter.key]}
                  label={filter.label}
                  onChange={(e) =>
                    handleFilterChange(filter.key, e.target.value)
                  }
                  size="small"
                >
                  <MenuItem value="">
                    All {filter.label.replace(" Filter", "")}s
                  </MenuItem>
                  {filterOptions[filter.key].map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ))}
          </Box>
        )}
      </Box>
      {children(filteredData)}
    </>
  );
}
