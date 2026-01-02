import { Box, Typography, Paper } from "@mui/material";
import type { Homework } from "../type";
import HomeworkCard from "./HomeworkCard";
import HomeworkTable from "./HomeworkTable";

interface Props {
  homeworks: Homework[];
  setHomeworks: React.Dispatch<React.SetStateAction<Homework[]>>;
}

export default function StudentDashboard({ homeworks, setHomeworks }: Props) {
  return (
    <Box sx={{ width: "100%", px: { xs: 2 }, py: 2 }}>
      <Paper elevation={2} sx={{ p: { xs: 2 } }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          align="center"
          sx={{ mb: { xs: 2, sm: 3 } }}
        >
          Student Dashboard
        </Typography>

        <Box sx={{ mb: { xs: 3, sm: 4 } }}>
          <HomeworkTable homeworks={homeworks} />
        </Box>

        {homeworks.length === 0 && (
          <Typography
            variant="body1"
            color="textSecondary"
            align="center"
            sx={{ py: { xs: 3, sm: 4 } }}
          >
            No homework available
          </Typography>
        )}

        {homeworks.length > 0 && (
          <Box>
            <Typography
              variant="h5"
              component="h2"
              gutterBottom
              sx={{ mb: { xs: 1.5, sm: 2 } }}
            >
              Homework Details
            </Typography>
            <Box
              sx={{ display: "flex", flexWrap: "wrap", gap: { xs: 2, sm: 3 } }}
            >
              {homeworks.map((hw) => (
                <Box
                  key={hw.id}
                  sx={{
                    flex: "1 1 auto",
                    minWidth: { xs: "100%", sm: "300px", md: "350px" },
                    maxWidth: { xs: "100%", sm: "400px" },
                  }}
                >
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
