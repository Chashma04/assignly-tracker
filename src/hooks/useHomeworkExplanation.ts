import { useState } from 'react';
import type { Homework } from '../type';
import { explainHomework } from '../services/gemini';

export function useHomeworkExplanation() {
  const [isExplaining, setIsExplaining] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [explainError, setExplainError] = useState<string | null>(null);

  const explain = async (homework: Homework) => {
    setExplainError(null);
    setIsExplaining(true);
    try {
      const text = await explainHomework(homework);
      setExplanation(text);
    } catch (err: any) {
      setExplainError(err?.message || "Failed to generate explanation.");
    } finally {
      setIsExplaining(false);
    }
  };

  return {
    isExplaining,
    explanation,
    explainError,
    explain,
    clearExplanation: () => setExplanation(null),
    clearError: () => setExplainError(null),
  };
}