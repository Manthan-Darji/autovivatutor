import { useState, useCallback, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ChatMessage {
  id: string;
  session_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

interface UseChatMessagesOptions {
  sessionId: string | null;
  typewriterSpeed?: number;
  onError?: (error: string) => void;
}

export function useChatMessages(options: UseChatMessagesOptions) {
  const { sessionId, typewriterSpeed = 15, onError } = options;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [displayedResponse, setDisplayedResponse] = useState("");
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch messages for a session
  const fetchMessages = useCallback(async () => {
    if (!sessionId) return;

    try {
      setIsFetching(true);
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setMessages((data as ChatMessage[]) || []);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    } finally {
      setIsFetching(false);
    }
  }, [sessionId]);

  useEffect(() => {
    if (sessionId) {
      fetchMessages();
    } else {
      setMessages([]);
    }
  }, [sessionId, fetchMessages]);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, displayedResponse, isLoading, scrollToBottom]);

  // Typewriter effect
  const typewriterEffect = useCallback(
    (text: string, callback: () => void) => {
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
    },
    [typewriterSpeed]
  );

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading || !sessionId) return;

      setIsLoading(true);
      setConnectionStatus("Connecting to Brain...");

      try {
        // Save user message to database
        const { data: userMsg, error: userError } = await supabase
          .from("chat_messages")
          .insert({
            session_id: sessionId,
            role: "user",
            content: content.trim(),
          })
          .select()
          .single();

        if (userError) throw userError;
        
        setMessages((prev) => [...prev, userMsg as ChatMessage]);

        // Get last 20 messages for context
        const conversationHistory = [...messages, userMsg as ChatMessage]
          .slice(-20)
          .map((msg) => ({
            role: msg.role,
            content: msg.content,
          }));

        // Call AI
        const { data, error } = await supabase.functions.invoke("ai-chat", {
          body: {
            query: content,
            history: conversationHistory,
          },
        });

        if (error) throw error;

        const response = data?.response || data?.message || "I received your message but couldn't generate a response.";

        setConnectionStatus(null);

        // Use typewriter effect
        typewriterEffect(response, async () => {
          // Save assistant message to database
          const { data: assistantMsg, error: assistantError } = await supabase
            .from("chat_messages")
            .insert({
              session_id: sessionId,
              role: "assistant",
              content: response,
            })
            .select()
            .single();

          if (assistantError) {
            console.error("Failed to save assistant message:", assistantError);
          } else {
            setMessages((prev) => [...prev, assistantMsg as ChatMessage]);
          }
          setDisplayedResponse("");
        });
      } catch (error) {
        setConnectionStatus(null);
        const errorMessage = error instanceof Error ? error.message : "Something went wrong";

        toast.error("Connection Error", {
          description: errorMessage,
        });

        onError?.(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, sessionId, messages, typewriterEffect, onError]
  );

  const clearMessages = useCallback(async () => {
    if (!sessionId) return;

    // Delete all messages for this session
    await supabase.from("chat_messages").delete().eq("session_id", sessionId);

    setMessages([]);
    setDisplayedResponse("");
  }, [sessionId]);

  return {
    messages,
    isLoading,
    isTyping,
    isFetching,
    displayedResponse,
    connectionStatus,
    messagesEndRef,
    sendMessage,
    clearMessages,
  };
}
