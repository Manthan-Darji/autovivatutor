import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Clock,
  Sparkles,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ExitConfirmDialog } from "@/components/shared/ExitConfirmDialog";

interface ChatSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onNewChat: () => void;
}

// Mock history data for demo
const mockHistory = [
  { id: "1", title: "Quantum Physics Explained", time: "2 min ago" },
  { id: "2", title: "Python Debugging Help", time: "1 hour ago" },
  { id: "3", title: "Machine Learning Basics", time: "Yesterday" },
  { id: "4", title: "Essay Writing Tips", time: "Yesterday" },
  { id: "5", title: "Calculus Integration", time: "2 days ago" },
];

export function ChatSidebar({ isOpen, onToggle, onNewChat }: ChatSidebarProps) {
  const navigate = useNavigate();
  const [showExitDialog, setShowExitDialog] = useState(false);

  const handleExit = () => {
    setShowExitDialog(true);
  };

  const confirmExit = () => {
    navigate("/");
  };

  return (
    <>
      {/* Toggle button when closed */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="fixed left-4 top-4 z-50 flex flex-col gap-2"
          >
            <Button
              variant="outline"
              size="icon"
              onClick={onToggle}
              className="glass neon-border hover-glow h-10 w-10 rounded-xl"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleExit}
              className="glass neon-border hover-glow h-10 w-10 rounded-xl hover:bg-destructive/20 hover:text-destructive hover:border-destructive/50"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -280, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -280, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 z-40 h-screen w-[280px] glass-strong border-r border-border flex flex-col"
          >
            {/* Header */}
            <div className="flex h-16 items-center justify-between border-b border-border px-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary neon-glow">
                  <Sparkles className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-semibold text-foreground">History</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggle}
                className="h-8 w-8 rounded-lg hover:bg-secondary"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>

            {/* New Chat Button */}
            <div className="p-4">
              <Button
                onClick={onNewChat}
                className="w-full gap-2 rounded-xl neon-glow hover:neon-glow-strong transition-all"
              >
                <Plus className="h-4 w-4" />
                New Chat
              </Button>
            </div>

            {/* History List */}
            <div className="flex-1 overflow-y-auto px-3 pb-4">
              <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Recent Chats
              </p>
              <div className="space-y-1">
                {mockHistory.map((chat, index) => (
                  <motion.button
                    key={chat.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group flex w-full items-start gap-3 rounded-xl p-3 text-left transition-all hover:bg-secondary/50 hover-glow"
                  >
                    <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary" />
                    <div className="flex-1 overflow-hidden">
                      <p className="truncate text-sm font-medium text-foreground">
                        {chat.title}
                      </p>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {chat.time}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Footer with Exit Button */}
            <div className="border-t border-border p-4 space-y-3">
              <Button
                variant="outline"
                onClick={handleExit}
                className="w-full gap-2 rounded-xl hover:bg-destructive/20 hover:text-destructive hover:border-destructive/50 group"
              >
                <LogOut className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                Exit to Dashboard
              </Button>
              <div className="glass rounded-xl p-3 text-center">
                <p className="text-xs text-muted-foreground">
                  Powered by <span className="font-semibold text-primary neon-text">Viva AI</span>
                </p>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <ExitConfirmDialog
        open={showExitDialog}
        onOpenChange={setShowExitDialog}
        onConfirm={confirmExit}
        title="Leave the chat?"
        description="You'll return to the dashboard. Your conversation will be saved for later."
      />
    </>
  );
}