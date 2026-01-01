import type { Homework } from "../type";
import HomeworkCard from "./HomeworkCard";
import HomeworkTable from "./HomeworkTable";
import "../styles/Homework.css";

interface Props {
  homeworks: Homework[];
  setHomeworks: React.Dispatch<React.SetStateAction<Homework[]>>;
}

export default function StudentDashboard({ homeworks, setHomeworks }: Props) {
  const updateHomework = (id: string, patch: Partial<Homework>) => {
    setHomeworks((prev) =>
      prev.map((h) => (h.id === id ? { ...h, ...patch } : h))
    );
  };

  return (
    <div className="container max-w-xl mx-auto">
      {/* <div className="student-container"> */}

      <h2>Student Dashboard</h2>

      <HomeworkTable homeworks={homeworks} />

      {homeworks.length === 0 && <p>No homework available</p>}

      {homeworks.map((hw) => (
        <HomeworkCard key={hw.id} hw={hw} />
      ))}
      {/* </div> */}
    </div>
  );
}
export {};
