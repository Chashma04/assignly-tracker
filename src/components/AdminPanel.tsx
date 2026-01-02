import { useEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  Alert,
  Card,
  CardContent,
  Typography,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
} from "@mui/material";
import DataTable from "./DataTable";
import PasswordField from "./PasswordField";
import {
  parseTeachersExcel,
  parseStudentsExcel,
  saveTeacherRoster,
  saveStudentRoster,
  type TeacherRecord,
  type StudentRecord,
} from "../services/roster";
import { getTeachersFromFirestore, getStudentsFromFirestore, isAdmin, hasAnyAdminSecrets, addAdminSecret } from "../services/db";

interface Props {
  onClose?: () => void;
  page?: boolean;
}

type Tab =
  | "upload-students"
  | "upload-teachers"
  | "teachers-list"
  | "students-list";

export default function AdminPanel({ onClose, page = false }: Props) {
  const [authed, setAuthed] = useState(false);
  const [secrete, setSecrete] = useState("");
  const [tab, setTab] = useState<Tab>(() => {
    try {
      const stored = localStorage.getItem("assignly_admin_tab");
      const allowed: Tab[] = [
        "upload-students",
        "upload-teachers",
        "teachers-list",
        "students-list",
      ];
      if (stored && (allowed as string[]).includes(stored)) {
        return stored as Tab;
      }
    } catch {}
    return "teachers-list";
  });
  const [notice, setNotice] = useState<string>("");
  const [noticeType, setNoticeType] = useState<"success" | "error" | "">("");
  const [studentFile, setStudentFile] = useState<File | null>(null);
  const [teacherFile, setTeacherFile] = useState<File | null>(null);
  const [uploadingStudents, setUploadingStudents] = useState(false);
  const [uploadingTeachers, setUploadingTeachers] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [setupPassword, setSetupPassword] = useState("");
  const studentInputRef = useRef<HTMLInputElement | null>(null);
  const teacherInputRef = useRef<HTMLInputElement | null>(null);

  // Check if admin collection has any documents
  useEffect(() => {
    const checkAdminSetup = async () => {
      try {
        const hasAdmins = await hasAnyAdminSecrets();
        if (!hasAdmins) {
          setShowSetup(true);
        }
      } catch (error) {
        console.error("Error checking admin setup:", error);
        setShowSetup(true);
      }
    };
    checkAdminSetup();
  }, []);



  const [teachers, setTeachers] = useState<TeacherRecord[]>([]);
  const [students, setStudents] = useState<StudentRecord[]>([]);

  const refreshTeachers = async () => {
    try {
      const list = await getTeachersFromFirestore();
      setTeachers(list);
    } catch (e) {
      console.warn("Failed to fetch teachers:", e);
    }
  };
  const refreshStudents = async () => {
    try {
      const list = await getStudentsFromFirestore();
      setStudents(list);
    } catch (e) {
      console.warn("Failed to fetch students:", e);
    }
  };

  const grades = useMemo(() => {
    const s = new Set<string>();
    students.forEach((r) => {
      if (r.className) s.add(r.className);
    });
    return Array.from(s).sort();
  }, [students]);
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const filteredStudents = useMemo(() => {
    if (!selectedGrade) return students;
    return students.filter((s) => s.className === selectedGrade);
  }, [students, selectedGrade]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const valid = await isAdmin(secrete);
      if (!valid) {
        setNotice("Invalid admin secrete");
        return;
      }
      setAuthed(true);
      setNotice("");
      try {
        localStorage.setItem("assignly_admin_authed", "1");
      } catch {}
      try {
        window.dispatchEvent(
          new CustomEvent("assignly:admin-auth", { detail: { authed: true } })
        );
      } catch {}
    } catch (error) {
      setNotice("Error checking admin secrete");
    }
  };

  const handleUploadTeachers = async (file: File) => {
    setUploadingTeachers(true);
    try {
      const list = await parseTeachersExcel(file);
      saveTeacherRoster(list);
      setNotice(`Uploaded ${list.length} teachers`);
      setNoticeType("success");
      await refreshTeachers();
    } catch (err: any) {
      setNotice(String(err?.message || err));
      setNoticeType("error");
    } finally {
      setUploadingTeachers(false);
      setTeacherFile(null);
      if (teacherInputRef.current) teacherInputRef.current.value = "";
    }
  };
  const handleUploadStudents = async (file: File) => {
    setUploadingStudents(true);
    try {
      const list = await parseStudentsExcel(file);
      saveStudentRoster(list);
      setNotice(`Uploaded ${list.length} students`);
      setNoticeType("success");
      await refreshStudents();
    } catch (err: any) {
      setNotice(String(err?.message || err));
      setNoticeType("error");
    } finally {
      setUploadingStudents(false);
      setStudentFile(null);
      if (studentInputRef.current) studentInputRef.current.value = "";
    }
  };

  useEffect(() => {
    // Auto-dismiss notices after a short duration
    if (!notice) return;
    const timer = setTimeout(() => {
      setNotice("");
      setNoticeType("");
    }, 3000);
    return () => clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    try {
      if (localStorage.getItem("assignly_admin_authed") === "1") {
        setAuthed(true);
      }
    } catch {}
    const onStorage = (e: StorageEvent) => {
      if (e.key === "assignly_admin_authed") {
        setAuthed(e.newValue === "1");
      }
    };
    const onCustom = (e: Event) => {
      const ev = e as CustomEvent;
      if (ev && ev.detail && typeof ev.detail.authed === "boolean") {
        setAuthed(!!ev.detail.authed);
      }
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("assignly:admin-auth", onCustom as EventListener);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(
        "assignly:admin-auth",
        onCustom as EventListener
      );
    };
  }, []);

  // Fetch rosters on mount and when authed changes
  useEffect(() => {
    void refreshTeachers();
    void refreshStudents();
  }, [authed]);

  // Persist selected admin tab
  useEffect(() => {
    try {
      localStorage.setItem("assignly_admin_tab", tab);
    } catch {}
  }, [tab]);

  const handleSetupAdmin = async () => {
    if (!setupPassword.trim()) {
      setNotice("Please enter an admin password");
      setNoticeType("error");
      return;
    }
    if (setupPassword.length < 4) {
      setNotice("Admin password must be at least 4 characters long");
      setNoticeType("error");
      return;
    }
    try {
      const success = await addAdminSecret(setupPassword.trim());
      if (success) {
        setNotice(`Admin password has been set up successfully! Use "${setupPassword.trim()}" to login.`);
        setNoticeType("success");
        setShowSetup(false);
        setSetupPassword("");
      } else {
        setNotice("Failed to set up admin password. Check console for errors.");
        setNoticeType("error");
      }
    } catch (error) {
      setNotice("Error setting up admin password.");
      setNoticeType("error");
    }
  };

  const loginForm = showSetup ? (
    <Card sx={{ maxWidth: 400, mx: "auto" }}>
      <CardContent>
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Admin Setup Required:</strong> No admin password found. Please create your admin password below.
          </Typography>
        </Alert>
        <PasswordField
          label="Create admin password"
          value={setupPassword}
          onChange={setSetupPassword}
        />
        <Button
          fullWidth
          variant="contained"
          onClick={handleSetupAdmin}
          size="large"
        >
          Set Up Admin Password
        </Button>
        {notice && (
          <Alert severity={noticeType === "success" ? "success" : "error"} sx={{ mt: 2 }}>
            {notice}
          </Alert>
        )}
      </CardContent>
    </Card>
  ) : (
    <Card sx={{ maxWidth: 400, mx: "auto" }}>
      <CardContent>
        <PasswordField
          label="Admin Password"
          value={secrete}
          onChange={setSecrete}
        />
        <Button
          fullWidth
          variant="contained"
          onClick={handleAuth}
          size="large"
        >
          Continue
        </Button>
        {notice && (
          <Alert severity={noticeType === "success" ? "success" : "error"} sx={{ mt: 2 }}>
            {notice}
          </Alert>
        )}
      </CardContent>
    </Card>
  );

  const content = (
    <>
      {!authed ? (
        page ? (
          <div className="container login-container">
            <h2>Admin Access</h2>
            <p>Sign in with your Secrete</p>
            {loginForm}
          </div>
        ) : (
          loginForm
        )
      ) : (
        <Box sx={{ display: 'flex', height: '100vh' }}>
          <Box
            component="nav"
            sx={{
              width: 200,
              p: 2,
              borderRight: 1,
              borderColor: 'divider',
              display: 'flex',
              flexDirection: 'column',
              gap: 1
            }}
            role="navigation"
            aria-label="Admin Navigation"
          >
            <Button
              variant={tab === "teachers-list" ? "contained" : "outlined"}
              onClick={() => setTab("teachers-list")}
              fullWidth
              sx={{ justifyContent: 'flex-start' }}
            >
              Teachers List
            </Button>
            <Button
              variant={tab === "upload-teachers" ? "contained" : "outlined"}
              onClick={() => setTab("upload-teachers")}
              fullWidth
              sx={{ justifyContent: 'flex-start' }}
            >
              Upload Teachers
            </Button>
            <Divider sx={{ my: 1 }} />
            <Button
              variant={tab === "students-list" ? "contained" : "outlined"}
              onClick={() => setTab("students-list")}
              fullWidth
              sx={{ justifyContent: 'flex-start' }}
            >
              Students List
            </Button>
            <Button
              variant={tab === "upload-students" ? "contained" : "outlined"}
              onClick={() => setTab("upload-students")}
              fullWidth
              sx={{ justifyContent: 'flex-start' }}
            >
              Upload Students
            </Button>
          </Box>
          <Box sx={{ flex: 1, p: 3, overflow: 'auto' }}>
            {tab === "upload-students" && (
                <Card sx={{ p: 3, mb: 3 }}>
                  <CardContent>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      Please upload an Excel file with a sheet named{" "}
                      <strong>Students</strong>. The sheet must include the
                      columns: Roll No, Name, DOB (YYYY-MM-DD), Grade, Section.
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      <strong>Example:</strong> 1234 | John Doe | Grade 4 | A
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <input
                        ref={studentInputRef}
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={(e) => {
                          const f = e.currentTarget.files?.[0] || null;
                          setStudentFile(f);
                        }}
                        style={{ flex: 1 }}
                      />
                      <Button
                        variant="contained"
                        disabled={!studentFile || uploadingStudents}
                        onClick={() =>
                          studentFile && handleUploadStudents(studentFile)
                        }
                        sx={{ minWidth: '120px' }}
                      >
                        {uploadingStudents ? "Uploading..." : "Upload"}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              )}

              {tab === "upload-teachers" && (
                <Card sx={{ p: 3, mb: 3 }}>
                  <CardContent>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      Please upload an Excel file with a sheet named{" "}
                      <strong>Teachers</strong>. The sheet must include the
                      columns: ID, Name, Class, Section, Pin.
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      <strong>Example:</strong> 1 | John Doe | Grade 4 | A | 1234
                      | Grade 4 A.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <input
                        ref={teacherInputRef}
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={(e) => {
                          const f = e.currentTarget.files?.[0] || null;
                          setTeacherFile(f);
                        }}
                        style={{ flex: 1 }}
                      />
                      <Button
                        variant="contained"
                        disabled={!teacherFile || uploadingTeachers}
                        onClick={() =>
                          teacherFile && handleUploadTeachers(teacherFile)
                        }
                        sx={{ minWidth: '120px' }}
                      >
                        {uploadingTeachers ? "Uploading..." : "Upload"}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              )}

              {tab === "teachers-list" && (
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <DataTable
                      data={teachers}
                      columns={[
                        { key: 'id', label: 'ID' },
                        { key: 'name', label: 'Name' },
                        {
                          key: 'grade',
                          label: 'Class',
                          render: (value) => value || "-"
                        },
                        {
                          key: 'sections',
                          label: 'Section',
                          render: (value) => (value || []).join(", ") || "-"
                        },
                        {
                          key: 'pin',
                          label: 'Pin',
                          render: (value) => value || "-"
                        },
                        {
                          key: 'secrete',
                          label: 'Secrete',
                          render: (value) => value || "-"
                        },
                      ]}
                      emptyMessage="No teachers"
                    />
                  </CardContent>
                </Card>
              )}

              {tab === "students-list" && (
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Students List
                    </Typography>
                    <FormControl sx={{ mb: 2, minWidth: 200 }}>
                      <InputLabel>Class Filter</InputLabel>
                      <Select
                        value={selectedGrade}
                        label="Class Filter"
                        onChange={(e) => setSelectedGrade(e.target.value)}
                      >
                        <MenuItem value="">
                          <em>All Classes</em>
                        </MenuItem>
                        {grades.map((g) => (
                          <MenuItem key={g} value={g}>
                            {g}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <DataTable
                      data={filteredStudents}
                      columns={[
                        { key: 'rollNumber', label: 'Roll No.' },
                        {
                          key: 'name',
                          label: 'Name',
                          render: (value) => value || "-"
                        },
                        {
                          key: 'dob',
                          label: 'DOB',
                          render: (value) => value || "-"
                        },
                        {
                          key: 'className',
                          label: 'Class',
                          render: (value) => (value || "-").trim() || "-"
                        },
                        {
                          key: 'section',
                          label: 'Section',
                          render: (value) => (value || "-").trim() || "-"
                        },
                      ]}
                      emptyMessage="No students"
                    />
                  </CardContent>
                </Card>
              )}
              {notice && (
                <Alert
                  severity={noticeType === "success" ? "success" : "error"}
                  sx={{
                    position: "fixed",
                    left: "50%",
                    bottom: "40%",
                    transform: "translateX(-50%)",
                    minWidth: 240,
                    zIndex: 1000,
                  }}
                  role="status"
                  aria-live="polite"
                >
                  {notice}
                </Alert>
              )}
            </Box>
        </Box>
      )}
    </>
  );

  if (page) {
    return authed ? <div className="admin-page">{content}</div> : content;
  }

  return (
    <div className="admin-overlay">
      <div className="admin-modal">{content}</div>
    </div>
  );
}
