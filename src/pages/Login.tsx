import { useState } from "react";
import { Box, Button, TextField, Stack } from "@mui/material";
import { Person, School } from "@mui/icons-material";
import dayjs, { Dayjs } from "dayjs";
import type { Role, User } from "../type";
import DatePickerField from "../components/DatePickerField";
import { getTeacherBySecrete, getStudentByRollAndDob } from "../services/db";
import PasswordField from "../components/PasswordField";
import ErrorAlert from "../components/ErrorAlert";
import LoadingButton from "../components/LoadingButton";
import CenteredLayout from "../components/CenteredLayout";
import FormCard from "../components/FormCard";
import { ERROR_MESSAGES } from "../config/constants";

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
  const [dobValue, setDobValue] = useState<Dayjs | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (role === "teacher") {
        const secretKey = secrete.trim();
        if (!secretKey) {
          setError(ERROR_MESSAGES.TEACHER_SECRETE_REQUIRED);
          return;
        }
        const record = await getTeacherBySecrete(pin, secretKey);
        if (!record) {
          setError(ERROR_MESSAGES.INVALID_SECRETE);
          return;
        }
        // Pin already matched in query; keep a defensive check without env fallback
        if (!record.pin || pin !== record.pin) {
          setError(ERROR_MESSAGES.INVALID_TEACHER_PIN);
          return;
        }
        const assigned = (record.sections || []).length
          ? (record.sections || []).map((s) => ({
              grade: record.grade || "",
              section: s,
            }))
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
      setError(ERROR_MESSAGES.LOGIN_FAILED);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CenteredLayout paper paperElevation={3}>
      <FormCard
        title={`Login to Assignly as ${role === "student" ? "Student" : "Teacher"}`}
        subtitle="Enter your credentials to continue"
      >
        <Box component="form" onSubmit={submit} sx={{ width: "100%" }}>
          {/* Role Selection Section */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 4,
              gap: 2,
              border: (theme) =>
                `0.5px solid ${theme.palette.mode === "dark" ? "rgba(92, 107, 192, 0.3)" : "rgba(57, 73, 171, 0.2)"}`,
              p: 2,
            }}
          >
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                startIcon={<Person />}
                variant={role === "student" ? "contained" : "outlined"}
                onClick={() => setRole("student")}
                color={role === "student" ? "primary" : "inherit"}
                sx={{
                  transition: "all 0.3s ease",
                  transform: role === "student" ? "scale(1.05)" : "scale(1)",
                  "&:hover": {
                    transform: "scale(1.08)",
                  },
                }}
              >
                Student
              </Button>
              <Button
                startIcon={<School />}
                variant={role === "teacher" ? "contained" : "outlined"}
                onClick={() => setRole("teacher")}
                color={role === "teacher" ? "primary" : "inherit"}
                sx={{
                  transition: "all 0.3s ease",
                  transform: role === "teacher" ? "scale(1.05)" : "scale(1)",
                  "&:hover": {
                    transform: "scale(1.08)",
                  },
                }}
              >
                Teacher
              </Button>
            </Box>
          </Box>

          {/* Form Fields Section */}
          <Stack spacing={2.5} sx={{ mb: 3 }}>
            {role === "teacher" ? (
              <>
                <TextField
                  label="Secrete"
                  value={secrete}
                  onChange={(e) => setSecrete(e.target.value)}
                  required
                  placeholder="Enter your secrete"
                  fullWidth
                  slotProps={{
                    input: {
                      sx: {
                        transition: "all 0.3s ease",
                        "&:hover": {
                          boxShadow: (theme) =>
                            `0 0 0 3px ${theme.palette.mode === "dark" ? "rgba(92, 107, 192, 0.1)" : "rgba(57, 73, 171, 0.1)"}`,
                        },
                      },
                    },
                  }}
                />
                <PasswordField
                  label="PIN"
                  value={pin}
                  onChange={setPin}
                  required
                  placeholder="Enter your PIN"
                />
              </>
            ) : (
              <>
                <TextField
                  label="Roll Number"
                  value={roll}
                  onChange={(e) => setRoll(e.target.value)}
                  required
                  placeholder="Enter your roll number"
                  fullWidth
                  inputMode="numeric"
                  slotProps={{
                    input: {
                      sx: {
                        transition: "all 0.3s ease",
                        "&:hover": {
                          boxShadow: (theme) =>
                            `0 0 0 3px ${theme.palette.mode === "dark" ? "rgba(92, 107, 192, 0.1)" : "rgba(57, 73, 171, 0.1)"}`,
                        },
                      },
                    },
                  }}
                />
                <DatePickerField
                  label="Date of Birth"
                  value={dobValue}
                  onChange={(newValue) => {
                    setDobValue(newValue);
                    setDob(newValue ? newValue.format("YYYY-MM-DD") : "");
                  }}
                  maxDate={dayjs()}
                  required
                  fullWidth
                  sx={{
                    "& .MuiInputBase-root": {
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow: (theme) =>
                          `0 0 0 3px ${theme.palette.mode === "dark" ? "rgba(92, 107, 192, 0.1)" : "rgba(57, 73, 171, 0.1)"}`,
                      },
                    },
                  }}
                />
              </>
            )}
          </Stack>

          {error && (
            <Box sx={{ mb: 2 }}>
              <ErrorAlert
                message={error}
                severity="error"
                onClose={() => setError("")}
              />
            </Box>
          )}

          <Box
            sx={{
              mt: 4,
              display: "flex",
              justifyContent: "center",
              pt: 2,
              borderTop: (theme) =>
                `1px solid ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
            }}
          >
            <LoadingButton
              type="submit"
              variant="contained"
              size="large"
              loading={loading}
              loadingText="Logging in..."
              sx={{
                minWidth: 200,
                background: (theme) =>
                  theme.palette.mode === "dark"
                    ? "linear-gradient(135deg, #5c6bc0 0%, #8e99f3 100%)"
                    : "linear-gradient(135deg, #3949ab 0%, #5e7ce2 100%)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: (theme) =>
                    theme.palette.mode === "dark"
                      ? "0 8px 24px rgba(92, 107, 192, 0.3)"
                      : "0 8px 24px rgba(57, 73, 171, 0.2)",
                },
              }}
            >
              Login
            </LoadingButton>
          </Box>
        </Box>
      </FormCard>
    </CenteredLayout>
  );
}
