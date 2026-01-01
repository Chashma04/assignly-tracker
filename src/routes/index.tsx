import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import Login from "../pages/Login";
import AdminPage from "../pages/AdminPage";
import Sidenav from "../pages/Sidenav";
import TeacherDashboard from "../pages/TeacherDashboard";
import TeacherForm from "../pages/TeacherForm";
import StudentDashboard from "../pages/StudentDashboard";
import type { Homework, User } from "../type";

interface CreateRoutesArgs {
  user: User | null;
  setUser: (u: User | null) => void;
  homeworks: Homework[];
  setHomeworks: React.Dispatch<React.SetStateAction<Homework[]>>;
  teacherTab: "dashboard" | "form";
  setTeacherTab: (tab: "dashboard" | "form") => void;
}

function RoleShell(props: {
  user: User;
  homeworks: Homework[];
  setHomeworks: React.Dispatch<React.SetStateAction<Homework[]>>;
  teacherTab: "dashboard" | "form";
  setTeacherTab: (tab: "dashboard" | "form") => void;
}) {
  const { user, homeworks, setHomeworks, teacherTab, setTeacherTab } = props;
  const [editing, setEditing] = useState<Homework | null>(null);
  return (
    <div className="content-row">
      <Sidenav role={user.role} selected={teacherTab} onSelect={setTeacherTab} />
      <div className="content-main">
        {user.role === "teacher" && (
          <div style={{ width: "100%" }}>
            {teacherTab === "dashboard" && (
              <TeacherDashboard
                homeworks={homeworks}
                user={user}
                onEdit={(hw) => {
                  setEditing(hw);
                  setTeacherTab("form");
                }}
              />
            )}
            {teacherTab === "form" && (
              <TeacherForm
                homeworks={homeworks}
                setHomeworks={setHomeworks}
                teacherName={user?.name || undefined}
                assigned={user?.assigned}
                editing={editing}
                onDoneEditing={() => setEditing(null)}
              />
            )}
          </div>
        )}

        {user.role === "student" && (
          <StudentDashboard homeworks={homeworks} setHomeworks={setHomeworks} />
        )}
      </div>
    </div>
  );
}

export function createRoutes(args: CreateRoutesArgs) {
  const { user, setUser, homeworks, setHomeworks, teacherTab, setTeacherTab } = args;

  return [
    {
      path: "/",
      element: !user ? (
        <Login onLogin={setUser} />
      ) : (
        <RoleShell
          user={user}
          homeworks={homeworks}
          setHomeworks={setHomeworks}
          teacherTab={teacherTab}
          setTeacherTab={setTeacherTab}
        />
      ),
    },
    {
      path: "/teacher",
      element:
        user && user.role === "teacher" ? (
          <RoleShell
            user={user}
            homeworks={homeworks}
            setHomeworks={setHomeworks}
            teacherTab={teacherTab}
            setTeacherTab={setTeacherTab}
          />
        ) : (
          <Navigate to="/" replace />
        ),
    },
    {
      path: "/student",
      element:
        user && user.role === "student" ? (
          <RoleShell
            user={user}
            homeworks={homeworks}
            setHomeworks={setHomeworks}
            teacherTab={teacherTab}
            setTeacherTab={setTeacherTab}
          />
        ) : (
          <Navigate to="/" replace />
        ),
    },
    { path: "/admin", element: <AdminPage /> },
  ];
}
