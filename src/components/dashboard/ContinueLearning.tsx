import { Plus, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export function ContinueLearning() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.6 }}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-foreground">Continue Learning</h3>
        <button className="text-sm font-medium text-primary hover:underline">
          View All
        </button>
      </div>

      {/* Start Learning Card - Links to Chat */}
      <Link to="/chat" className="block">
        <div className="flex min-h-[180px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-card p-8 transition-all hover:border-primary hover:shadow-md">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border-2 border-primary/30 bg-primary/10 text-primary"
          >
            <MessageCircle className="h-6 w-6" />
          </motion.div>
          <h4 className="mb-1 text-lg font-semibold text-foreground">
            Chat with AI Tutor
          </h4>
          <p className="text-center text-sm text-muted-foreground">
            Start a conversation and learn anything you want.
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
