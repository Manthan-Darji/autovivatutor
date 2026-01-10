import { Button } from "@/components/ui/button";
import { ArrowLeft, Send, Loader2, Copy, ThumbsUp, ThumbsDown, Sparkles, User, Save, Search } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sendMessage as sendMessageToApi, generateMessageId, type ChatMessage } from "@/services/chatService";
import { toast } from "sonner";
import { CourseMarkdownRenderer } from "./CourseMarkdownRenderer";
import { WebSearchPanel } from "./WebSearchPanel";

interface CourseGenerationPanelProps {
  topic: string;
  description: string;
  onBack: () => void;
}

export function CourseGenerationPanel({ topic, description, onBack }: CourseGenerationPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [displayedResponse, setDisplayedResponse] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasInitialized = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, displayedResponse, isLoading]);

  // Auto-generate course on mount
  useEffect(() => {
    if (!hasInitialized.current && topic) {
      hasInitialized.current = true;
      const initialPrompt = `Create a comprehensive learning curriculum for: "${topic}"${description ? `\n\nGoals: ${description}` : ""}

Please include:
1. **Course Overview** - Brief description of what students will learn
2. **Module Breakdown** - Detailed modules with topics
3. **Key Learning Objectives** - What students will be able to do
4. **Recommended Timeline** - Duration for each module
5. **Prerequisites** (if any)

**IMPORTANT - Include Visual Learning Aids:**
- Add a Mermaid diagram showing the learning path/flow using \`\`\`mermaid code blocks (flowchart, mindmap, or sequence diagram)
- For each major module, recommend 1-2 relevant YouTube tutorial videos with direct links like [Video Title](https://youtube.com/watch?v=VIDEO_ID)
- Use blockquotes for helpful tips

Example Mermaid diagram format:
\`\`\`mermaid
graph TD
    A[Start] --> B[Module 1]
    B --> C[Module 2]
    C --> D[Complete]
\`\`\``;
      
      handleSendMessage(initialPrompt);
    }
  }, [topic, description]);

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

  const handleSendMessage = async (content: string) => {
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

  const handleSaveCourse = () => {
    toast.success("Course saved!", { description: "You can find it in My Courses" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="rounded-xl border border-border bg-card overflow-hidden flex flex-col h-[calc(100vh-200px)] min-h-[500px]"
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex items-center justify-between flex-shrink-0 bg-secondary/30">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Course Generator
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-1">{topic}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowSearch(true)} 
            className="gap-1.5"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Search Web</span>
          </Button>
          <Button variant="outline" size="sm" onClick={handleSaveCourse} className="gap-1.5">
            <Save className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Save Course</span>
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <AnimatePresence mode="popLayout">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="group py-3"
            >
              <div className="flex items-start gap-3">
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                  message.role === "assistant" 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-secondary text-secondary-foreground"
                }`}>
                  {message.role === "assistant" ? (
                    <Sparkles className="h-3.5 w-3.5" />
                  ) : (
                    <User className="h-3.5 w-3.5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-foreground">
                      {message.role === "assistant" ? "AI Tutor" : "You"}
                    </span>
                  </div>
                  <div className="prose prose-sm dark:prose-invert max-w-none text-foreground text-sm">
                    <CourseMarkdownRenderer content={message.content} />
                  </div>
                  {message.role === "assistant" && (
                    <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleCopy(message.content)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <ThumbsUp className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <ThumbsDown className="h-3 w-3" />
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
              className="py-3"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-foreground">AI Tutor</span>
                  </div>
                  <div className="prose prose-sm dark:prose-invert max-w-none text-foreground text-sm">
                    <CourseMarkdownRenderer content={displayedResponse} />
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
              className="py-3"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                  <span className="text-xs text-muted-foreground">Generating curriculum...</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 border-t border-border p-3 bg-secondary/30">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask a follow-up question..."
              disabled={isLoading}
              className="w-full rounded-full border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
            />
          </div>
          <Button
            type="submit"
            size="icon"
            disabled={!inputValue.trim() || isLoading}
            className="h-10 w-10 rounded-full"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
      {/* Web Search Panel */}
      <AnimatePresence>
        {showSearch && (
          <WebSearchPanel 
            isOpen={showSearch} 
            onClose={() => setShowSearch(false)}
            defaultQuery={topic}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
