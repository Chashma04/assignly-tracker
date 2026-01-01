import type { Homework } from "../type";
import "../styles/Table.css";

interface Props {
  homeworks: Homework[];
  showDescriptionTooltip?: boolean;
  onEdit?: (hw: Homework) => void;
}
export default function HomeworkTable({ homeworks, showDescriptionTooltip = false, onEdit }: Props) {
  return (
    <div className="card">
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Sl. No</th>
              <th>Subject</th>
              <th>Description</th>
              <th>Teacher</th>
              <th>Due Date</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {homeworks.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: 12 }}>
                  No homework
                </td>
              </tr>
            )}
            {homeworks.map((hw, idx) => {
              const descTitle = showDescriptionTooltip && hw.description ? hw.description : undefined;
              return (
                <tr key={hw.id}>
                  <td>{idx + 1}</td>
                  <td>{hw.subject}</td>
                  <td title={descTitle}>
                    <div
                      style={{
                        maxWidth: 320,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {hw.description || "-"}
                    </div>
                  </td>
                  <td>{hw.teacher || "-"}</td>
                  <td>{hw.date}</td>
                  <td>
                    <button
                      onClick={() => onEdit?.(hw)}
                      style={{ padding: "4px 8px" }}
                      title="Edit"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export {};
