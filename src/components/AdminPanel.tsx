import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Alert,
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  Dialog,
  DialogContent,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import { SupervisorAccount, Upload, School, Groups } from "@mui/icons-material";
import DataTable from "./DataTable";
import FileInput from "./FileInput";
import AdminLogin from "./AdminLogin";
import DataFilter, { FilterConfig } from "./DataFilter";
import { useAdminAuth } from "../hooks/useAdminAuth";
import {
  parseTeachersExcel,
  parseStudentsExcel,
  saveTeacherRoster,
  saveStudentRoster,
  type TeacherRecord,
  type StudentRecord,
} from "../services/roster";
import {
  getTeachersFromFirestore,
  getStudentsFromFirestore,
} from "../services/db";
import {
  STORAGE_KEYS,
  ADMIN_TABS,
  DEFAULT_ADMIN_TAB,
  NOTICE_DISMISS_DURATION,
  TEMPLATE_URLS,
  EXCEL_SHEETS,
} from "../config/constants";
import {
  TEACHER_COLUMNS,
  STUDENT_COLUMNS,
  TABLE_EMPTY_MESSAGES,
} from "../config/tableColumns";

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
  const { adminAuthed: authed, setAdminAuthed: setAuthed } = useAdminAuth();
  const [tab, setTab] = useState<Tab>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ADMIN_TAB);
      const allowed: Tab[] = [
        ADMIN_TABS.UPLOAD_STUDENTS,
        ADMIN_TABS.UPLOAD_TEACHERS,
        ADMIN_TABS.TEACHERS_LIST,
        ADMIN_TABS.STUDENTS_LIST,
      ];
      if (stored && (allowed as string[]).includes(stored)) {
        return stored as Tab;
      }
    } catch {}
    return DEFAULT_ADMIN_TAB;
  });
  const [notice, setNotice] = useState<string>("");
  const [noticeType, setNoticeType] = useState<"success" | "error" | "">("");
  const [studentFile, setStudentFile] = useState<File | null>(null);
  const [teacherFile, setTeacherFile] = useState<File | null>(null);
  const [uploadingStudents, setUploadingStudents] = useState(false);
  const [uploadingTeachers, setUploadingTeachers] = useState(false);

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

  const teacherFilters: FilterConfig<TeacherRecord>[] = useMemo(
    () => [
      {
        key: "class",
        label: "Class Filter",
        getOptions: (data) => {
          const set = new Set<string>();
          data.forEach((r) => {
            if (r.grade) set.add(r.grade);
          });
          return Array.from(set).sort();
        },
        filterFn: (item, value) => item.grade === value,
      },
      {
        key: "section",
        label: "Section Filter",
        getOptions: (data) => {
          const set = new Set<string>();
          data.forEach((r) => {
            if (r.sections && Array.isArray(r.sections)) {
              r.sections.forEach((section: string) => set.add(section));
            }
          });
          return Array.from(set).sort();
        },
        filterFn: (item, value) =>
          Boolean(
            item.sections &&
            Array.isArray(item.sections) &&
            item.sections.includes(value),
          ),
      },
    ],
    [],
  );

  const studentFilters: FilterConfig<StudentRecord>[] = useMemo(
    () => [
      {
        key: "class",
        label: "Class Filter",
        getOptions: (data) => {
          const set = new Set<string>();
          data.forEach((r) => {
            if (r.className) set.add(r.className);
          });
          return Array.from(set).sort();
        },
        filterFn: (item, value) => item.className === value,
      },
    ],
    [],
  );

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
    }
  };

  useEffect(() => {
    // Auto-dismiss notices after a short duration
    if (!notice) return;
    const timer = setTimeout(() => {
      setNotice("");
      setNoticeType("");
    }, NOTICE_DISMISS_DURATION);
    return () => clearTimeout(timer);
  }, [notice]);

  // Fetch rosters on mount and when authed changes
  useEffect(() => {
    void refreshTeachers();
    void refreshStudents();
  }, [authed]);

  // Persist selected admin tab
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ADMIN_TAB, tab);
    } catch {}
  }, [tab]);

  const content = (
    <>
      {!authed ? (
        <AdminLogin onLogin={() => setAuthed(true)} page={page} />
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Box
            sx={{
              pb: { xs: 1, sm: 1.5, md: 1 },
              borderBottom: 1,
              borderColor: "divider",
              flexShrink: 0,
            }}
          >
            <Typography
              variant="h4"
              fontWeight="bold"
              align="center"
              color="primary"
              sx={{ fontSize: { xs: "1rem", sm: "1rem", md: "1.5rem" } }}
            >
              ADMIN ACCESS
            </Typography>
          </Box>
          <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
            <Drawer
              variant="permanent"
              sx={{
                width: { xs: 60, sm: 210 },
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                  width: { xs: 60, sm: 220 },
                  boxSizing: "border-box",
                  position: "relative",
                  height: "85vh",
                  minHeight: "500px",
                  maxHeight: "84vh",
                  overflow: "hidden",
                  backgroundColor: (theme) =>
                    theme.palette.mode === "dark" ? "#1a2332" : "#ffffff",
                  borderRight: "1px solid",
                  borderBottom: "1px solid",
                  borderColor: (theme) =>
                    theme.palette.mode === "dark" ? "#2d3748" : "#e0e0e0",
                },
              }}
            >
              <List sx={{ pt: 2 }}>
                <ListItem disablePadding>
                  <ListItemButton disabled>
                    <ListItemIcon sx={{ minWidth: { xs: "auto", sm: 40 } }}>
                      <School color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Teachers Data"
                      primaryTypographyProps={{
                        variant: "overline",
                        fontWeight: "bold",
                        color: "primary",
                      }}
                      sx={{ display: { xs: "none", sm: "block" } }}
                    />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton
                    selected={tab === ADMIN_TABS.TEACHERS_LIST}
                    onClick={() => setTab(ADMIN_TABS.TEACHERS_LIST)}
                    sx={{
                      pl: { xs: 1, sm: 4 },
                      justifyContent: { xs: "center", sm: "flex-start" },
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&.Mui-selected": {
                        backgroundColor: "primary.main",
                        color: "primary.contrastText",
                        transform: "translateX(4px)",
                        boxShadow: (theme) =>
                          theme.palette.mode === "dark"
                            ? "0 2px 8px rgba(92, 107, 192, 0.3)"
                            : "0 2px 8px rgba(57, 73, 171, 0.2)",
                        "&:hover": {
                          backgroundColor: "primary.dark",
                        },
                        "& .MuiListItemIcon-root": {
                          color: "primary.contrastText",
                          transform: "scale(1.1)",
                        },
                      },
                      "&:hover": {
                        backgroundColor: (theme) =>
                          theme.palette.mode === "dark"
                            ? "rgba(255, 255, 255, 0.08)"
                            : "rgba(0, 0, 0, 0.04)",
                        transform: "translateX(2px)",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: { xs: "auto", sm: 40 },
                        color: "inherit",
                        transition:
                          "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      }}
                    >
                      <SupervisorAccount />
                    </ListItemIcon>
                    <ListItemText
                      primary="Teachers List"
                      sx={{ display: { xs: "none", sm: "block" } }}
                    />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton
                    selected={tab === ADMIN_TABS.UPLOAD_TEACHERS}
                    onClick={() => setTab(ADMIN_TABS.UPLOAD_TEACHERS)}
                    sx={{
                      pl: { xs: 1, sm: 4 },
                      justifyContent: { xs: "center", sm: "flex-start" },
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&.Mui-selected": {
                        backgroundColor: "primary.main",
                        color: "primary.contrastText",
                        transform: "translateX(4px)",
                        boxShadow: (theme) =>
                          theme.palette.mode === "dark"
                            ? "0 2px 8px rgba(92, 107, 192, 0.3)"
                            : "0 2px 8px rgba(57, 73, 171, 0.2)",
                        "&:hover": {
                          backgroundColor: "primary.dark",
                        },
                        "& .MuiListItemIcon-root": {
                          color: "primary.contrastText",
                          transform: "scale(1.1)",
                        },
                      },
                      "&:hover": {
                        backgroundColor: (theme) =>
                          theme.palette.mode === "dark"
                            ? "rgba(255, 255, 255, 0.08)"
                            : "rgba(0, 0, 0, 0.04)",
                        transform: "translateX(2px)",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: { xs: "auto", sm: 40 },
                        color: "inherit",
                        transition:
                          "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      }}
                    >
                      <Upload />
                    </ListItemIcon>
                    <ListItemText
                      primary="Upload Teachers"
                      sx={{ display: { xs: "none", sm: "block" } }}
                    />
                  </ListItemButton>
                </ListItem>
                <Divider sx={{ my: 1 }} />
                <ListItem disablePadding>
                  <ListItemButton disabled>
                    <ListItemIcon sx={{ minWidth: { xs: "auto", sm: 40 } }}>
                      <Groups color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Students Data"
                      primaryTypographyProps={{
                        variant: "overline",
                        fontWeight: "bold",
                        color: "primary",
                      }}
                      sx={{ display: { xs: "none", sm: "block" } }}
                    />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton
                    selected={tab === ADMIN_TABS.STUDENTS_LIST}
                    onClick={() => setTab(ADMIN_TABS.STUDENTS_LIST)}
                    sx={{
                      pl: { xs: 1, sm: 4 },
                      justifyContent: { xs: "center", sm: "flex-start" },
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&.Mui-selected": {
                        backgroundColor: "primary.main",
                        color: "primary.contrastText",
                        transform: "translateX(4px)",
                        boxShadow: (theme) =>
                          theme.palette.mode === "dark"
                            ? "0 2px 8px rgba(92, 107, 192, 0.3)"
                            : "0 2px 8px rgba(57, 73, 171, 0.2)",
                        "&:hover": {
                          backgroundColor: "primary.dark",
                        },
                        "& .MuiListItemIcon-root": {
                          color: "primary.contrastText",
                          transform: "scale(1.1)",
                        },
                      },
                      "&:hover": {
                        backgroundColor: (theme) =>
                          theme.palette.mode === "dark"
                            ? "rgba(255, 255, 255, 0.08)"
                            : "rgba(0, 0, 0, 0.04)",
                        transform: "translateX(2px)",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: { xs: "auto", sm: 40 },
                        color: "inherit",
                        transition:
                          "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      }}
                    >
                      <Groups />
                    </ListItemIcon>
                    <ListItemText
                      primary="Students List"
                      sx={{ display: { xs: "none", sm: "block" } }}
                    />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton
                    selected={tab === ADMIN_TABS.UPLOAD_STUDENTS}
                    onClick={() => setTab(ADMIN_TABS.UPLOAD_STUDENTS)}
                    sx={{
                      pl: { xs: 1, sm: 4 },
                      justifyContent: { xs: "center", sm: "flex-start" },
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&.Mui-selected": {
                        backgroundColor: "primary.main",
                        color: "primary.contrastText",
                        transform: "translateX(4px)",
                        boxShadow: (theme) =>
                          theme.palette.mode === "dark"
                            ? "0 2px 8px rgba(92, 107, 192, 0.3)"
                            : "0 2px 8px rgba(57, 73, 171, 0.2)",
                        "&:hover": {
                          backgroundColor: "primary.dark",
                        },
                        "& .MuiListItemIcon-root": {
                          color: "primary.contrastText",
                          transform: "scale(1.1)",
                        },
                      },
                      "&:hover": {
                        backgroundColor: (theme) =>
                          theme.palette.mode === "dark"
                            ? "rgba(255, 255, 255, 0.08)"
                            : "rgba(0, 0, 0, 0.04)",
                        transform: "translateX(2px)",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: { xs: "auto", sm: 40 },
                        color: "inherit",
                        transition:
                          "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      }}
                    >
                      <Upload />
                    </ListItemIcon>
                    <ListItemText
                      primary="Upload Students"
                      sx={{ display: { xs: "none", sm: "block" } }}
                    />
                  </ListItemButton>
                </ListItem>
              </List>
            </Drawer>
            <Box
              component="main"
              sx={{
                flex: 1,
                overflow: "auto",
                pl: { xs: 1.5, sm: 2, md: 3 },
                pt: { xs: 1.5, sm: 2, md: 1.8 },
                height: "100%",
              }}
            >
              {tab === ADMIN_TABS.UPLOAD_STUDENTS && (
                <Card sx={{ p: 3, mb: 3 }}>
                  <CardContent>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      Please upload an Excel file with a sheet named{" "}
                      <Typography component="span" fontWeight="bold">
                        {EXCEL_SHEETS.STUDENTS}
                      </Typography>
                      . The sheet must include the columns: Roll No, Name, DOB
                      (YYYY-MM-DD), Grade, Section.
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      <Typography component="span" fontWeight="bold">
                        Example:
                      </Typography>{" "}
                      1234 | John Doe | Grade 4 | A
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        alignItems: "flex-start",
                        flexDirection: { xs: "column", sm: "row" },
                      }}
                    >
                      <FileInput
                        accept=".xlsx,.xls"
                        selectedFile={studentFile}
                        placeholder="No student file selected"
                        onChange={setStudentFile}
                        variant="outlined"
                        fullWidth
                        onUpload={() =>
                          studentFile && handleUploadStudents(studentFile)
                        }
                        uploading={uploadingStudents}
                      />
                      <Button
                        variant="outlined"
                        color="primary"
                        href={TEMPLATE_URLS.STUDENTS}
                        download
                        sx={{ minWidth: "180px", whiteSpace: "nowrap" }}
                      >
                        Download Template
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              )}

              {tab === ADMIN_TABS.UPLOAD_TEACHERS && (
                <Card sx={{ p: 3, mb: 3 }}>
                  <CardContent>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      Please upload an Excel file with a sheet named{" "}
                      <Typography component="span" fontWeight="bold">
                        {EXCEL_SHEETS.TEACHERS}
                      </Typography>
                      . The sheet must include the columns: ID, Name, Class,
                      Section, Pin.
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      <Typography component="span" fontWeight="bold">
                        Example:
                      </Typography>{" "}
                      1 | John Doe | Grade 4 | A | 1234 | Grade 4 A.
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        alignItems: "flex-start",
                        flexDirection: { xs: "column", sm: "row" },
                      }}
                    >
                      <FileInput
                        accept=".xlsx,.xls"
                        selectedFile={teacherFile}
                        placeholder="No teacher file selected"
                        onChange={setTeacherFile}
                        variant="outlined"
                        fullWidth
                        onUpload={() =>
                          teacherFile && handleUploadTeachers(teacherFile)
                        }
                        uploading={uploadingTeachers}
                      />
                      <Button
                        variant="outlined"
                        color="primary"
                        href={TEMPLATE_URLS.TEACHERS}
                        download
                        sx={{ minWidth: "180px", whiteSpace: "nowrap" }}
                      >
                        Download Template
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              )}

              {tab === ADMIN_TABS.TEACHERS_LIST && (
                <Card sx={{ mb: 1 }}>
                  <CardContent>
                    <DataFilter
                      data={teachers}
                      title="Teachers List"
                      filters={teacherFilters}
                    >
                      {(filteredData) => (
                        <DataTable
                          data={filteredData}
                          columns={TEACHER_COLUMNS}
                          emptyMessage={TABLE_EMPTY_MESSAGES.NO_TEACHERS}
                        />
                      )}
                    </DataFilter>
                  </CardContent>
                </Card>
              )}

              {tab === ADMIN_TABS.STUDENTS_LIST && (
                <Card sx={{ mb: 1 }}>
                  <CardContent>
                    <DataFilter
                      data={students}
                      title="Students List"
                      filters={studentFilters}
                    >
                      {(filteredData) => (
                        <DataTable
                          data={filteredData}
                          columns={STUDENT_COLUMNS}
                          emptyMessage={TABLE_EMPTY_MESSAGES.NO_STUDENTS}
                        />
                      )}
                    </DataFilter>
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
        </Box>
      )}
    </>
  );

  if (page) {
    return authed ? <Box sx={{ pt: 2, px: 2 }}>{content}</Box> : content;
  }

  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          maxHeight: "90vh",
          overflow: "auto",
        },
      }}
    >
      <DialogContent sx={{ p: 1 }}>{content}</DialogContent>
    </Dialog>
  );
}
