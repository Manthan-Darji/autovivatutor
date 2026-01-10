import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Bot, User, Copy, Check } from "lucide-react";
import { useState } from "react";
import type { ChatMessage as ChatMessageType } from "@/services/chatService";
import { Button } from "@/components/ui/button";

interface ChatMessageProps {
  message: ChatMessageType;
  isTyping?: boolean;
}

export function ChatMessage({ message, isTyping = false }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const handleCopy = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex gap-4 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
          isUser 
            ? "bg-gradient-to-br from-primary to-accent neon-glow" 
            : "glass neon-border"
        }`}
      >
        {isUser ? (
          <User className="h-5 w-5 text-primary-foreground" />
        ) : (
          <Bot className="h-5 w-5 text-primary" />
        )}
      </motion.div>

      {/* Message Bubble */}
      <motion.div
        initial={{ opacity: 0, x: isUser ? 20 : -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.15 }}
        className={`relative max-w-[80%] rounded-2xl px-5 py-4 ${
          isUser
            ? "bg-gradient-to-br from-primary to-accent text-primary-foreground neon-glow"
            : "glass neon-border"
        } ${isTyping ? "typing-cursor" : ""}`}
      >
        <div className={`prose prose-sm max-w-none ${isUser ? "prose-invert" : "prose-invert"}`}>
          <ReactMarkdown
            components={{
              code({ className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                const codeString = String(children).replace(/\n$/, "");
                
                if (match) {
                  return (
                    <div className="relative my-3 overflow-hidden rounded-xl">
                      {/* Code header */}
                      <div className="flex items-center justify-between bg-secondary/80 px-4 py-2 text-xs">
                        <span className="font-mono text-muted-foreground uppercase tracking-wide">
                          {match[1]}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(codeString)}
                          className="h-6 gap-1 px-2 text-xs hover:bg-primary/20"
                        >
                          {copied ? (
                            <>
                              <Check className="h-3 w-3" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              Copy
                            </>
                          )}
                        </Button>
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
                    className={`rounded-md px-1.5 py-0.5 font-mono text-sm ${
                      isUser ? "bg-primary-foreground/20" : "bg-secondary"
                    }`}
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
              h1: ({ children }) => <h1 className="text-xl font-bold mb-3 mt-4">{children}</h1>,
              h2: ({ children }) => <h2 className="text-lg font-semibold mb-2 mt-3">{children}</h2>,
              h3: ({ children }) => <h3 className="text-base font-semibold mb-2 mt-2">{children}</h3>,
              blockquote: ({ children }) => (
                <blockquote className="border-l-2 border-primary pl-4 italic text-muted-foreground my-3">
                  {children}
                </blockquote>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
        
        {/* Timestamp */}
        <p
          className={`mt-3 text-xs ${
            isUser ? "text-primary-foreground/60" : "text-muted-foreground"
          }`}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </motion.div>
    </motion.div>
  );
}