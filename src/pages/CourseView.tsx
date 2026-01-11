import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "@/components/layout/Sidebar";
import { 
  BookOpen, 
  ArrowLeft, 
  Play, 
  CheckCircle2, 
  Circle, 
  Clock, 
  MessageSquare,
  FileText,
  Youtube,
  Globe,
  BookMarked,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  GraduationCap,
  Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: "video" | "reading" | "quiz";
  completed: boolean;
}

interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

interface Resource {
  id: string;
  title: string;
  type: "youtube" | "wikipedia" | "book" | "website";
  url: string;
  description: string;
}

interface Syllabus {
  university: string;
  course_code: string;
  credits: number;
  objectives: string[];
}

interface CourseData {
  id: string;
  title: string;
  description: string;
  emoji: string;
  color: string;
  progress: number;
  syllabus: Syllabus;
  modules: Module[];
  resources: Resource[];
}

// Sample course data with modules and resources
const courseData: Record<string, CourseData> = {
  "1": {
    id: "1",
    title: "Introduction to Mathematics",
    description: "Learn fundamental math concepts including algebra, geometry, and arithmetic. This comprehensive course covers everything from basic operations to advanced problem-solving techniques.",
    emoji: "📐",
    color: "from-blue-500/20 to-indigo-500/20",
    progress: 65,
    syllabus: {
      university: "MIT OpenCourseWare",
      course_code: "MATH-101",
      credits: 4,
      objectives: [
        "Understand fundamental mathematical operations",
        "Apply algebraic techniques to solve equations",
        "Analyze geometric shapes and their properties",
        "Develop problem-solving and critical thinking skills"
      ]
    },
    modules: [
      {
        id: "m1",
        title: "Module 1: Foundations of Mathematics",
        description: "Basic concepts and number systems",
        lessons: [
          { id: "1-1", title: "Numbers and Operations", duration: "15 min", type: "video", completed: true },
          { id: "1-2", title: "Properties of Numbers", duration: "20 min", type: "reading", completed: true },
          { id: "1-3", title: "Module 1 Quiz", duration: "15 min", type: "quiz", completed: true },
        ]
      },
      {
        id: "m2",
        title: "Module 2: Algebra Basics",
        description: "Introduction to algebraic expressions and equations",
        lessons: [
          { id: "1-4", title: "Basic Algebra Concepts", duration: "20 min", type: "video", completed: true },
          { id: "1-5", title: "Solving Linear Equations", duration: "25 min", type: "video", completed: true },
          { id: "1-6", title: "Practice Problems Set 1", duration: "30 min", type: "quiz", completed: true },
        ]
      },
      {
        id: "m3",
        title: "Module 3: Geometry",
        description: "Shapes, angles, and spatial reasoning",
        lessons: [
          { id: "1-7", title: "Introduction to Geometry", duration: "20 min", type: "video", completed: true },
          { id: "1-8", title: "Angles and Triangles", duration: "25 min", type: "video", completed: true },
          { id: "1-9", title: "Area and Perimeter", duration: "20 min", type: "reading", completed: false },
          { id: "1-10", title: "Practice Problems Set 2", duration: "30 min", type: "quiz", completed: false },
        ]
      },
      {
        id: "m4",
        title: "Module 4: Advanced Topics",
        description: "Quadratics and graphing",
        lessons: [
          { id: "1-11", title: "Advanced Algebra", duration: "30 min", type: "video", completed: false },
          { id: "1-12", title: "Quadratic Equations", duration: "25 min", type: "video", completed: false },
          { id: "1-13", title: "Graphing Functions", duration: "20 min", type: "reading", completed: false },
          { id: "1-14", title: "Final Assessment", duration: "45 min", type: "quiz", completed: false },
        ]
      }
    ],
    resources: [
      { id: "r1", title: "Khan Academy - Algebra Basics", type: "youtube", url: "https://youtube.com/watch?v=example1", description: "Comprehensive video series covering algebraic fundamentals" },
      { id: "r2", title: "3Blue1Brown - Essence of Linear Algebra", type: "youtube", url: "https://youtube.com/watch?v=example2", description: "Visual approach to understanding algebra" },
      { id: "r3", title: "Mathematics - Wikipedia", type: "wikipedia", url: "https://en.wikipedia.org/wiki/Mathematics", description: "Overview of mathematics concepts and history" },
      { id: "r4", title: "Algebra - Wikipedia", type: "wikipedia", url: "https://en.wikipedia.org/wiki/Algebra", description: "Detailed article on algebraic principles" },
      { id: "r5", title: "Algebra by Michael Artin", type: "book", url: "#", description: "Classic textbook for undergraduate algebra - 2nd Edition" },
      { id: "r6", title: "How to Solve It by George Pólya", type: "book", url: "#", description: "Problem-solving techniques and mathematical thinking" },
      { id: "r7", title: "Wolfram MathWorld", type: "website", url: "https://mathworld.wolfram.com", description: "Comprehensive mathematics encyclopedia" },
    ]
  },
  "2": {
    id: "2",
    title: "Science Fundamentals",
    description: "Explore physics, chemistry, and biology basics.",
    emoji: "🔬",
    color: "from-green-500/20 to-emerald-500/20",
    progress: 30,
    syllabus: {
      university: "Stanford Online",
      course_code: "SCI-101",
      credits: 3,
      objectives: [
        "Understand the scientific method",
        "Learn basic physics concepts",
        "Explore chemistry fundamentals",
        "Discover biology basics"
      ]
    },
    modules: [
      {
        id: "m1",
        title: "Module 1: Introduction to Science",
        description: "What is science and how do we study it?",
        lessons: [
          { id: "2-1", title: "What is Science?", duration: "10 min", type: "video", completed: true },
          { id: "2-2", title: "The Scientific Method", duration: "15 min", type: "video", completed: true },
        ]
      },
      {
        id: "m2",
        title: "Module 2: Physics",
        description: "Forces, motion, and energy",
        lessons: [
          { id: "2-3", title: "Introduction to Physics", duration: "20 min", type: "video", completed: true },
          { id: "2-4", title: "Forces and Motion", duration: "25 min", type: "video", completed: true },
          { id: "2-5", title: "Physics Quiz", duration: "20 min", type: "quiz", completed: true },
        ]
      },
      {
        id: "m3",
        title: "Module 3: Chemistry",
        description: "Atoms, molecules, and reactions",
        lessons: [
          { id: "2-6", title: "Introduction to Chemistry", duration: "20 min", type: "video", completed: false },
          { id: "2-7", title: "Atoms and Molecules", duration: "25 min", type: "video", completed: false },
          { id: "2-8", title: "Chemical Reactions", duration: "30 min", type: "reading", completed: false },
          { id: "2-9", title: "Chemistry Quiz", duration: "20 min", type: "quiz", completed: false },
        ]
      },
      {
        id: "m4",
        title: "Module 4: Biology",
        description: "Living organisms and ecosystems",
        lessons: [
          { id: "2-10", title: "Introduction to Biology", duration: "20 min", type: "video", completed: false },
          { id: "2-11", title: "Cells and Organisms", duration: "25 min", type: "video", completed: false },
          { id: "2-12", title: "Ecosystems", duration: "20 min", type: "reading", completed: false },
          { id: "2-13", title: "Biology Quiz", duration: "20 min", type: "quiz", completed: false },
        ]
      }
    ],
    resources: [
      { id: "r1", title: "CrashCourse Physics", type: "youtube", url: "https://youtube.com/crashcourse", description: "Engaging physics video series" },
      { id: "r2", title: "Physics - Wikipedia", type: "wikipedia", url: "https://en.wikipedia.org/wiki/Physics", description: "Comprehensive physics overview" },
      { id: "r3", title: "Chemistry LibreTexts", type: "website", url: "https://chem.libretexts.org", description: "Free chemistry textbook resources" },
    ]
  },
  "3": {
    id: "3",
    title: "English Grammar",
    description: "Master grammar rules, vocabulary, and writing skills.",
    emoji: "📚",
    color: "from-purple-500/20 to-pink-500/20",
    progress: 90,
    syllabus: {
      university: "Cambridge English",
      course_code: "ENG-101",
      credits: 3,
      objectives: [
        "Master parts of speech",
        "Understand sentence structure",
        "Apply punctuation rules correctly",
        "Develop effective writing skills"
      ]
    },
    modules: [
      {
        id: "m1",
        title: "Module 1: Parts of Speech",
        description: "Understanding the building blocks of language",
        lessons: [
          { id: "3-1", title: "Parts of Speech", duration: "15 min", type: "video", completed: true },
          { id: "3-2", title: "Nouns and Pronouns", duration: "20 min", type: "video", completed: true },
          { id: "3-3", title: "Verbs and Tenses", duration: "25 min", type: "video", completed: true },
          { id: "3-4", title: "Grammar Quiz 1", duration: "15 min", type: "quiz", completed: true },
        ]
      },
      {
        id: "m2",
        title: "Module 2: Sentence Structure",
        description: "Building effective sentences",
        lessons: [
          { id: "3-5", title: "Sentence Structure", duration: "20 min", type: "video", completed: true },
          { id: "3-6", title: "Punctuation Rules", duration: "15 min", type: "reading", completed: true },
          { id: "3-7", title: "Common Mistakes", duration: "20 min", type: "video", completed: true },
          { id: "3-8", title: "Grammar Quiz 2", duration: "15 min", type: "quiz", completed: true },
        ]
      },
      {
        id: "m3",
        title: "Module 3: Writing Skills",
        description: "Advanced writing techniques",
        lessons: [
          { id: "3-9", title: "Writing Skills", duration: "25 min", type: "video", completed: true },
          { id: "3-10", title: "Final Assessment", duration: "30 min", type: "quiz", completed: false },
        ]
      }
    ],
    resources: [
      { id: "r1", title: "English Grammar 101", type: "youtube", url: "https://youtube.com/example", description: "Complete grammar course" },
      { id: "r2", title: "Grammarly Blog", type: "website", url: "https://grammarly.com/blog", description: "Tips and tricks for better writing" },
      { id: "r3", title: "The Elements of Style", type: "book", url: "#", description: "Classic writing guide by Strunk & White" },
    ]
  }
};

