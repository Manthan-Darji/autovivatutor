import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Send, Loader2, Copy, ThumbsUp, ThumbsDown, Sparkles, User } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { sendMessage as sendMessageToApi, generateMessageId, type ChatMessage } from "@/services/chatService";
import { toast } from "sonner";

interface CourseGenerationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  topic: string;
  description: string;
}

export function CourseGenerationModal({ open, onOpenChange, topic, description }: CourseGenerationModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [displayedResponse, setDisplayedResponse] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, displayedResponse, isLoading]);

  // Auto-generate course when modal opens
  useEffect(() => {
    if (open && messages.length === 0 && topic) {
      const initialPrompt = `Create a comprehensive learning curriculum for: "${topic}"${description ? `\n\nGoals: ${description}` : ""}\n\nPlease include:\n1. Course overview\n2. Module breakdown\n3. Key learning objectives\n4. Recommended timeline\n5. Prerequisites (if any)`;
      
      handleSendMessage(initialPrompt, true);
    }
  }, [open, topic]);

  const typewriterEffect = (text: string, callback: () => void) => {
    setIsTyping(true);
    setDisplayedResponse("");
    let index = 0;
    
    const type = () => {
      if (index < text.length) {
        setDisplayedResponse(text.slice(0, index + 1));
        index++;
        setTimeout(type, 10);
      } else {
        setIsTyping(false);
        callback();
      }
    };
    
    type();
  };

  const handleSendMessage = async (content: string, isInitial = false) => {
    if (!content.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: generateMessageId(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    const currentMessages = [...messages, userMessage];
    setMessages(currentMessages);
    setInputValue("");
    setIsLoading(true);

    const conversationHistory = currentMessages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    try {
      const response = await sendMessageToApi(content, conversationHistory);

      typewriterEffect(response, () => {
        const aiMessage: ChatMessage = {
          id: generateMessageId(),
          role: "assistant",
          content: response,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
        setDisplayedResponse("");
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Something went wrong";
      toast.error("Failed to get response", { description: errorMessage });
      
      const errorResponse: ChatMessage = {
        id: generateMessageId(),
        role: "assistant",
        content: `⚠️ ${errorMessage}\n\nPlease try again.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard");
  };

  const handleClose = () => {
    setMessages([]);
    setDisplayedResponse("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-0 gap-0 bg-background border-border">
        <DialogHeader className="px-6 py-4 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold text-foreground">
                  Course Generator
                </DialogTitle>
                <p className="text-sm text-muted-foreground">{topic}</p>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <AnimatePresence mode="popLayout">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="group py-4"
              >
                <div className="flex items-start gap-4">
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    message.role === "assistant" 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-secondary text-secondary-foreground"
                  }`}>
                    {message.role === "assistant" ? (
                      <Sparkles className="h-4 w-4" />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-foreground">
                        {message.role === "assistant" ? "AI Tutor" : "You"}
                      </span>
                    </div>
                    <div className="prose prose-sm dark:prose-invert max-w-none text-foreground">
                      <ReactMarkdown
                        components={{
                          code({ node, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || "");
                            const isInline = !match;
                            return isInline ? (
                              <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono" {...props}>
                                {children}
                              </code>
                            ) : (
                              <SyntaxHighlighter
                                style={oneDark}
                                language={match[1]}
                                PreTag="div"
                                className="rounded-lg !my-3"
                              >
                                {String(children).replace(/\n$/, "")}
                              </SyntaxHighlighter>
                            );
                          },
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                    {message.role === "assistant" && (
                      <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleCopy(message.content)}
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <ThumbsUp className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <ThumbsDown className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Typing indicator */}
            {isTyping && displayedResponse && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-4"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-foreground">AI Tutor</span>
                    </div>
                    <div className="prose prose-sm dark:prose-invert max-w-none text-foreground">
                      <ReactMarkdown
                        components={{
                          code({ node, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || "");
                            const isInline = !match;
                            return isInline ? (
                              <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono" {...props}>
                                {children}
                              </code>
                            ) : (
                              <SyntaxHighlighter
                                style={oneDark}
                                language={match[1]}
                                PreTag="div"
                                className="rounded-lg !my-3"
                              >
                                {String(children).replace(/\n$/, "")}
                              </SyntaxHighlighter>
                            );
                          },
                        }}
                      >
                        {displayedResponse}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Loading indicator */}
            {isLoading && !isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-4"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                    <span className="text-sm text-muted-foreground">Generating curriculum...</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="flex-shrink-0 border-t border-border p-4">
          <form onSubmit={handleSubmit} className="flex items-center gap-3">
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask a follow-up question..."
                disabled={isLoading}
                className="w-full rounded-full border border-border bg-secondary/50 px-5 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
              />
            </div>
            <Button
              type="submit"
              size="icon"
              disabled={!inputValue.trim() || isLoading}
              className="h-11 w-11 rounded-full"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
