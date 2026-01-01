import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { SmartToy } from "@mui/icons-material";
import type { Homework } from "../type";
import { explainHomework } from "../services/gemini";
import ErrorAlert from "../components/ErrorAlert";
import StatusChip from "../components/StatusChip";
import LoadingSpinner from "../components/LoadingSpinner";

interface Props {
  hw: Homework;
  onComplete?: () => void;
}

export default function HomeworkCard({ hw, onComplete }: Props) {
  const [isExplaining, setIsExplaining] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [explainError, setExplainError] = useState<string | null>(null);

  const handleExplain = async () => {
    setExplainError(null);
    setIsExplaining(true);
    try {
      const text = await explainHomework(hw);
      setExplanation(text);
    } catch (err: any) {
      setExplainError(err?.message || "Failed to generate explanation.");
    } finally {
      setIsExplaining(false);
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
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

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Button
            variant="outlined"
            startIcon={isExplaining ? <LoadingSpinner size={16} /> : <SmartToy />}
            onClick={handleExplain}
            disabled={isExplaining}
            size="small"
          >
            {isExplaining ? "Explaining..." : "Explain Homework (AI)"}
          </Button>
        </Box>

        {explainError && <ErrorAlert message={explainError} />}

        {explanation && (
          <Box sx={{ mt: 2 }}>
            <Card variant="outlined">
              <CardContent sx={{ pb: 2 }}>
                <Typography variant="h6" component="h3" gutterBottom>
                  AI Explanation
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                  {explanation}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
