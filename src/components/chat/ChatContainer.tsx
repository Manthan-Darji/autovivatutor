import { useState, useRef, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { ChatTopBar } from "./ChatTopBar";
import { ChatMessage } from "./ChatMessage";
import { ChatThinking } from "./ChatThinking";
import { ChatInput } from "./ChatInput";
import { ChatWelcome } from "./ChatWelcome";
import {
  sendMessage,
  generateMessageId,
  type ChatMessage as ChatMessageType,
} from "@/services/chatService";
import { useToast } from "@/hooks/use-toast";

export function ChatContainer() {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: ChatMessageType = {
      id: generateMessageId(),
      role: "user",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setConnectionStatus("Connecting to Tutor...");

    try {
      const response = await sendMessage(content);
      setConnectionStatus(null);

      // Add AI response
      const aiMessage: ChatMessageType = {
        id: generateMessageId(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      setConnectionStatus(null);
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong";
      
      toast({
        title: "Connection Error",
        description: errorMessage,
        variant: "destructive",
      });

      // Add error message to chat
      const errorResponse: ChatMessageType = {
        id: generateMessageId(),
        role: "assistant",
        content: `⚠️ ${errorMessage}\n\nPlease try again in a moment.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Top Bar */}
      <ChatTopBar />

      {/* Connection Status Banner */}
      {connectionStatus && (
        <div className="bg-primary/10 px-4 py-2 text-center text-sm text-primary">
          {connectionStatus}
        </div>
      )}

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl space-y-4 p-4">
          {messages.length === 0 && !isLoading ? (
            <ChatWelcome onSuggestionClick={handleSendMessage} />
          ) : (
            <AnimatePresence mode="popLayout">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
            </AnimatePresence>
          )}

          {/* Thinking indicator */}
          {isLoading && <ChatThinking />}

          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <ChatInput
        onSend={handleSendMessage}
        disabled={isLoading}
        placeholder={
          isLoading ? "Waiting for response..." : "Ask me anything..."
        }
      />
    </div>
  );
}
