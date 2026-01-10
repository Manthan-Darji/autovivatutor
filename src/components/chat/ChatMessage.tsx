import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Bot, Copy, Check, ThumbsUp, ThumbsDown } from "lucide-react";
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

  const handleCopyMessage = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`group py-6 ${isUser ? "bg-transparent" : "bg-secondary/30"}`}
    >
      <div className="mx-auto max-w-3xl px-4">
        <div className="flex gap-4">
          {/* Avatar */}
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
              isUser
                ? "bg-gradient-to-br from-primary to-accent"
                : "bg-emerald-600"
            }`}
          >
            {isUser ? (
              <span className="text-sm font-medium text-primary-foreground">U</span>
            ) : (
              <Bot className="h-4 w-4 text-white" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 space-y-2 overflow-hidden">
            {/* Role label */}
            <p className="text-sm font-semibold text-foreground">
              {isUser ? "You" : "Viva AI"}
            </p>

            {/* Message content */}
            <div className={`prose prose-sm max-w-none prose-invert ${isTyping ? "typing-cursor" : ""}`}>
              <ReactMarkdown
                components={{
                  code({ className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    const codeString = String(children).replace(/\n$/, "");

                    if (match) {
                      return (
                        <div className="relative my-4 overflow-hidden rounded-lg border border-border">
                          {/* Code header */}
                          <div className="flex items-center justify-between bg-secondary px-4 py-2">
                            <span className="text-xs text-muted-foreground">
                              {match[1]}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopy(codeString)}
                              className="h-7 gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground"
                            >
                              {copied ? (
                                <>
                                  <Check className="h-3.5 w-3.5" />
                                  Copied!
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3.5 w-3.5" />
                                  Copy code
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
                              borderRadius: 0,
                              background: "hsl(var(--secondary))",
                              fontSize: "0.875rem",
                              padding: "1rem",
                            }}
                          >
                            {codeString}
                          </SyntaxHighlighter>
                        </div>
                      );
                    }

                    return (
                      <code
                        className="rounded bg-secondary px-1.5 py-0.5 font-mono text-sm text-foreground"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                  pre: ({ children }) => <>{children}</>,
                  p: ({ children }) => <p className="mb-4 last:mb-0 leading-7 text-foreground/90">{children}</p>,
                  ul: ({ children }) => <ul className="mb-4 list-disc pl-6 space-y-2">{children}</ul>,
                  ol: ({ children }) => <ol className="mb-4 list-decimal pl-6 space-y-2">{children}</ol>,
                  li: ({ children }) => <li className="leading-7 text-foreground/90">{children}</li>,
                  h1: ({ children }) => <h1 className="text-2xl font-bold mb-4 mt-6 text-foreground">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-xl font-semibold mb-3 mt-5 text-foreground">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-lg font-semibold mb-2 mt-4 text-foreground">{children}</h3>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-primary/50 pl-4 italic text-muted-foreground my-4">
                      {children}
                    </blockquote>
                  ),
                  strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>

            {/* Action buttons for AI messages */}
            {!isUser && (
              <div className="flex items-center gap-1 pt-2 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={handleCopyMessage}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                >
                  <ThumbsUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                >
                  <ThumbsDown className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
