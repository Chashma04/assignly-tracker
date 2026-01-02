import {
  Box,
  Typography,
  Paper,
} from "@mui/material";
import type { Homework } from "../type";
import HomeworkCard from "./HomeworkCard";
import HomeworkTable from "./HomeworkTable";

interface Props {
  homeworks: Homework[];
  setHomeworks: React.Dispatch<React.SetStateAction<Homework[]>>;
}

export default function StudentDashboard({ homeworks, setHomeworks }: Props) {

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 3 }}>
          Student Dashboard
        </Typography>

        <Box sx={{ mb: 4 }}>
          <HomeworkTable homeworks={homeworks} />
        </Box>

        {homeworks.length === 0 && (
          <Typography variant="body1" color="textSecondary" align="center" sx={{ py: 4 }}>
            No homework available
          </Typography>
        )}

        {homeworks.length > 0 && (
          <Box>
            <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 2 }}>
              Homework Details
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              {homeworks.map((hw) => (
                <Box key={hw.id} sx={{ flex: '1 1 300px', maxWidth: '400px' }}>
                  <HomeworkCard hw={hw} />
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
export {};
