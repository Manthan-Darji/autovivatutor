import { motion } from "framer-motion";
import { Bot } from "lucide-react";

export function ChatThinking() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="py-6 bg-secondary/30"
    >
      <div className="mx-auto max-w-3xl px-4">
        <div className="flex gap-4">
          {/* Avatar */}
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600">
            <Bot className="h-4 w-4 text-white" />
          </div>

          {/* Content */}
          <div className="flex-1 space-y-2">
            <p className="text-sm font-semibold text-foreground">Viva AI</p>
            
            {/* Thinking animation */}
            <div className="flex items-center gap-1">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  className="h-2 w-2 rounded-full bg-muted-foreground"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
