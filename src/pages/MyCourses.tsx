import { motion } from "framer-motion";
import { Sidebar } from "@/components/layout/Sidebar";
import { BookOpen, Clock, Trophy, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

const courses = [
  {
    id: 1,
    title: "Introduction to Python",
    progress: 75,
    lessons: 12,
    completed: 9,
    image: "🐍",
    color: "from-green-500/20 to-emerald-500/20",
  },
  {
    id: 2,
    title: "Web Development Basics",
    progress: 45,
    lessons: 20,
    completed: 9,
    image: "🌐",
    color: "from-blue-500/20 to-cyan-500/20",
  },
  {
    id: 3,
    title: "Data Science Fundamentals",
    progress: 20,
    lessons: 15,
    completed: 3,
    image: "📊",
    color: "from-purple-500/20 to-pink-500/20",
  },
  {
    id: 4,
    title: "Machine Learning 101",
    progress: 0,
    lessons: 18,
    completed: 0,
    image: "🤖",
    color: "from-orange-500/20 to-red-500/20",
  },
];

const MyCourses = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activePath="/courses" />
      <main className="ml-[180px] flex-1 p-6 lg:p-8">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              <BookOpen className="h-3.5 w-3.5" />
              MY COURSES
            </div>
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
              Your Learning Journey
            </h1>
            <p className="mt-1 text-muted-foreground">
              Continue where you left off or start something new
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2">
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`group relative overflow-hidden rounded-xl border border-border bg-gradient-to-br ${course.color} p-6 backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-lg`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-card text-3xl shadow-sm">
                      {course.image}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {course.title}
                      </h3>
                      <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-3.5 w-3.5" />
                          {course.lessons} lessons
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {course.completed}/{course.lessons} done
                        </span>
                      </div>
                    </div>
                  </div>
                  {course.progress === 100 && (
                    <Trophy className="h-6 w-6 text-yellow-500" />
                  )}
                </div>

                <div className="mt-6">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium text-primary">
                      {course.progress}%
                    </span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>

                <Button
                  onClick={() => navigate("/chat")}
                  className="mt-4 w-full gap-2"
                  variant={course.progress === 0 ? "default" : "secondary"}
                >
                  {course.progress === 0 ? "Start Course" : "Continue Learning"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyCourses;
