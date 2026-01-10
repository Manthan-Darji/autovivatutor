import { motion } from "framer-motion";
import { GraduationCap, BookOpen, Code, Calculator, Lightbulb } from "lucide-react";

interface ChatWelcomeProps {
  onSuggestionClick: (message: string) => void;
}

const suggestions = [
  {
    icon: BookOpen,
    text: "Explain a concept",
    prompt: "Can you explain the concept of machine learning in simple terms?",
  },
  {
    icon: Code,
    text: "Help with code",
    prompt: "Can you help me write a Python function to sort a list?",
  },
  {
    icon: Calculator,
    text: "Solve a problem",
    prompt: "Help me solve this math problem: What is the derivative of x^3 + 2x?",
  },
  {
    icon: Lightbulb,
    text: "Study tips",
    prompt: "What are some effective study techniques for memorizing information?",
  },
];

export function ChatWelcome({ onSuggestionClick }: ChatWelcomeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-12"
    >
      {/* Logo */}
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg">
        <GraduationCap className="h-8 w-8 text-primary-foreground" />
      </div>

      {/* Title */}
      <h2 className="mb-2 text-2xl font-bold text-foreground">
        Welcome to Viva AI Tutor
      </h2>
      <p className="mb-8 max-w-md text-center text-muted-foreground">
        Your personal AI learning assistant. Ask me anything about math, science,
        coding, or any subject you're studying.
      </p>

      {/* Suggestion Cards */}
      <div className="grid w-full max-w-xl grid-cols-2 gap-3">
        {suggestions.map((suggestion, index) => {
          const Icon = suggestion.icon;
          return (
            <motion.button
              key={suggestion.text}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
              onClick={() => onSuggestionClick(suggestion.prompt)}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-left shadow-sm transition-all hover:border-primary hover:shadow-md"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground">
                {suggestion.text}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
