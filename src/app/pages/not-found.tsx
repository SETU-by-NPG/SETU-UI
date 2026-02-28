import { useNavigate } from "react-router";
import { AlertCircle } from "lucide-react";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-muted-foreground" />
      </div>
      <h1 className="mb-2">Page Not Found</h1>
      <p className="text-muted-foreground mb-6" style={{ fontSize: "0.875rem" }}>The page you're looking for doesn't exist or has been moved.</p>
      <button
        onClick={() => navigate("/")}
        className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90"
        style={{ fontSize: "0.875rem" }}
      >
        Back to Dashboard
      </button>
    </div>
  );
}
