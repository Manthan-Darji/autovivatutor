import { useState } from "react";
import { motion } from "framer-motion";
import { Gamepad2, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MiniGameModal } from "@/components/games/MiniGameModal";

export function BrainBreakBanner() {
  const [isGameOpen, setIsGameOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 relative overflow-hidden rounded-xl border border-primary/30 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 p-4"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvc3ZnPg==')] opacity-50" />
        
        <div className="relative flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg"
            >
              <Gamepad2 className="h-6 w-6 text-white" />
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">Need a Brain Break?</h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500 text-xs font-medium">
                  <Sparkles className="h-3 w-3" />
                  1 min
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Quick games to refresh your mind and boost focus!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => setIsGameOpen(true)}
              className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90"
            >
              <Gamepad2 className="h-4 w-4" />
              Play Now
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsDismissed(true)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      <MiniGameModal
        isOpen={isGameOpen}
        onClose={() => setIsGameOpen(false)}
        onComplete={(score) => {
          console.log("Game completed with score:", score);
        }}
      />
    </>
  );
}
