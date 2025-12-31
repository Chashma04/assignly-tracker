import { useState } from "react";
import type { Homework } from "../type";
import "../styles/Homework.css";
import { explainHomework } from "../services/gemini";

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
    <div className="card homework-card">
      <div className="row">
        <div className={`status ${hw.status}`}>{hw.status}</div>
      </div>
      <h4 className="hw-title">{hw.subject}</h4>
      <p>{hw.description}</p>
      <small>
        {hw.className} | Due: {hw.date}
      </small>

      <div className="actions-row">
        <button onClick={handleExplain} disabled={isExplaining}>
          {isExplaining ? "Explaining…" : "Explain Homework (AI)"}
        </button>
      </div>
      {explainError && (
        <small className="muted" style={{ color: "#d33" }}>{explainError}</small>
      )}
      {explanation && (
        <div className="ai-explain" style={{ marginTop: 8 }}>
          <div className="card" style={{ padding: 12 }}>
            <h5 style={{ marginTop: 0 }}>AI Explanation</h5>
            <div
              className="explain-content"
              style={{ whiteSpace: "pre-wrap" }}
            >
              {explanation}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
