import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Bot, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface TypewriterMessageProps {
  content: string;
}

export function TypewriterMessage({ content }: TypewriterMessageProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-6 bg-secondary/30"
    >
      <div className="mx-auto max-w-3xl px-4">
        <div className="flex gap-4">
          {/* Avatar */}
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600">
            <Bot className="h-4 w-4 text-white" />
          </div>

          {/* Content */}
          <div className="flex-1 space-y-2 overflow-hidden">
            {/* Role label */}
            <p className="text-sm font-semibold text-foreground">Viva AI</p>

            {/* Message content with typing cursor */}
            <div className="prose prose-sm max-w-none prose-invert">
              <ReactMarkdown
                components={{
                  code({ className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    const codeString = String(children).replace(/\n$/, "");

                    if (match) {
                      return (
                        <div className="relative my-4 overflow-hidden rounded-lg border border-border">
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
                  strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
                }}
              >
                {content}
              </ReactMarkdown>
              {/* Blinking cursor */}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                className="inline-block w-2 h-5 bg-foreground ml-0.5 align-middle"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
