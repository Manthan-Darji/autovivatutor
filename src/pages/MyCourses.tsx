import { motion } from "framer-motion";
import { Sidebar } from "@/components/layout/Sidebar";
import { BookOpen, Clock, ArrowRight, GraduationCap, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

// Placeholder course data - will be replaced with real data from database
const sampleCourses = [
  {
    id: "1",
    title: "Introduction to Mathematics",
    description: "Learn fundamental math concepts including algebra, geometry, and arithmetic",
    progress: 65,
    totalLessons: 12,
    completedLessons: 8,
    emoji: "📐",
    color: "from-blue-500/10 to-indigo-500/10",
    lastAccessed: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: "2",
    title: "Science Fundamentals",
    description: "Explore physics, chemistry, and biology basics",
    progress: 30,
    totalLessons: 15,
    completedLessons: 5,
    emoji: "🔬",
    color: "from-green-500/10 to-emerald-500/10",
    lastAccessed: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  },
  {
    id: "3",
    title: "English Grammar",
    description: "Master grammar rules, vocabulary, and writing skills",
    progress: 90,
    totalLessons: 10,
    completedLessons: 9,
    emoji: "📚",
    color: "from-purple-500/10 to-pink-500/10",
    lastAccessed: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
  },
];

const MyCourses = () => {
  const navigate = useNavigate();
  const { role } = useAuth();

  const formatLastAccessed = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
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
                <BookOpen className="h-3.5 w-3.5" />
                {role === "teacher" ? "YOUR COURSES" : "ENROLLED COURSES"}
              </div>
              <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
                My Courses
              </h1>
              <p className="mt-1 text-muted-foreground">
                {role === "teacher" 
                  ? "Manage and track your created courses" 
                  : "Continue learning where you left off"}
              </p>
            </div>
            {role === "teacher" && (
              <Button onClick={() => navigate("/create")} className="gap-2">
                <GraduationCap className="h-4 w-4" />
                Create Course
              </Button>
            )}
          </motion.div>

          {sampleCourses.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <BookOpen className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">No courses yet</h3>
              <p className="mt-1 text-muted-foreground">
                {role === "teacher" 
                  ? "Create your first course to get started" 
                  : "Browse available courses to start learning"}
              </p>
              <Button 
                onClick={() => navigate(role === "teacher" ? "/create" : "/")} 
                className="mt-4 gap-2"
              >
                {role === "teacher" ? "Create Course" : "Browse Courses"}
              </Button>
            </motion.div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {sampleCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => navigate(`/course/${course.id}`)}
                  className={`group relative cursor-pointer overflow-hidden rounded-xl border border-border bg-gradient-to-br ${course.color} p-6 backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-lg`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-card text-3xl shadow-sm">
                      {course.emoji}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground line-clamp-1">
                        {course.title}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                        {course.description}
                      </p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {course.completedLessons}/{course.totalLessons} lessons
                      </span>
                      <span className="font-medium text-primary">{course.progress}%</span>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${course.progress}%` }}
                        transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                        className="h-full rounded-full bg-primary"
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      {formatLastAccessed(course.lastAccessed)}
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/course/${course.id}?tab=syllabus`);
                        }}
                      >
                        <FileText className="h-3.5 w-3.5" />
                        Syllabus
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="gap-1.5"
                      >
                        View Course
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
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
