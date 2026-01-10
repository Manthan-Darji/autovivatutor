import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChatTopBar } from "./ChatTopBar";
import { ChatSidebar } from "./ChatSidebar";
import { ChatMessage } from "./ChatMessage";
import { ChatThinking } from "./ChatThinking";
import { ChatInput } from "./ChatInput";
import { ChatWelcome } from "./ChatWelcome";
import { TypewriterMessage } from "./TypewriterMessage";
import { useChat } from "@/hooks/useChat";

export function ChatContainer() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const {
    messages,
    isLoading,
    isTyping,
    displayedResponse,
    connectionStatus,
    messagesEndRef,
    sendMessage,
    clearMessages,
  } = useChat();

  const handleNewChat = () => {
    clearMessages();
    setSidebarOpen(false);
  };

  return (
    <div className="relative flex h-screen overflow-hidden gradient-bg">
      {/* Background Orbs */}
      <div className="orb orb-indigo absolute -top-40 -right-40 h-80 w-80 opacity-50" />
      <div className="orb orb-purple absolute -bottom-40 -left-40 h-96 w-96 opacity-40" />
      <div className="orb orb-indigo absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 opacity-20" />

      {/* Sidebar */}
      <ChatSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onNewChat={handleNewChat}
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
          <div className="mx-auto max-w-3xl space-y-6 p-6">
            {messages.length === 0 && !isLoading && !isTyping ? (
              <ChatWelcome onSuggestionClick={sendMessage} />
            ) : (
              <AnimatePresence mode="popLayout">
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
              </AnimatePresence>
            )}

            {/* Typewriter response */}
            {isTyping && displayedResponse && (
              <TypewriterMessage content={displayedResponse} />
            )}

            {/* Thinking indicator */}
            {isLoading && !isTyping && <ChatThinking />}

            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <ChatInput
          onSend={sendMessage}
          disabled={isLoading || isTyping}
          placeholder={
            isLoading 
              ? "Waiting for response..." 
              : isTyping 
                ? "AI is responding..." 
                : "Ask me anything..."
          }
        />
      </motion.div>
    </div>
  );
}