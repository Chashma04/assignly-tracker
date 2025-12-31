import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { User } from "../type";
import "./HeaderBar.css";

interface Props {
  user: User | null;
  setUser: (u: User | null) => void;
  theme: "light" | "dark";
  setTheme: (t: "light" | "dark") => void;
}

export default function HeaderBar({ user, setUser, theme, setTheme }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [adminAuthed, setAdminAuthed] = useState(false);
  const actionsRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = location.pathname.startsWith("/admin");
  const backLabel = user?.role === "teacher" ? "Teacher" : user?.role === "student" ? "Student" : "Home";
  const backTarget = user?.role === "teacher" ? "/teacher" : user?.role === "student" ? "/student" : "/";

  const getInitials = (name?: string, role?: string) => {
    if (name && name.trim().length > 0) {
      const parts = name.trim().split(/\s+/);
      const first = parts[0]?.[0] || "";
      const last =
        parts.length > 1
          ? parts[parts.length - 1]?.[0] || ""
          : parts[0]?.[1] || "";
      const initials = `${first}${last}`.toUpperCase();
      return initials || (role === "teacher" ? "T" : "S");
    }
    return role === "teacher" ? "T" : "S";
  };

  const formatRole = (role?: string) => {
    if (!role) return "";
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  useEffect(() => {
    try {
      setAdminAuthed(localStorage.getItem("assignly_admin_authed") === "1");
    } catch {}
    const onStorage = (e: StorageEvent) => {
      if (e.key === "assignly_admin_authed") {
        setAdminAuthed(e.newValue === "1");
      }
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

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (!menuOpen) return;
      const target = e.target as Node;
      if (actionsRef.current && !actionsRef.current.contains(target)) {
        setMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <>
      <div className="topbar flex items-center gap-3 px-4">
        <div className="brand-area">
          <div className="brand-row">
            <img src="/logo.svg" alt="Assignly" className="logo" />
            <div className="brand">Assignly</div>
          </div>
        </div>
        <div
          ref={actionsRef}
          className="actions ml-auto flex items-center gap-2"
        >
          <button
            className="link"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </button>
          {/* Hide Admin button when a teacher/student is logged in */}
          {!adminAuthed && (
            isAdmin ? (
              <button className="link" onClick={() => navigate(backTarget)}>
                {backLabel}
              </button>
            ) : !user ? (
              <button className="link" onClick={() => navigate("/admin")}>
                Admin
              </button>
            ) : null
          )}
          {(user || adminAuthed) && (
            <>
              <button
                className="user-trigger"
                aria-label="User menu"
                onClick={() => setMenuOpen((v) => !v)}
              >
                {adminAuthed ? "A" : getInitials(user?.name, user?.role)}
              </button>
              {menuOpen && (
                <div className="user-menu">
                  <div className="user-role">
                    <span className="muted" style={{ fontWeight: 600, marginRight: 6 }}>Role:</span>
                    <span
                      className={`status ${adminAuthed ? "completed" : "pending"}`}
                      style={{ textTransform: "capitalize" }}
                    >
                      {adminAuthed ? "Admin" : formatRole(user?.role)}
                    </span>
                  </div>
                  {!adminAuthed && (
                    <div className="user-name" style={{ marginTop: 6 }}>
                      <span className="muted" style={{ fontWeight: 600 }}>User:</span>{" "}
                      <span className="muted" style={{ fontWeight: 600 }}>
                        {user?.name
                          ? user.name
                          : user?.rollNumber
                          ? `Roll #${user.rollNumber}`
                          : "User"}
                      </span>
                    </div>
                  )}
                  <div className="menu-sep" />
                  <button
                    className="menu-btn"
                    onClick={() => {
                      if (adminAuthed) {
                        try {
                          localStorage.removeItem("assignly_admin_authed");
                        } catch {}
                        try {
                          window.dispatchEvent(new CustomEvent("assignly:admin-auth", { detail: { authed: false } }));
                        } catch {}
                        setMenuOpen(false);
                        if (isAdmin) navigate("/admin", { replace: true });
                        return;
                      }
                      setUser(null);
                      setMenuOpen(false);
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {/* Admin page is routed via /admin */}
    </>
  );
}

export {};
