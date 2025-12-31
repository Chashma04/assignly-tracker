export interface AssignedItem {
  grade: string; // e.g., "Grade 4"
  section?: string; // e.g., "A"
}

export interface TeacherRecord {
  id: string;
  name: string;
  pin: string;
  assigned: AssignedItem[];
}

export const TEACHERS: Record<string, TeacherRecord> = {
  // Example teachers; adjust as needed
  T001: {
    id: "T001",
    name: "Mrs. Sharma",
    pin: "1234",
    assigned: [
      { grade: "Grade 4", section: "A" },
      { grade: "Grade 4", section: "B" },
    ],
  },
  T002: {
    id: "T002",
    name: "Mr. Singh",
    pin: "2345",
    assigned: [{ grade: "Grade 4", section: "C" }, { grade: "Grade 5" }],
  },
  T003: {
    id: "T003",
    name: "Ms. Rao",
    pin: "3456",
    assigned: [{ grade: "Grade 5", section: "A" }],
  },
};

export function findTeacher(id: string): TeacherRecord | undefined {
  return TEACHERS[id];
}
