import { useEffect, useState } from "react";
import "./styles/Layout.css";
import "./styles/Controls.css";
import type { Homework, User } from "./type";
import TeacherDashboard from "./components/TeacherDashboard";
import StudentDashboard from "./components/StudentDashboard";
import Login from "./components/Login";
import HeaderBar from "./components/HeaderBar";
import Sidenav from "./components/Sidenav";
import TeacherForm from "./components/TeacherForm";
import { useRoutes, useLocation, useNavigate } from "react-router-dom";
import { createRoutes } from "./routes";
import { fetchHomeworks } from "./services/db";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [teacherTab, setTeacherTab] = useState<"dashboard" | "form">(
    "dashboard"
  );

  // Load persisted user and theme only (homeworks come from Firestore)
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("assignly_user");
      if (savedUser) {
        const u = JSON.parse(savedUser);
        // Migrate old 'parent' role to 'student'
        if (u && u.role === "parent") u.role = "student";
        setUser(u);
      }
      const savedTheme = localStorage.getItem("assignly_theme");
      if (savedTheme === "dark" || savedTheme === "light") setTheme(savedTheme);
    } catch {}
  }, []);

  // Try to load from Firestore after mount; prefer Firestore data when available
  useEffect(() => {
    (async () => {
      try {
        const fromDb = await fetchHomeworks();
        if (Array.isArray(fromDb) && fromDb.length > 0) {
          setHomeworks(fromDb);
        }
      } catch (e) {
        console.warn("Failed to fetch homeworks from Firestore", e);
      }
    })();
  }, []);

  // Do not persist homeworks to localStorage; rely on Firestore

  useEffect(() => {
    try {
      if (user) localStorage.setItem("assignly_user", JSON.stringify(user));
      else localStorage.removeItem("assignly_user");
    } catch {}
  }, [user]);

  // Apply theme class to root
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    try {
      localStorage.setItem("assignly_theme", theme);
    } catch {}
  }, [theme]);

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
  const [adminAuthed, setAdminAuthed] = useState(false);

  useEffect(() => {
    try {
      setAdminAuthed(localStorage.getItem("assignly_admin_authed") === "1");
    } catch {}
    const onStorage = (e: StorageEvent) => {
      if (e.key === "assignly_admin_authed") setAdminAuthed(e.newValue === "1");
    };
    const onCustom = (e: Event) => {
      const ev = e as CustomEvent;
      if (ev && ev.detail && typeof ev.detail.authed === "boolean") {
        setAdminAuthed(!!ev.detail.authed);
      }
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("assignly:admin-auth", onCustom as EventListener);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("assignly:admin-auth", onCustom as EventListener);
    };
  }, []);

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
