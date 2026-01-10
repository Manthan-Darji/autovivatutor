const API_URL = "https://api.allorigins.win/raw?url=" + encodeURIComponent("https://copy-of-viva-ai-tutor-250579881996.us-west1.run.app/chat");

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

export async function sendMessage(message: string): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: message }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 503 || response.status === 502) {
        throw new Error("The tutor is waking up. Please try again in a moment.");
      }
      throw new Error(`Server error: ${response.status}`);
    }

    const data: SendMessageResponse = await response.json();
    
    return data.response || data.message || "I received your message but couldn't generate a response.";
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new Error("Request timed out. The tutor might be busy. Please try again.");
      }
      // Check for CORS/Network errors
      if (error.message === "Failed to fetch" || error.name === "TypeError") {
        throw new Error(
          "Cannot connect to the AI backend. This is likely a CORS issue. Please ensure your backend has CORS enabled (allow-origin: '*')."
        );
      }
      throw error;
    }
    throw new Error("An unexpected error occurred. Please try again.");
  }
}

export function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
