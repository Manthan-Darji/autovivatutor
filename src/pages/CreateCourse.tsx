import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "@/components/layout/Sidebar";
import { PlusCircle, Target, BookOpen, Clock, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { CourseGenerationPanel } from "@/components/course/CourseGenerationPanel";

const suggestions = [
  { icon: "🐍", title: "Python Programming", desc: "Learn coding basics" },
  { icon: "🧠", title: "Machine Learning", desc: "AI fundamentals" },
  { icon: "📊", title: "Data Analysis", desc: "Excel to Python" },
  { icon: "🎨", title: "UI/UX Design", desc: "Design principles" },
];

const CreateCourse = () => {
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    if (!topic.trim()) {
      toast.error("Please enter a course topic");
      return;
    }
    setIsGenerating(true);
  };

  const handleBack = () => {
    setIsGenerating(false);
  };

  const handleSuggestionClick = (title: string) => {
    setTopic(title);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activePath="/create" />
      <main className="ml-[180px] flex-1 p-6 lg:p-8">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              <PlusCircle className="h-3.5 w-3.5" />
              CREATE COURSE
            </div>
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
              Design Your Learning Path
            </h1>
            <p className="mt-1 text-muted-foreground">
              Tell us what you want to learn, and AI will create a personalized curriculum
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {!isGenerating ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {/* Quick Suggestions */}
                <div className="mb-8">
                  <Label className="mb-3 block text-sm text-muted-foreground">
                    Quick suggestions
                  </Label>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {suggestions.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(item.title)}
                        className="group rounded-xl border border-border bg-card p-4 text-left transition-all hover:border-primary/50 hover:bg-card/80"
                      >
                        <span className="text-2xl">{item.icon}</span>
                        <p className="mt-2 font-medium text-foreground text-sm">
                          {item.title}
                        </p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Course Form */}
                <div className="rounded-xl border border-border bg-card p-6">
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="topic" className="mb-2 flex items-center gap-2">
                        <Target className="h-4 w-4 text-primary" />
                        What do you want to learn?
                      </Label>
                      <Input
                        id="topic"
                        placeholder="e.g., Python for Data Science, Web Development..."
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="h-12"
                      />
                    </div>

                    <div>
                      <Label htmlFor="description" className="mb-2 flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                        Any specific goals? (optional)
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="e.g., I want to build a machine learning model to predict stock prices..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                      />
                    </div>

                    <div className="flex items-center gap-4 rounded-lg bg-secondary/50 p-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Estimated time</p>
                        <p className="text-sm text-muted-foreground">
                          AI will analyze your topic and create a structured curriculum
                        </p>
                      </div>
                    </div>

                    <Button
                      onClick={handleGenerate}
                      className="w-full gap-2 h-12"
                    >
                      <Wand2 className="h-5 w-5" />
                      Generate Course with AI
                    </Button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <CourseGenerationPanel
                key="panel"
                topic={topic}
                description={description}
                onBack={handleBack}
              />
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default CreateCourse;
