import { useState, useEffect } from 'react';

export function useAdminAuth() {
  const [adminAuthed, setAdminAuthed] = useState(false);

  useEffect(() => {
    try {
      setAdminAuthed(localStorage.getItem("assignly_admin_authed") === "1");
    } catch {}
    const onStorage = (e: StorageEvent) => {
      if (e.key === "assignly_admin_authed") setAdminAuthed(e.newValue === "1");
    };
    const onCustom = (e: Event) => {
      const ev = e as CustomEvent;
      if (ev && ev.detail && typeof ev.detail.authed === "boolean") {
        setAdminAuthed(!!ev.detail.authed);
      }
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("assignly:admin-auth", onCustom as EventListener);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("assignly:admin-auth", onCustom as EventListener);
    };
  }, []);

  return { adminAuthed, setAdminAuthed };
}