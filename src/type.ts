export interface Homework {
  id: string;
  className: string;
  subject: string;
  description: string;
  date: string;
  status: "pending" | "completed";
  notes?: string;
  teacher?: string;
}

export type Role = "teacher" | "student";

export interface User {
  role: Role;
  name?: string; // optional for student
  rollNumber?: string; // student identifier
  dob?: string; // ISO date string (YYYY-MM-DD)
  // Teacher-specific
  teacherId?: string;
  assigned?: Array<{ grade: string; section?: string }>;
}
