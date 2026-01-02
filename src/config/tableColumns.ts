import type { TableColumn } from "../components/DataTable";
import type { Homework } from "../type";

/**
 * Table Column Configurations
 * This file centralizes all table column definitions used across the application
 */

// ==================== HOMEWORK TABLE COLUMNS ====================

/**
 * Base columns for homework table
 */
export const HOMEWORK_BASE_COLUMNS: TableColumn<Homework>[] = [
  {
    key: "subject",
    label: "Subject",
  },
  {
    key: "description",
    label: "Description",
  },
];

/**
 * Optional class column for homework table
 */
export const HOMEWORK_CLASS_COLUMN: TableColumn<Homework> = {
  key: "className" as keyof Homework,
  label: "Class",
  render: (value: any) => value || "-",
};

/**
 * Teacher column for homework table
 */
export const HOMEWORK_TEACHER_COLUMN: TableColumn<Homework> = {
  key: "teacher",
  label: "Teacher",
  render: (value) => value || "-",
};

/**
 * Due date column for homework table
 */
export const HOMEWORK_DATE_COLUMN: TableColumn<Homework> = {
  key: "date",
  label: "Due Date",
};

/**
 * Get complete homework columns based on configuration
 */
export const getHomeworkColumns = (
  showClassColumn: boolean = false,
): TableColumn<Homework>[] => {
  return [
    ...HOMEWORK_BASE_COLUMNS,
    ...(showClassColumn ? [HOMEWORK_CLASS_COLUMN] : []),
    HOMEWORK_TEACHER_COLUMN,
    HOMEWORK_DATE_COLUMN,
  ];
};

// ==================== TEACHER TABLE COLUMNS ====================

/**
 * Teacher data interface for table
 */
export interface TeacherTableData {
  id: string;
  name: string;
  grade?: string;
  sections?: string[];
  pin?: string;
  secrete?: string;
}

/**
 * Complete columns configuration for teachers table
 */
export const TEACHER_COLUMNS: TableColumn<TeacherTableData>[] = [
  {
    key: "id",
    label: "ID",
  },
  {
    key: "name",
    label: "Name",
  },
  {
    key: "grade",
    label: "Class",
    render: (value) => value || "-",
  },
  {
    key: "sections",
    label: "Section",
    render: (value) => (value || []).join(", ") || "-",
  },
  {
    key: "pin",
    label: "Pin",
    render: (value) => value || "-",
  },
  {
    key: "secrete",
    label: "Secrete",
    render: (value) => value || "-",
  },
];

// ==================== STUDENT TABLE COLUMNS ====================

/**
 * Student data interface for table
 */
export interface StudentTableData {
  rollNumber: string;
  name?: string;
  dob?: string;
  className?: string;
  section?: string;
}

/**
 * Complete columns configuration for students table
 */
export const STUDENT_COLUMNS: TableColumn<StudentTableData>[] = [
  {
    key: "rollNumber",
    label: "Roll No.",
  },
  {
    key: "name",
    label: "Name",
    render: (value) => value || "-",
  },
  {
    key: "dob",
    label: "DOB",
    render: (value) => value || "-",
  },
  {
    key: "className",
    label: "Class",
    render: (value) => (value || "-").trim() || "-",
  },
  {
    key: "section",
    label: "Section",
    render: (value) => (value || "-").trim() || "-",
  },
];

// ==================== COLUMN FIELD LABELS ====================

/**
 * Common field labels used across tables
 */
export const TABLE_LABELS = {
  ID: "ID",
  NAME: "Name",
  SUBJECT: "Subject",
  DESCRIPTION: "Description",
  CLASS: "Class",
  SECTION: "Section",
  TEACHER: "Teacher",
  DUE_DATE: "Due Date",
  ROLL_NUMBER: "Roll No.",
  DOB: "DOB",
  PIN: "Pin",
  SECRETE: "Secrete",
  EDIT: "Edit",
} as const;

// ==================== EMPTY MESSAGES ====================

/**
 * Empty state messages for tables
 */
export const TABLE_EMPTY_MESSAGES = {
  NO_HOMEWORK: "No homework",
  NO_TEACHERS: "No teachers",
  NO_STUDENTS: "No students",
  NO_DATA: "No data available",
} as const;
