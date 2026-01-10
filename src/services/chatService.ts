import { supabase } from "@/integrations/supabase/client";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface SendMessageResponse {
  response?: string;
  message?: string;
  error?: string;
}

export async function sendMessage(
  message: string,
  conversationHistory: Array<{ role: "user" | "assistant"; content: string }> = []
): Promise<string> {
  try {
    const { data, error } = await supabase.functions.invoke('ai-chat', {
      body: { 
        query: message,
        history: conversationHistory 
      },
    });

    if (error) {
      console.error('Edge function error:', error);
      throw new Error(error.message || 'Failed to connect to AI tutor');
    }

    if (data?.error) {
      throw new Error(data.error);
    }
    
    return data?.response || data?.message || "I received your message but couldn't generate a response.";
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error occurred. Please try again.");
  }
}

export function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
