import { motion } from "framer-motion";
import { Sidebar } from "@/components/layout/Sidebar";
import { MessageSquare, Clock, Trash2, ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useChatSessions } from "@/hooks/useChatSessions";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

const MyCourses = () => {
  const navigate = useNavigate();
  const { sessions, isLoading, createSession, deleteSession } = useChatSessions();

  const handleNewChat = async () => {
    try {
      const session = await createSession();
      navigate(`/chat?session=${session.id}`);
    } catch (error) {
      console.error("Failed to create session:", error);
    }
  };

  const handleContinueChat = (sessionId: string) => {
    navigate(`/chat?session=${sessionId}`);
  };

  const handleDeleteSession = async (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    try {
      await deleteSession(sessionId);
    } catch (error) {
      console.error("Failed to delete session:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activePath="/courses" />
      <main className="ml-[180px] flex-1 p-6 lg:p-8">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex items-start justify-between"
          >
            <div>
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
                <MessageSquare className="h-3.5 w-3.5" />
                CHAT HISTORY
              </div>
              <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
                Your Conversations
              </h1>
              <p className="mt-1 text-muted-foreground">
                Continue where you left off or start a new chat
              </p>
            </div>
            <Button onClick={handleNewChat} className="gap-2">
              <Plus className="h-4 w-4" />
              New Chat
            </Button>
          </motion.div>

          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-40 rounded-xl" />
              ))}
            </div>
          ) : sessions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <MessageSquare className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">No conversations yet</h3>
              <p className="mt-1 text-muted-foreground">
                Start a new chat to begin your learning journey
              </p>
              <Button onClick={handleNewChat} className="mt-4 gap-2">
                <Plus className="h-4 w-4" />
                Start New Chat
              </Button>
            </motion.div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {sessions.map((session, index) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleContinueChat(session.id)}
                  className={`group relative cursor-pointer overflow-hidden rounded-xl border border-border bg-gradient-to-br ${session.color} p-6 backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-lg`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-card text-3xl shadow-sm">
                        {session.emoji}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground line-clamp-1">
                          {session.title}
                        </h3>
                        <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-3.5 w-3.5" />
                            {session.message_count} messages
                          </span>
                          {session.last_message_at && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {formatDistanceToNow(new Date(session.last_message_at), { addSuffix: true })}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => handleDeleteSession(e, session.id)}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                    </Button>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <Button
                      className="gap-2"
                      variant="secondary"
                    >
                      Continue Chat
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyCourses;
