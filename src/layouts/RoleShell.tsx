import { useState } from "react";
import { Box } from "@mui/material";
import Sidenav from "../components/Sidenav";
import TeacherDashboard from "../pages/TeacherDashboard";
import TeacherForm from "../pages/TeacherForm";
import StudentDashboard from "../pages/StudentDashboard";
import type { Homework, User } from "../type";

interface RoleShellProps {
  user: User;
  homeworks: Homework[];
  setHomeworks: React.Dispatch<React.SetStateAction<Homework[]>>;
  teacherTab: "dashboard" | "form";
  setTeacherTab: (tab: "dashboard" | "form") => void;
}

export default function RoleShell({
  user,
  homeworks,
  setHomeworks,
  teacherTab,
  setTeacherTab,
}: RoleShellProps) {
  const [editing, setEditing] = useState<Homework | null>(null);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
        minHeight: "100%",
      }}
    >
      <Sidenav
        role={user.role}
        selected={teacherTab}
        onSelect={setTeacherTab}
      />
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "flex-start",
          width: "100%",
        }}
      >
        {user.role === "teacher" && (
          <Box sx={{ width: "100%" }}>
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
          </Box>
        )}

        {user.role === "student" && (
          <StudentDashboard homeworks={homeworks} setHomeworks={setHomeworks} />
        )}
      </Box>
    </Box>
  );
}
