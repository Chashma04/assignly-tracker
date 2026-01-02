import { useState, useEffect } from "react";
import {
  STORAGE_KEYS,
  CUSTOM_EVENTS,
  ADMIN_AUTH_VALUE,
} from "../config/constants";

export function useAdminAuth() {
  const [adminAuthed, setAdminAuthed] = useState(false);

  useEffect(() => {
    try {
      setAdminAuthed(
        localStorage.getItem(STORAGE_KEYS.ADMIN_AUTHED) === ADMIN_AUTH_VALUE,
      );
    } catch {}
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.ADMIN_AUTHED)
        setAdminAuthed(e.newValue === ADMIN_AUTH_VALUE);
    };
    const onCustom = (e: Event) => {
      const ev = e as CustomEvent;
      if (ev && ev.detail && typeof ev.detail.authed === "boolean") {
        setAdminAuthed(!!ev.detail.authed);
      }
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener(
      CUSTOM_EVENTS.ADMIN_AUTH,
      onCustom as EventListener,
    );
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(
        CUSTOM_EVENTS.ADMIN_AUTH,
        onCustom as EventListener,
      );
    };
  }, []);

  const logout = () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTHED);
    } catch {}
    try {
      window.dispatchEvent(
        new CustomEvent(CUSTOM_EVENTS.ADMIN_AUTH, {
          detail: { authed: false },
        }),
      );
    } catch {}
  };

  return { adminAuthed, setAdminAuthed, logout };
}
