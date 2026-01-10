import { motion } from "framer-motion";
import { Settings, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatTopBarProps {
  connectionStatus?: string | null;
}

export function ChatTopBar({ connectionStatus }: ChatTopBarProps) {
  return (
    <motion.header initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-strong border-b border-border">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <motion.div whileHover={{ scale: 1.05 }} className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent neon-glow">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </motion.div>
          <div>
            <h1 className="text-lg font-bold"><span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">Viva AI Tutor</span></h1>
            {connectionStatus ? (
              <div className="flex items-center gap-1.5"><motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }} className="h-2 w-2 rounded-full bg-yellow-500" /><span className="text-xs text-yellow-500">{connectionStatus}</span></div>
            ) : (
              <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-green-500" /><span className="text-xs text-muted-foreground">Ready to help</span></div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 rounded-full glass px-3 py-1.5"><Zap className="h-3.5 w-3.5 text-primary" /><span className="text-xs font-medium text-muted-foreground">AI Powered</span></div>
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-secondary"><Settings className="h-5 w-5" /></Button>
        </div>
      </div>
    </motion.header>
  );
}
