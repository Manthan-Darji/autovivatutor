import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Bot } from "lucide-react";

interface TypewriterMessageProps {
  content: string;
}

export function TypewriterMessage({ content }: TypewriterMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex gap-4"
    >
      {/* Avatar */}
      <motion.div
        animate={{ 
          boxShadow: [
            "0 0 20px hsl(239 84% 67% / 0.3)",
            "0 0 35px hsl(239 84% 67% / 0.4)",
            "0 0 20px hsl(239 84% 67% / 0.3)",
          ]
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl glass neon-border"
      >
        <Bot className="h-5 w-5 text-primary" />
      </motion.div>

      {/* Message Bubble */}
      <div className="relative max-w-[80%] rounded-2xl px-5 py-4 glass neon-border">
        <div className="prose prose-sm prose-invert max-w-none">
          <ReactMarkdown
            components={{
              code({ className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                const codeString = String(children).replace(/\n$/, "");
                
                if (match) {
                  return (
                    <div className="relative my-3 overflow-hidden rounded-xl">
                      <div className="flex items-center justify-between bg-secondary/80 px-4 py-2 text-xs">
                        <span className="font-mono text-muted-foreground uppercase tracking-wide">
                          {match[1]}
                        </span>
                      </div>
                      <SyntaxHighlighter
                        style={oneDark}
                        language={match[1]}
                        PreTag="div"
                        customStyle={{
                          margin: 0,
                          borderRadius: "0 0 0.75rem 0.75rem",
                          background: "hsl(222 47% 11%)",
                          fontSize: "0.875rem",
                        }}
                      >
                        {codeString}
                      </SyntaxHighlighter>
                    </div>
                  );
                }
                
                return (
                  <code
                    className="rounded-md px-1.5 py-0.5 font-mono text-sm bg-secondary"
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
              pre: ({ children }) => <>{children}</>,
              p: ({ children }) => <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>,
              ul: ({ children }) => <ul className="mb-3 list-disc pl-5 space-y-1">{children}</ul>,
              ol: ({ children }) => <ol className="mb-3 list-decimal pl-5 space-y-1">{children}</ol>,
              li: ({ children }) => <li className="leading-relaxed">{children}</li>,
            }}
          >
            {content}
          </ReactMarkdown>
          
          {/* Typing cursor */}
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="inline-block ml-1 text-primary"
          >
            ▋
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
}