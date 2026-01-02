import { Navigate, RouteObject } from "react-router-dom";
import Login from "../pages/Login";
import AdminPage from "../pages/AdminPage";
import RoleShell from "../layouts/RoleShell";
import type { Homework, User } from "../type";

interface CreateRoutesArgs {
  user: User | null;
  setUser: (u: User | null) => void;
  homeworks: Homework[];
  setHomeworks: React.Dispatch<React.SetStateAction<Homework[]>>;
  teacherTab: "dashboard" | "form";
  setTeacherTab: (tab: "dashboard" | "form") => void;
}

export function createRoutes(args: CreateRoutesArgs): RouteObject[] {
  const { user, setUser, homeworks, setHomeworks, teacherTab, setTeacherTab } =
    args;

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
    {
      path: "/admin",
      element: <AdminPage />,
    },
  ];
}
