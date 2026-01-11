import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Code, Palette, Calculator, Microscope, Music, Globe, BookOpen, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useChatSessions } from "@/hooks/useChatSessions";

type Interest = {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  topics: string[];
};

const interests: Interest[] = [
  {
    id: "coding",
    label: "Coding & Tech",
    icon: <Code className="h-5 w-5" />,
    color: "from-blue-500/20 to-cyan-500/20 border-blue-500/30",
    topics: ["Python Basics", "Web Development", "AI & Machine Learning", "Mobile Apps"],
  },
  {
    id: "design",
    label: "Design & Art",
    icon: <Palette className="h-5 w-5" />,
    color: "from-pink-500/20 to-purple-500/20 border-pink-500/30",
    topics: ["UI/UX Design", "Digital Art", "Animation", "Graphic Design"],
  },
  {
    id: "math",
    label: "Mathematics",
    icon: <Calculator className="h-5 w-5" />,
    color: "from-amber-500/20 to-orange-500/20 border-amber-500/30",
    topics: ["Algebra", "Calculus", "Statistics", "Geometry"],
  },
  {
    id: "science",
    label: "Science",
    icon: <Microscope className="h-5 w-5" />,
    color: "from-green-500/20 to-emerald-500/20 border-green-500/30",
    topics: ["Physics", "Chemistry", "Biology", "Astronomy"],
  },
  {
    id: "music",
    label: "Music",
    icon: <Music className="h-5 w-5" />,
    color: "from-violet-500/20 to-indigo-500/20 border-violet-500/30",
    topics: ["Music Theory", "Instruments", "Production", "Composition"],
  },
  {
    id: "languages",
    label: "Languages",
    icon: <Globe className="h-5 w-5" />,
    color: "from-red-500/20 to-rose-500/20 border-red-500/30",
    topics: ["Spanish", "French", "Japanese", "German"],
  },
];

export function InterestBasedLearning() {
  const navigate = useNavigate();
  const { createSession } = useChatSessions();
  const [selectedInterest, setSelectedInterest] = useState<Interest | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTopicClick = async (topic: string) => {
    setIsLoading(true);
    try {
      const session = await createSession();
      // Navigate to chat with the topic as initial message
      navigate(`/chat?session=${session.id}&topic=${encodeURIComponent(topic)}`);
    } catch (error) {
      console.error("Failed to start learning:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mb-6"
    >
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
          <Sparkles className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Learn What You Love</h2>
          <p className="text-xs text-muted-foreground">Pick a topic that interests you</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {interests.map((interest, index) => (
          <motion.div
            key={interest.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <div
              onClick={() => setSelectedInterest(selectedInterest?.id === interest.id ? null : interest)}
              className={`cursor-pointer rounded-xl border bg-gradient-to-br p-4 transition-all hover:shadow-lg ${interest.color} ${
                selectedInterest?.id === interest.id ? "ring-2 ring-primary" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-card/80">
                    {interest.icon}
                  </div>
                  <span className="font-medium text-foreground">{interest.label}</span>
                </div>
                <ChevronRight
                  className={`h-4 w-4 text-muted-foreground transition-transform ${
                    selectedInterest?.id === interest.id ? "rotate-90" : ""
                  }`}
                />
              </div>

              {selectedInterest?.id === interest.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 space-y-2"
                >
                  {interest.topics.map((topic) => (
                    <Button
                      key={topic}
                      variant="secondary"
                      size="sm"
                      className="w-full justify-start gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTopicClick(topic);
                      }}
                      disabled={isLoading}
                    >
                      <BookOpen className="h-3.5 w-3.5" />
                      {topic}
                    </Button>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
