import { useEffect, useState } from "react";
import { useLocation, useNavigate, useRoutes } from "react-router-dom";
import HeaderBar from "./components/HeaderBar";
import { useAdminAuth } from "./hooks/useAdminAuth";
import { useAuth } from "./hooks/useAuth";
import { useHomeworks } from "./hooks/useHomeworks";
import { useTheme } from "./hooks/useTheme";
import { createRoutes } from "./routes";
import "./styles/Controls.css";
import "./styles/Layout.css";

export default function App() {
  const { user, setUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const { homeworks, setHomeworks } = useHomeworks();
  const [teacherTab, setTeacherTab] = useState<"dashboard" | "form">(
    "dashboard"
  );
  const { adminAuthed } = useAdminAuth();

  // Ensure student always sees dashboard tab
  useEffect(() => {
    if (user?.role === "student") {
      setTeacherTab("dashboard");
    }
  }, [user?.role]);

  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = location.pathname.startsWith("/admin");
  const backLabel = user?.role === "teacher" ? "Teacher" : user?.role === "student" ? "Student" : "Home";
  const backTarget = user?.role === "teacher" ? "/teacher" : user?.role === "student" ? "/student" : "/";

  const routing = useRoutes(
    createRoutes({
      user,
      setUser,
      homeworks,
      setHomeworks,
      teacherTab,
      setTeacherTab,
    })
  );

  return (
    <div className="app">
      <HeaderBar
        user={user}
        setUser={setUser}
        theme={theme}
        setTheme={setTheme}
      />

      {isAdmin && !adminAuthed && (
        <div className="page-back-wrap">
          <button className="page-back" onClick={() => navigate(backTarget)}>
            ← Back to {backLabel}
          </button>
        </div>
      )}
      <main className="main-area">{(routing as unknown) as React.ReactNode}</main>
    </div>
  );
}
