import { motion } from "framer-motion";
import { Sidebar } from "@/components/layout/Sidebar";
import { 
  BookOpen, 
  ArrowLeft, 
  Play, 
  CheckCircle2, 
  Circle, 
  Clock, 
  MessageSquare,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

// Sample course data - will be replaced with database data
const courseData: Record<string, {
  id: string;
  title: string;
  description: string;
  emoji: string;
  color: string;
  progress: number;
  lessons: {
    id: string;
    title: string;
    duration: string;
    type: "video" | "reading" | "quiz";
    completed: boolean;
  }[];
}> = {
  "1": {
    id: "1",
    title: "Introduction to Mathematics",
    description: "Learn fundamental math concepts including algebra, geometry, and arithmetic. This comprehensive course covers everything from basic operations to advanced problem-solving techniques.",
    emoji: "📐",
    color: "from-blue-500/20 to-indigo-500/20",
    progress: 65,
    lessons: [
      { id: "1-1", title: "Numbers and Operations", duration: "15 min", type: "video", completed: true },
      { id: "1-2", title: "Basic Algebra Concepts", duration: "20 min", type: "video", completed: true },
      { id: "1-3", title: "Solving Linear Equations", duration: "25 min", type: "video", completed: true },
      { id: "1-4", title: "Practice Problems Set 1", duration: "30 min", type: "quiz", completed: true },
      { id: "1-5", title: "Introduction to Geometry", duration: "20 min", type: "video", completed: true },
      { id: "1-6", title: "Angles and Triangles", duration: "25 min", type: "video", completed: true },
      { id: "1-7", title: "Area and Perimeter", duration: "20 min", type: "reading", completed: true },
      { id: "1-8", title: "Practice Problems Set 2", duration: "30 min", type: "quiz", completed: true },
      { id: "1-9", title: "Advanced Algebra", duration: "30 min", type: "video", completed: false },
      { id: "1-10", title: "Quadratic Equations", duration: "25 min", type: "video", completed: false },
      { id: "1-11", title: "Graphing Functions", duration: "20 min", type: "reading", completed: false },
      { id: "1-12", title: "Final Assessment", duration: "45 min", type: "quiz", completed: false },
    ],
  },
  "2": {
    id: "2",
    title: "Science Fundamentals",
    description: "Explore physics, chemistry, and biology basics. Understand the world around you through scientific principles and hands-on experiments.",
    emoji: "🔬",
    color: "from-green-500/20 to-emerald-500/20",
    progress: 30,
    lessons: [
      { id: "2-1", title: "What is Science?", duration: "10 min", type: "video", completed: true },
      { id: "2-2", title: "The Scientific Method", duration: "15 min", type: "video", completed: true },
      { id: "2-3", title: "Introduction to Physics", duration: "20 min", type: "video", completed: true },
      { id: "2-4", title: "Forces and Motion", duration: "25 min", type: "video", completed: true },
      { id: "2-5", title: "Physics Quiz", duration: "20 min", type: "quiz", completed: true },
      { id: "2-6", title: "Introduction to Chemistry", duration: "20 min", type: "video", completed: false },
      { id: "2-7", title: "Atoms and Molecules", duration: "25 min", type: "video", completed: false },
      { id: "2-8", title: "Chemical Reactions", duration: "30 min", type: "reading", completed: false },
      { id: "2-9", title: "Chemistry Quiz", duration: "20 min", type: "quiz", completed: false },
      { id: "2-10", title: "Introduction to Biology", duration: "20 min", type: "video", completed: false },
      { id: "2-11", title: "Cells and Organisms", duration: "25 min", type: "video", completed: false },
      { id: "2-12", title: "Ecosystems", duration: "20 min", type: "reading", completed: false },
      { id: "2-13", title: "Biology Quiz", duration: "20 min", type: "quiz", completed: false },
      { id: "2-14", title: "Science Project", duration: "60 min", type: "reading", completed: false },
      { id: "2-15", title: "Final Exam", duration: "45 min", type: "quiz", completed: false },
    ],
  },
  "3": {
    id: "3",
    title: "English Grammar",
    description: "Master grammar rules, vocabulary, and writing skills. Improve your communication abilities through structured lessons and practice.",
    emoji: "📚",
    color: "from-purple-500/20 to-pink-500/20",
    progress: 90,
    lessons: [
      { id: "3-1", title: "Parts of Speech", duration: "15 min", type: "video", completed: true },
      { id: "3-2", title: "Nouns and Pronouns", duration: "20 min", type: "video", completed: true },
      { id: "3-3", title: "Verbs and Tenses", duration: "25 min", type: "video", completed: true },
      { id: "3-4", title: "Grammar Quiz 1", duration: "15 min", type: "quiz", completed: true },
      { id: "3-5", title: "Sentence Structure", duration: "20 min", type: "video", completed: true },
      { id: "3-6", title: "Punctuation Rules", duration: "15 min", type: "reading", completed: true },
      { id: "3-7", title: "Common Mistakes", duration: "20 min", type: "video", completed: true },
      { id: "3-8", title: "Grammar Quiz 2", duration: "15 min", type: "quiz", completed: true },
      { id: "3-9", title: "Writing Skills", duration: "25 min", type: "video", completed: true },
      { id: "3-10", title: "Final Assessment", duration: "30 min", type: "quiz", completed: false },
    ],
  },
};

const CourseView = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  
  const course = courseId ? courseData[courseId] : null;

  if (!course) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar activePath="/courses" />
        <main className="ml-[180px] flex-1 p-6 lg:p-8">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold text-foreground">Course not found</h2>
            <p className="text-muted-foreground mt-2">The course you're looking for doesn't exist.</p>
            <Button onClick={() => navigate("/courses")} className="mt-4">
              Back to Courses
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const completedLessons = course.lessons.filter(l => l.completed).length;
  const nextLesson = course.lessons.find(l => !l.completed);

  const getTypeIcon = (type: "video" | "reading" | "quiz") => {
    switch (type) {
      case "video":
        return <Play className="h-4 w-4" />;
      case "reading":
        return <FileText className="h-4 w-4" />;
      case "quiz":
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: "video" | "reading" | "quiz") => {
    switch (type) {
      case "video":
        return "Video";
      case "reading":
        return "Reading";
      case "quiz":
        return "Quiz";
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activePath="/courses" />
      <main className="ml-[180px] flex-1 p-6 lg:p-8">
        <div className="mx-auto max-w-4xl">
          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Button
              variant="ghost"
              onClick={() => navigate("/courses")}
              className="mb-6 gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Courses
            </Button>
          </motion.div>

          {/* Course Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl border border-border bg-gradient-to-br ${course.color} p-8 mb-8`}
          >
            <div className="flex items-start gap-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-card text-5xl shadow-lg">
                {course.emoji}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-foreground">{course.title}</h1>
                <p className="mt-2 text-muted-foreground">{course.description}</p>
                
                {/* Progress section */}
                <div className="mt-6">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">
                      {completedLessons} of {course.lessons.length} lessons completed
                    </span>
                    <span className="font-semibold text-primary">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-3" />
                </div>

                {/* Continue button */}
                {nextLesson && (
                  <Button className="mt-6 gap-2">
                    <Play className="h-4 w-4" />
                    Continue: {nextLesson.title}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Lessons List */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-xl font-semibold text-foreground mb-4">Course Content</h2>
            <div className="space-y-2">
              {course.lessons.map((lesson, index) => (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer
                    ${lesson.completed 
                      ? "border-primary/30 bg-primary/5" 
                      : lesson === nextLesson
                        ? "border-primary bg-primary/10 shadow-md"
                        : "border-border bg-card hover:border-primary/50"
                    }`}
                >
                  {/* Completion status */}
                  <div className={`flex-shrink-0 ${lesson.completed ? "text-primary" : "text-muted-foreground"}`}>
                    {lesson.completed ? (
                      <CheckCircle2 className="h-6 w-6" />
                    ) : (
                      <Circle className="h-6 w-6" />
                    )}
                  </div>

                  {/* Lesson info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground truncate">{lesson.title}</span>
                      {lesson === nextLesson && (
                        <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                          Up Next
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        {getTypeIcon(lesson.type)}
                        {getTypeLabel(lesson.type)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {lesson.duration}
                      </span>
                    </div>
                  </div>

                  {/* Action button */}
                  <Button
                    variant={lesson === nextLesson ? "default" : "ghost"}
                    size="sm"
                    className="flex-shrink-0"
                  >
                    {lesson.completed ? "Review" : "Start"}
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Ask AI Help */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 p-6 rounded-xl border border-border bg-card"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Need help with this course?</h3>
                <p className="text-sm text-muted-foreground">Ask our AI tutor any questions about the material</p>
              </div>
              <Button onClick={() => navigate("/chat-history")} variant="outline" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Ask AI Tutor
              </Button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default CourseView;
