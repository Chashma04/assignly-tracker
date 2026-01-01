import type { Role } from "../type";
import "../components/Sidenav.css";

interface Props {
  role: Role;
  selected: "dashboard" | "form";
  onSelect: (tab: "dashboard" | "form") => void;
}

export default function Sidenav({ role, selected, onSelect }: Props) {
  const isTeacher = role === "teacher";

  return (
    <div className="sidenav">
      <button
        className={`side-item ${selected === "dashboard" ? "active" : ""}`}
        onClick={() => onSelect("dashboard")}
        title="Dashboard"
      >
        Dashboard
      </button>
      {isTeacher && (
        <button
          className={`side-item ${selected === "form" ? "active" : ""}`}
          onClick={() => onSelect("form")}
          title="Post Homework"
        >
          Post Homework
        </button>
      )}
    </div>
  );
}

export {};
