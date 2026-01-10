import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  disabled = false,
  placeholder = "Ask me anything...",
}: ChatInputProps) {
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        150
      )}px`;
    }
  }, [input]);

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (trimmed && !disabled) {
      onSend(trimmed);
      setInput("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-strong border-t border-border p-4"
    >
      <div className="mx-auto max-w-3xl">
        <motion.div
          animate={{
            boxShadow: isFocused
              ? "0 0 30px hsl(239 84% 67% / 0.3), 0 0 60px hsl(270 91% 65% / 0.2)"
              : "0 0 15px hsl(239 84% 67% / 0.1)",
          }}
          transition={{ duration: 0.3 }}
          className="relative flex items-end gap-3 rounded-2xl glass neon-border p-2"
        >
          {/* Sparkle decoration */}
          <div className="absolute -top-1 -left-1">
            <Sparkles className="h-4 w-4 text-primary/50" />
          </div>

          <div className="relative flex-1">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              disabled={disabled}
              rows={1}
              className="min-h-[48px] resize-none border-0 bg-transparent pr-4 text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={handleSubmit}
              disabled={disabled || !input.trim()}
              size="icon"
              className="h-11 w-11 shrink-0 rounded-xl bg-gradient-to-br from-primary to-accent neon-glow hover:neon-glow-strong transition-all disabled:opacity-50"
            >
              <Send className="h-5 w-5" />
              <span className="sr-only">Send message</span>
            </Button>
          </motion.div>
        </motion.div>
        
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Press <kbd className="rounded bg-secondary px-1.5 py-0.5 font-mono text-xs">Enter</kbd> to send, <kbd className="rounded bg-secondary px-1.5 py-0.5 font-mono text-xs">Shift+Enter</kbd> for new line
        </p>
      </div>
    </motion.div>
  );
}