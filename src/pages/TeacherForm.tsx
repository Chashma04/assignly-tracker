import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import ErrorAlert from "../components/ErrorAlert";
import DatePickerField from "../components/DatePickerField";
import LoadingButton from "../components/LoadingButton";
import { addHomework } from "../services/db";
import type { Homework } from "../type";

interface Props {
  homeworks: Homework[];
  setHomeworks: React.Dispatch<React.SetStateAction<Homework[]>>;
  teacherName?: string;
  assigned?: Array<{ grade: string; section?: string }>;
  editing?: Homework | null;
  onDoneEditing?: () => void;
}

export default function TeacherForm({
  homeworks,
  setHomeworks,
  teacherName,
  assigned,
  editing,
  onDoneEditing,
}: Props) {
  type FormState = Omit<Homework, "id" | "status" | "notes">;
  const [form, setForm] = useState<FormState>({
    className: "",
    subject: "",
    description: "",
    date: "",
  });
  const [dateValue, setDateValue] = useState<Dayjs | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const today = dayjs();

  // Prefill form when editing an existing homework
  useEffect(() => {
    if (editing) {
      setForm({
        className: editing.className,
        subject: editing.subject,
        description: editing.description,
        date: editing.date,
      });
      setDateValue(editing.date ? dayjs(editing.date) : null);
    } else {
      setForm({ className: "", subject: "", description: "", date: "" });
      setDateValue(null);
    }
  }, [editing]);

  const handleSubmit = async () => {
    const { className, subject, description, date } = form;
    if (!className || !subject || !description || !date) {
      setError("Please fill all required fields.");
      return;
    }
    if (dayjs(date).isBefore(today, "day")) {
      setError("Due date cannot be in the past.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (editing) {
        // Check if anything has changed
        const hasChanges =
          editing.className !== form.className ||
          editing.subject !== form.subject ||
          editing.description !== form.description ||
          editing.date !== form.date;

        if (!hasChanges) {
          setError("No changes detected.");
          setLoading(false);
          return;
        }

        const updated: Homework = {
          ...editing,
          className: form.className,
          subject: form.subject,
          description: form.description,
          date: form.date,
          teacher: teacherName ?? editing.teacher,
        };
        // Optimistic update
        setHomeworks((prev) =>
          prev.map((h) => (h.id === updated.id ? updated : h)),
        );
        try {
          const { updateHomework } = await import("../services/db");
          await updateHomework(updated);
        } catch (e) {
          console.warn("Failed to update homework in Firestore", e);
        }
        onDoneEditing?.();
      } else {
        const newHw: Homework = {
          id: `${Date.now()}`,
          className: form.className,
          subject: form.subject,
          description: form.description,
          date: form.date,
          status: "pending",
          teacher: teacherName,
        };

        // Optimistically update UI
        setHomeworks([newHw, ...homeworks]);
        // Persist to Firestore
        try {
          await addHomework(newHw);
        } catch (e) {
          console.warn("Failed to save homework to Firestore", e);
        }

        setForm({ className: "", subject: "", description: "", date: "" });
      }
    } catch (err) {
      setError("Failed to save homework. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          {editing ? "Edit Homework" : "Post Homework"}
        </Typography>

        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        >
          {assigned && assigned.length > 0 ? (
            <FormControl fullWidth required>
              <InputLabel>Class</InputLabel>
              <Select
                value={form.className}
                label="Class"
                onChange={(e) =>
                  setForm({ ...form, className: e.target.value })
                }
              >
                <MenuItem value="">Select Grade/Section</MenuItem>
                {assigned.map((a, idx) => {
                  const label = a.section ? `${a.grade} ${a.section}` : a.grade;
                  return (
                    <MenuItem key={`${label}-${idx}`} value={label}>
                      {label}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          ) : (
            <TextField
              label="Class"
              placeholder="Class (Grade 1)"
              value={form.className}
              onChange={(e) => setForm({ ...form, className: e.target.value })}
              required
              fullWidth
            />
          )}

          <TextField
            label="Subject"
            placeholder="Subject"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            required
            fullWidth
          />

          <TextField
            label="Homework Description"
            placeholder="Homework description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
            fullWidth
            multiline
            rows={4}
          />

          <DatePickerField
            label="Due Date"
            value={dateValue}
            onChange={(newValue) => {
              setDateValue(newValue);
              setForm({
                ...form,
                date: newValue ? newValue.format("YYYY-MM-DD") : "",
              });
            }}
            minDate={today}
            required
            fullWidth
          />

          {error && (
            <ErrorAlert
              message={error}
              severity="error"
              onClose={() => setError("")}
            />
          )}

          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <LoadingButton
              variant="contained"
              size="large"
              loading={loading}
              loadingText={editing ? "Saving..." : "Posting..."}
              onClick={handleSubmit}
              sx={{ minWidth: 200 }}
            >
              {editing ? "Save Changes" : "Post Homework"}
            </LoadingButton>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
