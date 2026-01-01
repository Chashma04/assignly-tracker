import { useState } from "react";
import type { Role, User } from "../type";
import { getTeacherBySecrete, getStudentByRollAndDob } from "../services/db";
import "../styles/Login.css";

interface Props {
  onLogin: (user: User) => void;
}

export default function Login({ onLogin }: Props) {
  const [role, setRole] = useState<Role>("student");
  const [pin, setPin] = useState("");
  const [secrete, setSecrete] = useState("");
  const [error, setError] = useState<string>("");
  const [showPin, setShowPin] = useState(false);
  // Student fields
  const [roll, setRoll] = useState("");
  const [dob, setDob] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (role === "teacher") {
      const secretKey = secrete.trim();
      if (!secretKey) {
        setError("Please enter Secrete.");
        return;
      }
      try {
        const record = await getTeacherBySecrete(pin, secretKey);
        if (!record) {
          setError("Invalid Secrete.");
          return;
        }
        // Pin already matched in query; keep a defensive check without env fallback
        if (!record.pin || pin !== record.pin) {
          setError("Invalid teacher PIN.");
          return;
        }
        const assigned = (record.sections || []).length
          ? (record.sections || []).map((s) => ({ grade: record.grade || "", section: s }))
          : record.grade
          ? [{ grade: record.grade }]
          : [];
        onLogin({
          role,
          name: record.name,
          teacherId: record.id,
          assigned,
        });
        return;
      } catch (err) {
        setError("Login failed. Please try again.");
        return;
      }
    }
    // Student validation: roll number + DOB
    const rollOk = /^[0-9]{1,10}$/.test(roll);
    if (!rollOk) {
      setError("Please enter a valid numeric roll number (up to 10 digits).");
      return;
    }
    if (!dob) {
      setError("Please select your date of birth.");
      return;
    }
    try {
      const record = await getStudentByRollAndDob(roll.trim(), dob);
      if (!record) {
        setError("Invalid roll number or DOB.");
        return;
      }
      onLogin({ role, rollNumber: record.rollNumber, dob: record.dob || dob, name: record.name });
    } catch (err) {
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className="container login-container">
      <h2>Welcome to Assignly</h2>
      <p>Sign in to continue</p>

      <form className="card" onSubmit={submit}>
        {role === "student" && (
          <>
            <input
              placeholder="Roll Number"
              value={roll}
              onChange={(e) => setRoll(e.target.value)}
              inputMode="numeric"
            />
            <input
              type="date"
              placeholder="Date of Birth"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </>
        )}

        <div style={{ marginTop: 12 }}>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
          >
            <button
              type="button"
              className={role === "student" ? "secondary" : ""}
              onClick={() => setRole("student")}
            >
              Student (Roll + DOB)
              {role === "student" && (
                <span style={{ marginLeft: 6, fontSize: 12 }}>✓ Selected</span>
              )}
            </button>
            <button
              type="button"
              className={role === "teacher" ? "secondary" : ""}
              onClick={() => setRole("teacher")}
            >
              Teacher
              {role === "teacher" && (
                <span style={{ marginLeft: 6, fontSize: 12 }}>✓ Selected</span>
              )}
            </button>
          </div>
        </div>

        {role === "teacher" && (
          <div style={{ marginTop: 12 }}>
            <input
              placeholder="Secrete"
              value={secrete}
              onChange={(e) => setSecrete(e.target.value)}
            />
            <input
              placeholder="Teacher PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              type={showPin ? "text" : "password"}
            />
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="button"
                className="link"
                onClick={() => setShowPin((v) => !v)}
                style={{ width: "auto", marginTop: 8 }}
              >
                {showPin ? "Hide PIN" : "Show PIN"}
              </button>
            </div>
          </div>
        )}

        {error && (
          <div
            className="bg-red-50 border border-red-200 text-red-700 rounded"
            style={{ padding: 10, marginTop: 10, fontSize: 14 }}
          >
            {error}
          </div>
        )}

        <button type="submit" style={{ marginTop: 16 }}>
          Continue
        </button>
      </form>
    </div>
  );
}
