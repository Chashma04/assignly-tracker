// LocalStorage Keys
export const STORAGE_KEYS = {
  USER: "assignly_user",
  ADMIN_AUTHED: "assignly_admin_authed",
  ADMIN_TAB: "assignly_admin_tab",
  THEME: "assignly_theme",
} as const;

// Custom Events
export const CUSTOM_EVENTS = {
  ADMIN_AUTH: "assignly:admin-auth",
} as const;

// Firestore Collection Names
export const COLLECTIONS = {
  TEACHERS: "teachers",
  STUDENTS: "students",
  HOMEWORKS: "homeworks",
  ADMIN: "admin",
} as const;

// Firestore Document IDs
export const DOCUMENT_IDS = {
  ADMIN_SECRET: "admin-secret",
} as const;

// Admin Tab Types
export const ADMIN_TABS = {
  UPLOAD_STUDENTS: "upload-students",
  UPLOAD_TEACHERS: "upload-teachers",
  TEACHERS_LIST: "teachers-list",
  STUDENTS_LIST: "students-list",
} as const;

// Default Admin Tab
export const DEFAULT_ADMIN_TAB = ADMIN_TABS.TEACHERS_LIST;

// Admin Authentication Value
export const ADMIN_AUTH_VALUE = "1";

// Gemini AI Configuration
export const GEMINI_CONFIG = {
  API_KEY: "AIzaSyCWUS_8H5sm3-R0lgYDM84ktkymG-Ea8IU",
  API_BASE_URL: "https://generativelanguage.googleapis.com/v1beta",
  MODEL_CANDIDATES: [
    "gemini-1.5-flash-latest",
    "gemini-1.5-pro-latest",
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-1.0-pro",
    "gemini-pro",
  ] as const,
} as const;

// Firebase Configuration
export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyBspOKNfyhkLFwnwH8H4efqOh6C0BwWYLY",
  authDomain: "assingly-6c446.firebaseapp.com",
  projectId: "assingly-6c446",
  storageBucket: "assingly-6c446.firebasestorage.app",
  messagingSenderId: "1045859512404",
  appId: "1:1045859512404:web:22bb53e5b62957e423bdc1",
  measurementId: "G-J350FZLCER",
} as const;

// Role Labels
export const ROLE_LABELS = {
  TEACHER: "Teacher",
  STUDENT: "Student",
  HOME: "Home",
} as const;

// Role Routes
export const ROLE_ROUTES = {
  TEACHER: "/teacher",
  STUDENT: "/student",
  HOME: "/",
  ADMIN: "/admin",
} as const;

// Role Initials
export const ROLE_INITIALS = {
  TEACHER: "T",
  STUDENT: "S",
} as const;

// Validation Constants
export const VALIDATION = {
  MIN_ADMIN_PASSWORD_LENGTH: 4,
} as const;

// Notice Auto-dismiss Duration (ms)
export const NOTICE_DISMISS_DURATION = 3000;

// Excel Sheet Names
export const EXCEL_SHEETS = {
  TEACHERS: "Teachers",
  STUDENTS: "Students",
} as const;

// Template URLs
export const TEMPLATE_URLS = {
  TEACHERS: "/template/teachers-template.xlsx",
  STUDENTS: "/template/students-template.xlsx",
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  FIREBASE_NOT_CONFIGURED:
    "Firebase not configured: missing REACT_APP_FIREBASE_* env vars",
  GEMINI_API_KEY_MISSING:
    "Gemini API key missing. Add REACT_APP_GEMINI_API_KEY in .env.local",
  MISSING_API_KEY_FOR_LIST_MODELS: "Missing API key for ListModels.",
  INVALID_ADMIN_SECRETE: "Invalid admin secrete",
  ERROR_CHECKING_ADMIN_SECRETE: "Error checking admin secrete",
  ADMIN_PASSWORD_REQUIRED: "Please enter an admin password",
  ADMIN_PASSWORD_TOO_SHORT: "Admin password must be at least 4 characters long",
  ALL_FIELDS_REQUIRED: "Please fill all required fields.",
  DUE_DATE_IN_PAST: "Due date cannot be in the past.",
  NO_CHANGES_DETECTED: "No changes detected.",
  LOGIN_FAILED: "Login failed. Please try again.",
  INVALID_TEACHER_PIN: "Invalid teacher PIN.",
  INVALID_SECRETE: "Invalid Secrete.",
  TEACHER_SECRETE_REQUIRED: "Please enter Secrete.",
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  ADMIN_SETUP_COMPLETE: "Admin setup complete. Please log in.",
  ADMIN_PASSWORD_SAVED: "Admin password saved successfully!",
} as const;

// Gemini Prompt Template Parts
export const GEMINI_PROMPT = {
  INTRO:
    "You are a helpful tutor. Explain this homework clearly for a student.",
  GUIDELINES: "Keep it concise, actionable, and encouraging.",
  INCLUDE: "Include: steps to approach, tips, and materials needed.",
  ASSUMPTIONS:
    "If information is missing, state reasonable assumptions and proceed.",
} as const;
