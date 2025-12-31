import { db } from "./firebase";
import {
  collection,
  doc,
  setDoc,
  writeBatch,
  getDocs,
  query,
  orderBy,
  where,
  limit,
  getDoc,
} from "firebase/firestore";
import type { Homework } from "../type";
import type { StudentRecord, TeacherRecord } from "./roster";

function stripUndefined<T extends Record<string, any>>(obj: T): T {
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined) out[k] = v;
  }
  return out as T;
}

export async function saveTeachersToFirestore(list: TeacherRecord[]) {
  const batch = writeBatch(db);
  const col = collection(db, "teachers");
  list.forEach((t) => {
    const ref = doc(col, t.id);
    batch.set(ref, stripUndefined(t));
  });
  await batch.commit();
}

export async function getTeachersFromFirestore() {
  const col = collection(db, "teachers");
  const q = query(col, orderBy("id", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as TeacherRecord);
}

export async function getTeacherById(id: string): Promise<TeacherRecord | null> {
  const col = collection(db, "teachers");
  const ref = doc(col, id);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as TeacherRecord) : null;
}

export async function getTeacherBySecrete(pin: string, secrete: string): Promise<TeacherRecord | null> {
  const col = collection(db, "teachers");
  const q = query(
    col,
    where("secrete", "==", secrete),
    where("pin", "==", pin),
    limit(1)
  );
  const snap = await getDocs(q);
  const docSnap = snap.docs[0];
  return docSnap ? (docSnap.data() as TeacherRecord) : null;
}

export async function saveStudentsToFirestore(list: StudentRecord[]) {
  const batch = writeBatch(db);
  const col = collection(db, "students");
  list.forEach((s) => {
    const ref = doc(col, s.rollNumber);
    batch.set(ref, stripUndefined(s));
  });
  await batch.commit();
}

export async function getStudentsFromFirestore() {
  const col = collection(db, "students");
  const q = query(col, orderBy("rollNumber", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as StudentRecord);
}

export async function getStudentByRoll(rollNumber: string): Promise<StudentRecord | null> {
  const col = collection(db, "students");
  const ref = doc(col, rollNumber);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as StudentRecord) : null;
}

export async function getStudentByRollAndDob(
  rollNumber: string,
  dob: string
): Promise<StudentRecord | null> {
  const col = collection(db, "students");
  const q = query(
    col,
    where("rollNumber", "==", rollNumber),
    where("dob", "==", dob),
    limit(1)
  );
  const snap = await getDocs(q);
  const docSnap = snap.docs[0];
  return docSnap ? (docSnap.data() as StudentRecord) : null;
}

export async function addHomework(hw: Homework) {
  const col = collection(db, "homeworks");
  const ref = doc(col, hw.id);
  await setDoc(ref, stripUndefined(hw));
}

export async function updateHomework(hw: Homework) {
  const col = collection(db, "homeworks");
  const ref = doc(col, hw.id);
  await setDoc(ref, stripUndefined(hw), { merge: true });
}

export async function fetchHomeworks(): Promise<Homework[]> {
  const col = collection(db, "homeworks");
  const q = query(col, orderBy("date", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Homework);
}
