import { useState, useEffect } from 'react';
import type { User } from '../type';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("assignly_user");
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
      if (user) localStorage.setItem("assignly_user", JSON.stringify(user));
      else localStorage.removeItem("assignly_user");
    } catch {}
  }, [user]);

  return { user, setUser };
}