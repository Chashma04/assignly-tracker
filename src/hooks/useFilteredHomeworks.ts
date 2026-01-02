import { useMemo } from "react";
import type { Homework, User } from "../type";

export function useFilteredHomeworks(
  homeworks: Homework[],
  user?: User | null,
) {
  return useMemo(() => {
    if (!user?.assigned || user.assigned.length === 0) {
      return homeworks;
    }

    const assignedLabels = user.assigned.map((a) =>
      a.section ? `${a.grade} ${a.section}` : a.grade,
    );

    return homeworks.filter((h) => assignedLabels.includes(h.className));
  }, [homeworks, user?.assigned]);
}
