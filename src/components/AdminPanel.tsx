import { useEffect, useMemo, useRef, useState } from "react";
import "../styles/Admin.css";
import "../styles/Login.css";
import {
  parseTeachersExcel,
  parseStudentsExcel,
  saveTeacherRoster,
  saveStudentRoster,
  type TeacherRecord,
  type StudentRecord,
} from "../services/roster";
import { getTeachersFromFirestore, getStudentsFromFirestore } from "../services/db";

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
  const [pin, setPin] = useState("");
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
  const studentInputRef = useRef<HTMLInputElement | null>(null);
  const teacherInputRef = useRef<HTMLInputElement | null>(null);

  const adminPin = process.env.REACT_APP_ADMIN_PIN || "9999";

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

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin !== adminPin) {
      setNotice("Invalid admin PIN");
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

  const handleLogout = () => {
    setAuthed(false);
    setPin("");
    setNotice("");
    try {
      localStorage.removeItem("assignly_admin_authed");
    } catch {}
    try {
      window.dispatchEvent(
        new CustomEvent("assignly:admin-auth", { detail: { authed: false } })
      );
    } catch {}
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

  const loginForm = (
    <form onSubmit={handleAuth} className="card admin-login">
      <input
        type="password"
        placeholder="Admin PIN"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
      />
      <button type="submit">Continue</button>
      {notice && (
        <small className="muted" style={{ color: "#d33" }}>
          {notice}
        </small>
      )}
    </form>
  );

  const content = (
    <>
      {!authed ? (
        page ? (
          <div className="container login-container">
            <h2>Admin Access</h2>
            <p>Sign in with your PIN</p>
            {loginForm}
          </div>
        ) : (
          loginForm
        )
      ) : (
        <div className="admin-layout">
          <div
            className="sidenav admin-sidenav"
            role="navigation"
            aria-label="Admin Navigation"
          >
            <button
              className={`side-item ${tab === "teachers-list" ? "active" : ""}`}
              onClick={() => setTab("teachers-list")}
              title="Teachers List"
            >
              Teachers List
            </button>
            <button
              className={`side-item ${
                tab === "upload-teachers" ? "active" : ""
              }`}
              onClick={() => setTab("upload-teachers")}
              title="Upload Teachers"
            >
              Upload Teachers
            </button>
            <div className="admin-sep" />
            <button
              className={`side-item ${tab === "students-list" ? "active" : ""}`}
              onClick={() => setTab("students-list")}
              title="Students List"
            >
              Students List
            </button>

            <button
              className={`side-item ${
                tab === "upload-students" ? "active" : ""
              }`}
              onClick={() => setTab("upload-students")}
              title="Upload Students"
            >
              Upload Students
            </button>
          </div>
          <div className="admin-main">
            <div className="admin-content">
              {tab === "upload-students" && (
                <div className="card">
                  <p>
                    Please upload an Excel file with a sheet named{" "}
                    <strong>Students</strong>. The sheet must include the
                    columns: Roll No, Name, DOB (YYYY-MM-DD), Grade, Section.
                  </p>
                  <p>
                    <strong>Example:</strong> 1234 | John Doe | Grade 4 | A
                  </p>
                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <input
                      ref={studentInputRef}
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={(e) => {
                        const f = e.currentTarget.files?.[0] || null;
                        setStudentFile(f);
                      }}
                      style={{ flex: 1, marginTop: 0 }}
                    />
                    <button
                      className="secondary"
                      disabled={!studentFile || uploadingStudents}
                      onClick={() =>
                        studentFile && handleUploadStudents(studentFile)
                      }
                      style={{
                        marginLeft: "auto",
                        width: "25%",
                        marginTop: 0,
                      }}
                    >
                      {uploadingStudents ? "Uploading..." : "Upload"}
                    </button>
                  </div>
                </div>
              )}

              {tab === "upload-teachers" && (
                <div className="card">
                  <p>
                    Please upload an Excel file with a sheet named{" "}
                    <strong>Teachers</strong>. The sheet must include the
                    columns: ID, Name, Class, Section, Pin (optional Secrete).
                  </p>
                  <p>
                    <strong>Example:</strong> 1 | John Doe | Grade 4 | A | 1234
                    | Grade 4 A.
                  </p>
                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <input
                      ref={teacherInputRef}
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={(e) => {
                        const f = e.currentTarget.files?.[0] || null;
                        setTeacherFile(f);
                      }}
                      style={{ flex: 1, marginTop: 0 }}
                    />
                    <button
                      className="secondary"
                      disabled={!teacherFile || uploadingTeachers}
                      onClick={() =>
                        teacherFile && handleUploadTeachers(teacherFile)
                      }
                      style={{
                        marginLeft: "auto",
                        width: "25%",
                        marginTop: 0,
                      }}
                    >
                      {uploadingTeachers ? "Uploading..." : "Upload"}
                    </button>
                  </div>
                </div>
              )}

              {tab === "teachers-list" && (
                <div className="card">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Class</th>
                        <th>Section</th>
                        <th>Pin</th>
                        <th>Secrete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teachers.length === 0 && (
                        <tr>
                          <td colSpan={6} style={{ textAlign: "center" }}>
                            No teachers
                          </td>
                        </tr>
                      )}
                      {teachers.map((t: TeacherRecord) => {
                        const gradeText = t.grade || "-";
                        const sectionText =
                          (t.sections || []).join(", ") || "-";
                        return (
                          <tr key={t.id}>
                            <td>{t.id}</td>
                            <td>{t.name}</td>
                            <td>{gradeText}</td>
                            <td>{sectionText}</td>
                            <td>{t.pin || "-"}</td>
                            <td>{t.secrete || "-"}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {tab === "students-list" && (
                <div className="card">
                  <h2 className="table-header">Students List</h2>

                  <div className="table-header">
                    <select
                      value={selectedGrade}
                      onChange={(e) => setSelectedGrade(e.target.value)}
                    >
                      <option value="">All Classes</option>
                      {grades.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Roll No.</th>
                        <th>Name</th>
                        <th>DOB</th>
                        <th>Class</th>
                        <th>Section</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.length === 0 && (
                        <tr>
                          <td colSpan={5} style={{ textAlign: "center" }}>
                            No students
                          </td>
                        </tr>
                      )}
                      {filteredStudents.map((s: StudentRecord) => {
                        const gradeText = (s.className || "-").trim() || "-";
                        const sectionText = (s.section || "-").trim() || "-";
                        return (
                          <tr key={s.rollNumber}>
                            <td>{s.rollNumber}</td>
                            <td>{s.name || "-"}</td>
                            <td>{s.dob || "-"}</td>
                            <td>{gradeText}</td>
                            <td>{sectionText}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
              {notice && (
                <div
                  role="status"
                  aria-live="polite"
                  style={{
                    position: "fixed",
                    left: "50%",
                    bottom: "40%",
                    transform: "translateX(-50%)",
                    background: "#fff",
                    border: "1px solid #ddd",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                    borderRadius: 8,
                    padding: "8px 12px",
                    color: noticeType === "success" ? "#2ea44f" : "#d33",
                    minWidth: 240,
                    textAlign: "center",
                    zIndex: 1000,
                  }}
                >
                  {notice}
                </div>
              )}
            </div>
          </div>
        </div>
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
