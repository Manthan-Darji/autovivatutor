import { useState, useCallback, useRef, useEffect } from "react";
import {
  sendMessage as sendMessageToApi,
  generateMessageId,
  type ChatMessage,
} from "@/services/chatService";
import { toast } from "sonner";

interface UseChatOptions {
  typewriterSpeed?: number;
  onError?: (error: string) => void;
}

export function useChat(options: UseChatOptions = {}) {
  const { typewriterSpeed = 15, onError } = options;
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [displayedResponse, setDisplayedResponse] = useState("");
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, displayedResponse, isLoading, scrollToBottom]);

  // Typewriter effect
  const typewriterEffect = useCallback((text: string, callback: () => void) => {
    setIsTyping(true);
    setDisplayedResponse("");
    let index = 0;
    
    const type = () => {
      if (index < text.length) {
        setDisplayedResponse(text.slice(0, index + 1));
        index++;
        setTimeout(type, typewriterSpeed);
      } else {
        setIsTyping(false);
        callback();
      }
    };
    
    type();
  }, [typewriterSpeed]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: generateMessageId(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setConnectionStatus("Connecting to Brain...");

    try {
      const response = await sendMessageToApi(content);
      setConnectionStatus(null);

      // Use typewriter effect for the response
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
      setConnectionStatus(null);
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong";
      
      toast.error("Connecting to Brain...", {
        description: errorMessage,
      });

      onError?.(errorMessage);

      // Add error message to chat
      const errorResponse: ChatMessage = {
        id: generateMessageId(),
        role: "assistant",
        content: `⚠️ ${errorMessage}\n\nPlease try again in a moment.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, typewriterEffect, onError]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setDisplayedResponse("");
  }, []);

  return {
    messages,
    isLoading,
    isTyping,
    displayedResponse,
    connectionStatus,
    messagesEndRef,
    sendMessage,
    clearMessages,
  };
}