import { useState, useEffect } from "react";
import { STORAGE_KEYS } from "../config/constants";

export function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
      if (savedTheme === "dark" || savedTheme === "light") setTheme(savedTheme);
    } catch {}
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch {}
  }, [theme]);

  return { theme, setTheme };
}
