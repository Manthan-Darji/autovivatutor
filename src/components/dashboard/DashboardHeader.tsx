import { Plus, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface DashboardHeaderProps {
  streak?: number;
}

export function DashboardHeader({ streak = 3 }: DashboardHeaderProps) {
  const navigate = useNavigate();

  const handleExit = () => {
    toast.success("Goodbye! See you next time 👋");
    // In a real app, this would redirect to a landing page or login
    window.location.href = "about:blank";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
    >
      <div>
        {/* Badge */}
        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          <span className="text-base">🎓</span>
          STUDENT DASHBOARD
        </div>

        {/* Welcome */}
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
          Welcome back, Scholar!
        </h1>
        <p className="mt-1 text-muted-foreground">
          You're on a{" "}
          <span className="font-semibold text-primary">{streak} day streak</span>.
          {" "}Keep it up!
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <Button 
          variant="outline" 
          onClick={handleExit}
          className="gap-2 group"
        >
          <LogOut className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          Exit
        </Button>
        <Button className="gap-2 shadow-md" onClick={() => navigate("/create")}>
          <Plus className="h-4 w-4" />
          New Course
        </Button>
      </div>
    </motion.div>
  );
}
