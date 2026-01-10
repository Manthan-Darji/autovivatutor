import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ChatTopBar } from "./ChatTopBar";
import { ChatSidebar } from "./ChatSidebar";
import { ChatMessage } from "./ChatMessage";
import { ChatThinking } from "./ChatThinking";
import { ChatInput } from "./ChatInput";
import { ChatWelcome } from "./ChatWelcome";
import { TypewriterMessage } from "./TypewriterMessage";
import { useChatMessages } from "@/hooks/useChatMessages";
import { useChatSessions } from "@/hooks/useChatSessions";

export function ChatContainer() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const sessionId = searchParams.get("session");
  
  const { sessions, createSession, updateSessionTitle } = useChatSessions();
  
  const {
    messages,
    isLoading,
    isTyping,
    isFetching,
    displayedResponse,
    connectionStatus,
    messagesEndRef,
    sendMessage,
    clearMessages,
  } = useChatMessages({ sessionId });

  // Auto-update session title based on first user message
  useEffect(() => {
    if (sessionId && messages.length === 1 && messages[0].role === "user") {
      const title = messages[0].content.slice(0, 50) + (messages[0].content.length > 50 ? "..." : "");
      updateSessionTitle(sessionId, title);
    }
  }, [sessionId, messages, updateSessionTitle]);

  const handleNewChat = async () => {
    try {
      const session = await createSession();
      setSearchParams({ session: session.id });
      setSidebarOpen(false);
    } catch (error) {
      console.error("Failed to create session:", error);
    }
  };

  const handleSelectSession = (id: string) => {
    setSearchParams({ session: id });
  };

  const handleSendMessage = async (content: string) => {
    // If no session, create one first
    if (!sessionId) {
      try {
        const session = await createSession(content.slice(0, 50));
        setSearchParams({ session: session.id });
        // Wait a tick for state to update, then send
        setTimeout(() => {
          sendMessage(content);
        }, 100);
        return;
      } catch (error) {
        console.error("Failed to create session:", error);
        return;
      }
    }
    sendMessage(content);
  };

  return (
    <div className="relative flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <ChatSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onNewChat={handleNewChat}
        sessions={sessions}
        currentSessionId={sessionId}
        onSelectSession={handleSelectSession}
      />

      {/* Main Content */}
      <motion.div
        animate={{
          marginLeft: sidebarOpen ? 280 : 0,
        }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="flex flex-1 flex-col h-screen relative"
      >
        {/* Top Bar */}
        <ChatTopBar connectionStatus={connectionStatus} />

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto">
          {isFetching ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-pulse text-muted-foreground">Loading messages...</div>
            </div>
          ) : messages.length === 0 && !isLoading && !isTyping ? (
            <ChatWelcome onSuggestionClick={handleSendMessage} />
          ) : (
            <div className="pb-4">
              <AnimatePresence mode="popLayout">
                {messages.map((message) => (
                  <ChatMessage 
                    key={message.id} 
                    message={{
                      id: message.id,
                      role: message.role as "user" | "assistant",
                      content: message.content,
                      timestamp: new Date(message.created_at),
                    }} 
                  />
                ))}
              </AnimatePresence>

              {/* Typewriter response */}
              {isTyping && displayedResponse && (
                <TypewriterMessage content={displayedResponse} />
              )}

              {/* Thinking indicator */}
              {isLoading && !isTyping && <ChatThinking />}

              {/* Scroll anchor */}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <ChatInput
          onSend={handleSendMessage}
          disabled={isLoading || isTyping}
          placeholder={
            isLoading
              ? "Waiting for response..."
              : isTyping
                ? "AI is responding..."
                : "Message Viva AI..."
          }
        />
      </motion.div>
    </div>
  );
}