const CourseView = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [searchParams] = useSearchParams();
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("modules");
  
  const course = courseId ? courseData[courseId] : null;
  
  // Read tab from URL params
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && ["modules", "syllabus", "resources"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);
  

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

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

  const allLessons = course.modules.flatMap(m => m.lessons);
  const completedLessons = allLessons.filter(l => l.completed).length;
  const nextLesson = allLessons.find(l => !l.completed);

  const getTypeIcon = (type: "video" | "reading" | "quiz") => {
    switch (type) {
      case "video": return <Play className="h-4 w-4" />;
      case "reading": return <FileText className="h-4 w-4" />;
      case "quiz": return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getResourceIcon = (type: "youtube" | "wikipedia" | "book" | "website") => {
    switch (type) {
      case "youtube": return <Youtube className="h-5 w-5 text-red-500" />;
      case "wikipedia": return <Globe className="h-5 w-5 text-blue-500" />;
      case "book": return <BookMarked className="h-5 w-5 text-amber-500" />;
      case "website": return <ExternalLink className="h-5 w-5 text-green-500" />;
    }
  };

  const getModuleProgress = (module: Module) => {
    const completed = module.lessons.filter(l => l.completed).length;
    return Math.round((completed / module.lessons.length) * 100);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activePath="/courses" />
      <main className="ml-[180px] flex-1 p-6 lg:p-8">
        <div className="mx-auto max-w-5xl">
          {/* Back button */}
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
            <Button variant="ghost" onClick={() => navigate("/courses")} className="mb-6 gap-2">
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
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-muted-foreground bg-card px-2 py-1 rounded">
                    {course.syllabus.course_code}
                  </span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">{course.syllabus.university}</span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">{course.syllabus.credits} Credits</span>
                </div>
                <h1 className="text-3xl font-bold text-foreground">{course.title}</h1>
                <p className="mt-2 text-muted-foreground">{course.description}</p>
                
                <div className="mt-6">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">
                      {completedLessons} of {allLessons.length} lessons completed
                    </span>
                    <span className="font-semibold text-primary">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-3" />
                </div>

                {nextLesson && (
                  <Button className="mt-6 gap-2">
                    <Play className="h-4 w-4" />
                    Continue: {nextLesson.title}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Tabs for Content, Syllabus, Resources */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6 w-full justify-start bg-card border border-border">
              <TabsTrigger value="modules" className="gap-2">
                <Layers className="h-4 w-4" />
                Modules
              </TabsTrigger>
              <TabsTrigger value="syllabus" className="gap-2">
                <GraduationCap className="h-4 w-4" />
                Syllabus
              </TabsTrigger>
              <TabsTrigger value="resources" className="gap-2">
                <BookMarked className="h-4 w-4" />
                Resources
              </TabsTrigger>
            </TabsList>

            {/* Modules Tab */}
            <TabsContent value="modules">
              <div className="space-y-4">
                {course.modules.map((module, moduleIndex) => {
                  const isExpanded = expandedModules.includes(module.id);
                  const moduleProgress = getModuleProgress(module);
                  const isModuleComplete = moduleProgress === 100;

                  return (
                    <motion.div
                      key={module.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: moduleIndex * 0.05 }}
                      className="rounded-xl border border-border bg-card overflow-hidden"
                    >
                      {/* Module Header */}
                      <button
                        onClick={() => toggleModule(module.id)}
                        className="w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className={`flex-shrink-0 ${isModuleComplete ? "text-primary" : "text-muted-foreground"}`}>
                          {isModuleComplete ? (
                            <CheckCircle2 className="h-6 w-6" />
                          ) : (
                            <div className="relative h-6 w-6">
                              <svg className="h-6 w-6 transform -rotate-90">
                                <circle
                                  cx="12" cy="12" r="10"
                                  className="stroke-muted fill-none"
                                  strokeWidth="2"
                                />
                                <circle
                                  cx="12" cy="12" r="10"
                                  className="stroke-primary fill-none"
                                  strokeWidth="2"
                                  strokeDasharray={`${moduleProgress * 0.628} 100`}
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 text-left">
                          <h3 className="font-semibold text-foreground">{module.title}</h3>
                          <p className="text-sm text-muted-foreground">{module.description}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-muted-foreground">
                            {module.lessons.filter(l => l.completed).length}/{module.lessons.length}
                          </span>
                          {isExpanded ? (
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                      </button>

                      {/* Module Lessons */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="border-t border-border"
                          >
                            <div className="p-2 space-y-1">
                              {module.lessons.map((lesson) => (
                                <div
                                  key={lesson.id}
                                  className={`flex items-center gap-3 p-3 rounded-lg transition-all cursor-pointer
                                    ${lesson.completed 
                                      ? "bg-primary/5" 
                                      : lesson === nextLesson
                                        ? "bg-primary/10 border border-primary"
                                        : "hover:bg-muted/50"
                                    }`}
                                >
                                  <div className={`flex-shrink-0 ${lesson.completed ? "text-primary" : "text-muted-foreground"}`}>
                                    {lesson.completed ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium text-foreground text-sm">{lesson.title}</span>
                                      {lesson === nextLesson && (
                                        <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                                          Up Next
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
                                      <span className="flex items-center gap-1">
                                        {getTypeIcon(lesson.type)}
                                        {lesson.type.charAt(0).toUpperCase() + lesson.type.slice(1)}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {lesson.duration}
                                      </span>
                                    </div>
                                  </div>
                                  <Button
                                    variant={lesson === nextLesson ? "default" : "ghost"}
                                    size="sm"
                                  >
                                    {lesson.completed ? "Review" : "Start"}
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </TabsContent>

            {/* Syllabus Tab */}
            <TabsContent value="syllabus">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-border bg-card p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <GraduationCap className="h-6 w-6 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">Course Syllabus</h2>
                </div>

                <div className="grid gap-6 md:grid-cols-3 mb-8">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground">University/Source</p>
                    <p className="font-semibold text-foreground mt-1">{course.syllabus.university}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground">Course Code</p>
                    <p className="font-semibold text-foreground mt-1">{course.syllabus.course_code}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground">Credits</p>
                    <p className="font-semibold text-foreground mt-1">{course.syllabus.credits} Credits</p>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="font-semibold text-foreground mb-4">Learning Objectives</h3>
                  <ul className="space-y-3">
                    {course.syllabus.objectives.map((objective, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-4">Module Overview</h3>
                  <div className="space-y-3">
                    {course.modules.map((module, index) => (
                      <div key={module.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                          {index + 1}
                        </span>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{module.title}</p>
                          <p className="text-sm text-muted-foreground">{module.lessons.length} lessons</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </TabsContent>

            {/* Resources Tab */}
            <TabsContent value="resources">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* YouTube Resources */}
                {course.resources.filter(r => r.type === "youtube").length > 0 && (
                  <div>
                    <h3 className="flex items-center gap-2 font-semibold text-foreground mb-4">
                      <Youtube className="h-5 w-5 text-red-500" />
                      YouTube Videos
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      {course.resources.filter(r => r.type === "youtube").map(resource => (
                        <a
                          key={resource.id}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-start gap-4 p-4 rounded-xl border border-border bg-card hover:border-red-500/50 hover:shadow-md transition-all group"
                        >
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-500/10">
                            <Youtube className="h-6 w-6 text-red-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-foreground group-hover:text-red-500 transition-colors">
                              {resource.title}
                            </h4>
                            <p className="text-sm text-muted-foreground mt-1">{resource.description}</p>
                          </div>
                          <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Wikipedia Resources */}
                {course.resources.filter(r => r.type === "wikipedia").length > 0 && (
                  <div>
                    <h3 className="flex items-center gap-2 font-semibold text-foreground mb-4">
                      <Globe className="h-5 w-5 text-blue-500" />
                      Wikipedia Articles
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      {course.resources.filter(r => r.type === "wikipedia").map(resource => (
                        <a
                          key={resource.id}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-start gap-4 p-4 rounded-xl border border-border bg-card hover:border-blue-500/50 hover:shadow-md transition-all group"
                        >
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                            <Globe className="h-6 w-6 text-blue-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-foreground group-hover:text-blue-500 transition-colors">
                              {resource.title}
                            </h4>
                            <p className="text-sm text-muted-foreground mt-1">{resource.description}</p>
                          </div>
                          <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Book Resources */}
                {course.resources.filter(r => r.type === "book").length > 0 && (
                  <div>
                    <h3 className="flex items-center gap-2 font-semibold text-foreground mb-4">
                      <BookMarked className="h-5 w-5 text-amber-500" />
                      Recommended Books
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      {course.resources.filter(r => r.type === "book").map(resource => (
                        <div
                          key={resource.id}
                          className="flex items-start gap-4 p-4 rounded-xl border border-border bg-card"
                        >
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10">
                            <BookMarked className="h-6 w-6 text-amber-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-foreground">{resource.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{resource.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Website Resources */}
                {course.resources.filter(r => r.type === "website").length > 0 && (
                  <div>
                    <h3 className="flex items-center gap-2 font-semibold text-foreground mb-4">
                      <ExternalLink className="h-5 w-5 text-green-500" />
                      Useful Websites
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      {course.resources.filter(r => r.type === "website").map(resource => (
                        <a
                          key={resource.id}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-start gap-4 p-4 rounded-xl border border-border bg-card hover:border-green-500/50 hover:shadow-md transition-all group"
                        >
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
                            <ExternalLink className="h-6 w-6 text-green-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-foreground group-hover:text-green-500 transition-colors">
                              {resource.title}
                            </h4>
                            <p className="text-sm text-muted-foreground mt-1">{resource.description}</p>
                          </div>
                          <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </TabsContent>
          </Tabs>

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
