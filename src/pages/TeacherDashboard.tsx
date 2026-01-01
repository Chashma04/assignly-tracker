import type { Homework } from "../type";
import HomeworkTable from "./HomeworkTable";
import "../styles/Homework.css";

import type { User } from "../type";

interface Props {
  homeworks: Homework[];
  user?: User | null;
  onEdit?: (hw: Homework) => void;
}

export default function TeacherDashboard({
  homeworks,
  user,
  onEdit,
}: Props) {
  const assignedLabels = (user?.assigned || []).map((a) =>
    a.section ? `${a.grade} ${a.section}` : a.grade
  );
  const filtered = assignedLabels.length
    ? homeworks.filter((h) => assignedLabels.includes(h.className))
    : homeworks;
  return (
    <div className="container max-w-xl mx-auto">
        <h2 className="dashboard-header">Teacher Dashboard</h2>
        {assignedLabels.length > 0 && (
          <p className="muted" style={{ textAlign: "center" }}>
            Assigned: {assignedLabels.join(", ")}
          </p>
        )}
        <HomeworkTable homeworks={filtered} showDescriptionTooltip={true} onEdit={onEdit} />
      </div>
  );
}
