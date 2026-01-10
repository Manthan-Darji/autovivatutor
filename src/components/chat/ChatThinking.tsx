import { motion } from "framer-motion";
import { Bot, Brain } from "lucide-react";

export function ChatThinking() {
  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex gap-4">
      <motion.div animate={{ boxShadow: ["0 0 20px hsl(239 84% 67% / 0.3)", "0 0 40px hsl(239 84% 67% / 0.5)", "0 0 20px hsl(239 84% 67% / 0.3)"] }} transition={{ duration: 2, repeat: Infinity }} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl glass neon-border">
        <Bot className="h-5 w-5 text-primary" />
      </motion.div>
      <motion.div animate={{ boxShadow: ["0 0 15px hsl(239 84% 67% / 0.2)", "0 0 30px hsl(270 91% 65% / 0.3)", "0 0 15px hsl(239 84% 67% / 0.2)"] }} transition={{ duration: 2, repeat: Infinity }} className="glass neon-border rounded-2xl px-5 py-4">
        <div className="flex items-center gap-3">
          <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}><Brain className="h-5 w-5 text-primary" /></motion.div>
          <span className="text-sm font-medium text-muted-foreground">Thinking</span>
          <div className="flex gap-1">{[0, 1, 2].map((i) => (<motion.span key={i} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }} className="h-2 w-2 rounded-full bg-primary" />))}</div>
        </div>
        <div className="mt-4 space-y-2">
          <motion.div animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }} className="h-3 w-full rounded-full bg-gradient-to-r from-secondary via-primary/20 to-secondary" />
          <motion.div animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }} className="h-3 w-4/5 rounded-full bg-secondary" />
        </div>
      </motion.div>
    </motion.div>
  );
}
