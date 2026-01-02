import {
  Box,
  Typography,
  Paper,
  Chip,
  Stack,
} from "@mui/material";
import type { Homework, User } from "../type";
import HomeworkTable from "./HomeworkTable";
import { useFilteredHomeworks } from "../hooks/useFilteredHomeworks";

interface Props {
  homeworks: Homework[];
  user?: User | null;
  onEdit?: (hw: Homework) => void;
}

export default function TeacherDashboard({
  homeworks,
  user,
  onEdit,
}: Props) {
  const filtered = useFilteredHomeworks(homeworks, user);
  const assignedLabels = (user?.assigned || []).map((a) =>
    a.section ? `${a.grade} ${a.section}` : a.grade
  );

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Teacher Dashboard
        </Typography>

        {assignedLabels.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center">
              <Typography variant="body2" color="textSecondary">
                Assigned Classes:
              </Typography>
              {assignedLabels.map((label, index) => (
                <Chip
                  key={index}
                  label={label}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Stack>
          </Box>
        )}

        <HomeworkTable
          homeworks={filtered}
          showDescriptionTooltip={true}
          onEdit={onEdit}
        />
      </Paper>
    </Box>
  );
}
