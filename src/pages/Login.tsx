import { useState } from "react";
import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import type { Role, User } from "../type";
import { getTeacherBySecrete, getStudentByRollAndDob } from "../services/db";
import PasswordField from "../components/PasswordField";
import ErrorAlert from "../components/ErrorAlert";
import LoadingButton from "../components/LoadingButton";
import CenteredLayout from "../components/CenteredLayout";
import FormCard from "../components/FormCard";

interface Props {
  onLogin: (user: User) => void;
}

export default function Login({ onLogin }: Props) {
  const [role, setRole] = useState<Role>("student");
  const [pin, setPin] = useState("");
  const [secrete, setSecrete] = useState("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  // Student fields
  const [roll, setRoll] = useState("");
  const [dob, setDob] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (role === "teacher") {
        const secretKey = secrete.trim();
        if (!secretKey) {
          setError("Please enter Secrete.");
          return;
        }
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
      } else {
        // Student login
        const rollNumber = roll.trim();
        const dateOfBirth = dob.trim();
        if (!rollNumber || !dateOfBirth) {
          setError("Please enter Roll Number and Date of Birth.");
          return;
        }
        const record = await getStudentByRollAndDob(rollNumber, dateOfBirth);
        if (!record) {
          setError("Invalid Roll Number or Date of Birth.");
          return;
        }
        onLogin({
          role,
          name: record.name,
          rollNumber: record.rollNumber,
          dob: record.dob,
        });
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CenteredLayout containerMaxWidth="sm" paper paperElevation={3}>
      <FormCard title="Login to Assignly" subtitle="Enter your credentials to continue">
        <Box component="form" onSubmit={submit} sx={{ width: '100%' }}>
          <FormControl component="fieldset" sx={{ mb: 3 }}>
            <FormLabel component="legend">Login as</FormLabel>
            <RadioGroup
              row
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
            >
              <FormControlLabel value="student" control={<Radio />} label="Student" />
              <FormControlLabel value="teacher" control={<Radio />} label="Teacher" />
            </RadioGroup>
          </FormControl>

          {role === "teacher" ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Secrete"
                value={secrete}
                onChange={(e) => setSecrete(e.target.value)}
                required
                placeholder="Enter your secrete"
                fullWidth
              />
              <PasswordField
                label="PIN"
                value={pin}
                onChange={setPin}
                required
                placeholder="Enter your PIN"
              />
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Roll Number"
                value={roll}
                onChange={(e) => setRoll(e.target.value)}
                required
                placeholder="Enter your roll number"
                fullWidth
                inputMode="numeric"
              />
              <TextField
                label="Date of Birth"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                required
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Box>
          )}

          {error && (
            <ErrorAlert
              message={error}
              severity="error"
              onClose={() => setError("")}
            />
          )}

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <LoadingButton
              type="submit"
              variant="contained"
              size="large"
              loading={loading}
              loadingText="Logging in..."
              sx={{ minWidth: 120 }}
            >
              Login
            </LoadingButton>
          </Box>
        </Box>
      </FormCard>
    </CenteredLayout>
  );
}
