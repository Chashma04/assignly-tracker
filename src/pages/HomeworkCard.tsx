import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  CircularProgress,
  IconButton,
  Collapse,
} from "@mui/material";
import { SmartToy, ExpandMore, ExpandLess } from "@mui/icons-material";
import type { Homework } from "../type";
import ErrorAlert from "../components/ErrorAlert";
import StatusChip from "../components/StatusChip";
import { useHomeworkExplanation } from "../hooks/useHomeworkExplanation";
import { useState } from "react";

interface Props {
  hw: Homework;
  onComplete?: () => void;
}

export default function HomeworkCard({ hw, onComplete }: Props) {
  const { isExplaining, explanation, explainError, explain } =
    useHomeworkExplanation();
  const [isExpanded, setIsExpanded] = useState(true);

  const handleExplain = async () => {
    await explain(hw);
    setIsExpanded(true); // Auto-expand when new explanation arrives
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <StatusChip status={hw.status} />
        </Box>

        <Typography variant="h6" component="h2" gutterBottom>
          {hw.subject}
        </Typography>

        <Typography variant="body1" sx={{ mb: 2 }}>
          {hw.description}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {hw.className} | Due: {hw.date}
        </Typography>

        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Button
            variant="outlined"
            startIcon={
              isExplaining ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <SmartToy />
              )
            }
            onClick={handleExplain}
            disabled={isExplaining}
            size="small"
          >
            {isExplaining ? "Explaining..." : "Explain Homework (AI)"}
          </Button>
          {explanation && (
            <IconButton
              onClick={() => setIsExpanded(!isExpanded)}
              size="small"
              sx={{ ml: 1 }}
              title={isExpanded ? "Collapse explanation" : "Expand explanation"}
            >
              {isExpanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          )}
        </Box>

        {explainError && <ErrorAlert message={explainError} />}

        {explanation && (
          <Collapse in={isExpanded}>
            <Box sx={{ mt: 2 }}>
              <Card variant="outlined">
                <CardContent sx={{ pb: 2 }}>
                  <Typography variant="h6" component="h3" gutterBottom>
                    AI Explanation
                  </Typography>
                  <Box
                    sx={{
                      maxHeight: "300px",
                      overflowY: "auto",
                      pr: 1,
                      "&::-webkit-scrollbar": {
                        width: "8px",
                      },
                      "&::-webkit-scrollbar-track": {
                        backgroundColor: "action.hover",
                        borderRadius: "4px",
                      },
                      "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "action.disabled",
                        borderRadius: "4px",
                        "&:hover": {
                          backgroundColor: "action.active",
                        },
                      },
                    }}
                  >
                    <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                      {explanation}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Collapse>
        )}
      </CardContent>
    </Card>
  );
}
