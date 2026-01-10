import { Plus } from "lucide-react";
import { motion } from "framer-motion";

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

      {/* Empty State Card */}
      <div className="flex min-h-[180px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-card p-8 transition-colors hover:border-primary/50">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/40 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          <Plus className="h-6 w-6" />
        </motion.button>
        <h4 className="mb-1 text-lg font-semibold text-foreground">
          Start your first course
        </h4>
        <p className="text-center text-sm text-muted-foreground">
          Generate a custom curriculum in seconds with AI.
        </p>
      </div>
    </motion.div>
  );
}
