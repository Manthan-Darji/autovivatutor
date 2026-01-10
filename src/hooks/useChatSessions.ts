import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ChatSession {
  id: string;
  title: string;
  emoji: string;
  color: string;
  message_count: number;
  last_message_at: string | null;
  created_at: string;
  updated_at: string;
}

export function useChatSessions() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("chat_sessions")
        .select("*")
        .order("last_message_at", { ascending: false });

      if (error) throw error;
      setSessions(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch sessions");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createSession = useCallback(async (title: string = "New Chat") => {
    const emojis = ["💬", "📚", "🎓", "💡", "🧠", "📖", "✨", "🚀"];
    const colors = [
      "from-indigo-500/20 to-purple-500/20",
      "from-green-500/20 to-emerald-500/20",
      "from-blue-500/20 to-cyan-500/20",
      "from-orange-500/20 to-red-500/20",
      "from-pink-500/20 to-rose-500/20",
    ];

    const { data, error } = await supabase
      .from("chat_sessions")
      .insert({
        title,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
      })
      .select()
      .single();

    if (error) throw error;
    
    setSessions((prev) => [data, ...prev]);
    return data;
  }, []);

  const updateSessionTitle = useCallback(async (sessionId: string, title: string) => {
    const { error } = await supabase
      .from("chat_sessions")
      .update({ title })
      .eq("id", sessionId);

    if (error) throw error;
    
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, title } : s))
    );
  }, []);

  const deleteSession = useCallback(async (sessionId: string) => {
    const { error } = await supabase
      .from("chat_sessions")
      .delete()
      .eq("id", sessionId);

    if (error) throw error;
    
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  return {
    sessions,
    isLoading,
    error,
    createSession,
    updateSessionTitle,
    deleteSession,
    refetch: fetchSessions,
  };
}
