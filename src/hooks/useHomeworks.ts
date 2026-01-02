import { useState, useEffect } from "react";
import type { Homework } from "../type";
import { fetchHomeworks } from "../services/db";

export function useHomeworks() {
  const [homeworks, setHomeworks] = useState<Homework[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const fromDb = await fetchHomeworks();
        if (Array.isArray(fromDb) && fromDb.length > 0) {
          setHomeworks(fromDb);
        }
      } catch (e) {
        console.warn("Failed to fetch homeworks from Firestore", e);
      }
    })();
  }, []);

  return { homeworks, setHomeworks };
}
