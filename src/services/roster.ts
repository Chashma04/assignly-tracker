import * as XLSX from "xlsx";
import { saveTeachersToFirestore, saveStudentsToFirestore } from "./db";

export interface AssignedItem {
  grade: string;
  section?: string;
}
export interface TeacherRecord {
  id: string;
  name: string;
  pin: string;
  grade?: string;
  sections?: string[];
  secrete?: string;
}
export interface StudentRecord {
  rollNumber: string;
  name?: string;
  dob?: string; // YYYY-MM-DD
  className?: string; // e.g., "Grade 4"
  section?: string; // e.g., "A"
}

// Local storage cache removed; data flows via Firestore and component/state layers.

export function saveTeacherRoster(teachers: TeacherRecord[]) {
  console.log("Saving teacher roster to Firestore...", teachers);
  try {
    void saveTeachersToFirestore(teachers);
  } catch {}
}
// Removed local cache loader; fetch via Firestore helpers in db.ts
export function saveStudentRoster(students: StudentRecord[]) {
  // Persist to Firestore (best-effort)
  try {
    void saveStudentsToFirestore(students);
  } catch {}
}
// Removed local cache loader; fetch via Firestore helpers in db.ts

export async function parseTeachersExcel(file: File): Promise<TeacherRecord[]> {
  const data = await file.arrayBuffer();
  const wb = XLSX.read(data, { type: "array" });
  const sheet =
    wb.Sheets["Teachers"] ||
    wb.Sheets[wb.SheetNames.find((n) => /teachers/i.test(n)) || ""];
  if (!sheet) return [];
  const rows = XLSX.utils.sheet_to_json<any>(sheet, { defval: "" });

  const getVal = (row: any, keys: string[]): string => {
    // Case-insensitive, space-insensitive key lookup
    const normalized: Record<string, any> = {};
    Object.keys(row).forEach((k) => {
      const nk = String(k).toLowerCase().replace(/\s+/g, "");
      normalized[nk] = row[k];
    });
    for (const key of keys) {
      const nk = key.toLowerCase().replace(/\s+/g, "");
      if (normalized.hasOwnProperty(nk))
        return String(normalized[nk] ?? "").trim();
    }
    return "";
  };

  const out: TeacherRecord[] = [];
  for (const r of rows) {
    const id = getVal(r, ["ID", "Id", "id", "Teacher ID", "teacher id"]).trim();
    const name = getVal(r, ["Name", "name"]).trim();
    const pin = getVal(r, ["PIN", "Pin", "pin"]).trim();
    const classRaw = getVal(r, ["Class", "Classes", "class", "classes"]).trim();
    const sectionRaw = getVal(r, [
      "Section",
      "Sections",
      "section",
      "sections",
      "Sec",
      "Sec.",
      "Section Name",
      "SectionName",
      "Class Section",
      "ClassSection",
    ]).trim();
    const secreteRaw = getVal(r, [
      "Assigned ID",
      "assigned id",
      "assigned_id",
      "assignedId",
      "AssignedID",
      "secret",
      "secretId",
    ]).trim();

    if (!id || !pin) continue;

    let grade: string | undefined = classRaw || undefined;

    let sections: string[] = sectionRaw
      ? sectionRaw
          .split(/[,;]+/)
          .map((s: string) => s.trim())
          .filter(Boolean)
      : [];

    // Keep parsing minimal: rely on Class and Section columns only

    out.push({
      id,
      name: name || id,
      pin,
      grade,
      sections: sections.length ? sections : undefined,
      secrete: secreteRaw || undefined,
    });
  }
  return out;
}

export async function parseStudentsExcel(file: File): Promise<StudentRecord[]> {
  const data = await file.arrayBuffer();
  const wb = XLSX.read(data, { type: "array", cellDates: true });
  const sheet =
    wb.Sheets["Students"] ||
    wb.Sheets[wb.SheetNames.find((n) => /students/i.test(n)) || ""];
  if (!sheet) return [];
  const rows = XLSX.utils.sheet_to_json<any>(sheet, { defval: "" });
  const out: StudentRecord[] = [];

  // Local helper mirroring teachers' getVal for resilient header matching
  const getVal = (row: any, keys: string[]): string => {
    const normalized: Record<string, any> = {};
    Object.keys(row).forEach((k) => {
      const nk = String(k).toLowerCase().replace(/\s+/g, "");
      normalized[nk] = row[k];
    });
    for (const key of keys) {
      const nk = key.toLowerCase().replace(/\s+/g, "");
      if (normalized.hasOwnProperty(nk))
        return String(normalized[nk] ?? "").trim();
    }
    return "";
  };

  function formatDateOnly(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate() + 1).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  for (const r of rows) {
    const rollNumber = getVal(r, [
      "Roll",
      "Roll No",
      "RollNo",
      "Roll Number",
      "RollNumber",
      "Student ID",
      "StudentId",
      "ID",
      "Id",
    ]).trim();
    if (!rollNumber) continue;
    const name =
      getVal(r, ["Name", "Student Name", "Full Name", "name"]).trim() ||
      undefined;
    const dobRaw = getVal(r, [
      "DOB",
      "Date of Birth",
      "DateOfBirth",
      "Birthdate",
      "DoB",
      "dob",
      "DOB (YYYY-MM-DD)",
    ]).trim();

    if (!dobRaw) continue;

    const dob = formatDateOnly(new Date(dobRaw));

    const classRaw = getVal(r, [
      "Class",
      "Class Name",
      "Grade",
      "class",
      "grade",
    ]).trim();
    const sectionRaw = getVal(r, [
      "Section",
      "Sections",
      "section",
      "sections",
      "Sec",
      "Sec.",
      "Section Name",
      "SectionName",
      "Class Section",
      "ClassSection",
    ]).trim();

    if (!classRaw || !sectionRaw) continue;
    let className: string | undefined = classRaw || undefined;
    let section: string | undefined = undefined;

    if (sectionRaw) {
      const token = sectionRaw.split(/[ ,;|/]+/).filter(Boolean)[0];
      if (token) section = token;
    }
    if (!section && classRaw) {
      const m = /^(.*?)(?:\s+([A-Za-z]))?$/.exec(classRaw);
      const base = (m?.[1] || classRaw).trim();
      const sec = (m?.[2] || "").trim();
      className = base || undefined;
      section = sec || section || undefined;
    }

    out.push({ rollNumber, name, dob, className, section });
  }
  console.log("Parsed students:", out);
  return out;
}
