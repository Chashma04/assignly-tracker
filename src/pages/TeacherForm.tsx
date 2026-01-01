import { useEffect, useRef, useState } from "react";
import type { Homework } from "../type";
import "../styles/Controls.css";
import { addHomework } from "../services/db";

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
  const [error, setError] = useState<string>("");
  const dateInputRef = useRef<HTMLInputElement | null>(null);
  const todayStr = (() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  })();

  // Prefill form when editing an existing homework
  useEffect(() => {
    if (editing) {
      setForm({
        className: editing.className,
        subject: editing.subject,
        description: editing.description,
        date: editing.date,
      });
    } else {
      setForm({ className: "", subject: "", description: "", date: "" });
    }
  }, [editing]);

  const handleSubmit = async () => {
    const { className, subject, description, date } = form;
    if (!className || !subject || !description || !date) {
      setError("Please fill all required fields.");
      return;
    }
    if (new Date(date) < new Date(todayStr)) {
      setError("Due date cannot be in the past.");
      return;
    }

    if (editing) {
      const updated: Homework = {
        ...editing,
        className: form.className,
        subject: form.subject,
        description: form.description,
        date: form.date,
        teacher: teacherName ?? editing.teacher,
      };
      // Optimistic update
      setHomeworks((prev) => prev.map((h) => (h.id === updated.id ? updated : h)));
      try {
        const { updateHomework } = await import("../services/db");
        await updateHomework(updated);
      } catch (e) {
        console.warn("Failed to update homework in Firestore", e);
      }
      onDoneEditing?.();
      setError("");
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
      setError("");
    }
  };

  return (
    <div className="container max-w-xl mx-auto">
      <h2>{editing ? "Edit Homework" : "Post Homework"}</h2>

      <div className="card">
        <label className="muted" style={{ fontWeight: 600, marginBottom: 6 }}>
          Class <span style={{ color: "#d33" }}>*</span>
        </label>
        {assigned && assigned.length > 0 ? (
          <select
            value={form.className}
            onChange={(e) => setForm({ ...form, className: e.target.value })}
          >
            <option value="">Select Grade/Section</option>
            {assigned.map((a, idx) => {
              const label = a.section ? `${a.grade} ${a.section}` : a.grade;
              return (
                <option key={`${label}-${idx}`} value={label}>
                  {label}
                </option>
              );
            })}
          </select>
        ) : (
          <input
            placeholder="Class (Grade 1)"
            value={form.className}
            onChange={(e) => setForm({ ...form, className: e.target.value })}
          />
        )}
        <label className="muted" style={{ fontWeight: 600, marginTop: 8 }}>
          Subject <span style={{ color: "#d33" }}>*</span>
        </label>
        <input
          placeholder="Subject"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
        />
        <label className="muted" style={{ fontWeight: 600, marginTop: 8 }}>
          Homework description <span style={{ color: "#d33" }}>*</span>
        </label>
        <textarea
          placeholder="Homework description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <div
          onClick={() => {
            if (dateInputRef.current) {
              // Prefer native date picker if supported
              // @ts-ignore: showPicker not in all TS lib targets
              dateInputRef.current.showPicker?.();
              dateInputRef.current.focus();
            }
          }}
          role="group"
          aria-labelledby="due-date-label"
          style={{ cursor: "pointer" }}
       >
          <label
            id="due-date-label"
            htmlFor="due-date"
            className="muted"
            style={{ fontWeight: 600, marginTop: 8 }}
          >
            Due Date <span style={{ color: "#d33" }}>*</span>
          </label>
          <input
            ref={dateInputRef}
            type="date"
            id="due-date"
            value={form.date}
            min={todayStr}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
        </div>
        {error && (
          <div
            className="bg-red-50 border border-red-200 text-red-700 rounded"
            style={{ padding: 10, marginTop: 10, fontSize: 14 }}
          >
            {error}
          </div>
        )}
        <button onClick={handleSubmit}>{editing ? "Save Changes" : "Post Homework"}</button>
      </div>
    </div>
  );
}
