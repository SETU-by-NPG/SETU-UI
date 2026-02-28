import { useOutletContext } from "react-router";
import { DataTable } from "../components/data-table";
import { grades, type GradeEntry, type Role } from "../data/mock-data";

export default function GradebookPage() {
  const { role } = useOutletContext<{ role: Role }>();

  const columns = [
    {
      key: "student",
      label: "Student",
      render: (g: GradeEntry) => <span style={{ fontWeight: 500 }}>{g.studentName}</span>,
    },
    { key: "assignment", label: "Assignment", render: (g: GradeEntry) => <span>{g.assignment}</span> },
    {
      key: "score",
      label: "Score",
      render: (g: GradeEntry) => (
        <span>{g.score}/{g.maxScore}</span>
      ),
    },
    {
      key: "grade",
      label: "Grade",
      render: (g: GradeEntry) => (
        <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200" style={{ fontSize: "0.75rem", fontWeight: 500 }}>
          {g.grade}
        </span>
      ),
    },
    { key: "date", label: "Date", render: (g: GradeEntry) => <span className="text-muted-foreground">{g.date}</span> },
  ];

  const displayGrades = role === "student"
    ? grades.filter((g) => g.studentId === "s1")
    : role === "parent"
    ? grades.filter((g) => g.studentId === "s1")
    : grades;

  return (
    <div>
      <div className="mb-6">
        <h1>{role === "student" || role === "parent" ? "Grades" : "Gradebook"}</h1>
        <p className="text-muted-foreground" style={{ fontSize: "0.875rem" }}>
          {role === "student"
            ? "View your grades and academic performance."
            : role === "parent"
            ? "Alice's grades and academic performance."
            : "Manage and review student grades across all classes."}
        </p>
      </div>

      {(role === "student" || role === "parent") && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-card border border-border rounded-xl p-5 text-center">
            <p className="text-muted-foreground" style={{ fontSize: "0.875rem" }}>Current GPA</p>
            <p className="mt-1" style={{ fontSize: "2rem", fontWeight: 600 }}>3.8</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-5 text-center">
            <p className="text-muted-foreground" style={{ fontSize: "0.875rem" }}>Highest Grade</p>
            <p className="mt-1" style={{ fontSize: "2rem", fontWeight: 600 }}>A+</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-5 text-center">
            <p className="text-muted-foreground" style={{ fontSize: "0.875rem" }}>Assignments Graded</p>
            <p className="mt-1" style={{ fontSize: "2rem", fontWeight: 600 }}>{displayGrades.length}</p>
          </div>
        </div>
      )}

      <DataTable
        data={displayGrades}
        columns={columns}
        searchKey={(g) => `${g.studentName} ${g.assignment}`}
        searchPlaceholder="Search grades..."
      />
    </div>
  );
}
