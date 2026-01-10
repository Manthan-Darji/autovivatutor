import { motion } from "framer-motion";
import { Sparkles, Atom, Bug, Feather, FileText } from "lucide-react";

interface ChatWelcomeProps {
  onSuggestionClick: (message: string) => void;
}

const suggestions = [
  {
    icon: Atom,
    emoji: "⚛️",
    text: "Explain Quantum Physics",
    prompt: "Explain quantum physics in simple terms. What makes it different from classical physics?",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    icon: Bug,
    emoji: "🐍",
    text: "Debug my Python code",
    prompt: "Can you help me debug this Python code? I'm getting an error that I don't understand.",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: Feather,
    emoji: "🤖",
    text: "Write a haiku about AI",
    prompt: "Write a creative haiku about artificial intelligence and its impact on humanity.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: FileText,
    emoji: "📄",
    text: "Summarize this article",
    prompt: "Help me summarize a long article. What are the key points I should focus on?",
    gradient: "from-orange-500 to-red-500",
  },
];

export function ChatWelcome({ onSuggestionClick }: ChatWelcomeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center justify-center py-16"
    >
      {/* Animated Logo */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="relative mb-8"
      >
        <div className="absolute inset-0 animate-pulse blur-2xl rounded-full bg-primary/30" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent neon-glow-strong">
          <Sparkles className="h-10 w-10 text-primary-foreground animate-float" />
        </div>
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-3 text-4xl font-bold tracking-tight"
      >
        <span className="bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
          Welcome to Viva AI
        </span>
      </motion.h1>
      
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-12 max-w-md text-center text-lg text-muted-foreground"
      >
        Your intelligent learning companion. Ask me anything about science,
        coding, writing, or any topic you're curious about.
      </motion.p>

      {/* Starter Chips */}
      <div className="grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
        {suggestions.map((suggestion, index) => {
          const Icon = suggestion.icon;
          return (
            <motion.button
              key={suggestion.text}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: 0.5 + index * 0.1,
                type: "spring",
                stiffness: 200,
              }}
              whileHover={{ 
                scale: 1.02,
                y: -2,
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSuggestionClick(suggestion.prompt)}
              className="group relative overflow-hidden rounded-2xl glass neon-border hover-glow p-5 text-left transition-all duration-300"
            >
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${suggestion.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-10`} />
              
              <div className="relative flex items-center gap-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${suggestion.gradient} shadow-lg`}>
                  <span className="text-2xl">{suggestion.emoji}</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {suggestion.text}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                    Click to ask this question
                  </p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}