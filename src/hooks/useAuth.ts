import { useState, useEffect } from "react";
import type { User } from "../type";
import { STORAGE_KEYS } from "../config/constants";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
      if (savedUser) {
        const u = JSON.parse(savedUser);
        // Migrate old 'parent' role to 'student'
        if (u && u.role === "parent") u.role = "student";
        setUser(u);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      if (user) localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      else localStorage.removeItem(STORAGE_KEYS.USER);
    } catch {}
  }, [user]);

  return { user, setUser };
}
