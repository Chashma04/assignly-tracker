import type { Role } from "../type";

interface Props {
  role: Role;
  selected: "dashboard" | "form";
  onSelect: (tab: "dashboard" | "form") => void;
}

export default function Navbar({ role, selected, onSelect }: Props) {
  const isTeacher = role === "teacher";

  return (
    <div className="navbar">
      <button
        className={`nav-item ${selected === "dashboard" ? "active" : ""}`}
        onClick={() => onSelect("dashboard")}
      >
        Dashboard
      </button>
      {isTeacher && (
        <button
          className={`nav-item ${selected === "form" ? "active" : ""}`}
          onClick={() => onSelect("form")}
        >
          Post Homework
        </button>
      )}
    </div>
  );
}
