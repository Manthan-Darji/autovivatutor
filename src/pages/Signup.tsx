import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  GraduationCap, 
  Loader2, 
  Users, 
  BookOpen, 
  School, 
  Check, 
  X, 
  Sparkles, 
  Brain, 
  Shield, 
  Zap,
  MessageCircle,
  Trophy,
  Star
} from "lucide-react";
import { cn } from "@/lib/utils";

type AppRole = "teacher" | "student";

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

const passwordRequirements: PasswordRequirement[] = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "Contains a number", test: (p) => /\d/.test(p) },
  { label: "Contains a special character (!@#$%^&*)", test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
];

// Common educational domain patterns to institution names
const eduDomainMap: Record<string, string> = {
  "harvard.edu": "Harvard University",
  "stanford.edu": "Stanford University",
  "mit.edu": "Massachusetts Institute of Technology",
  "yale.edu": "Yale University",
  "princeton.edu": "Princeton University",
  "columbia.edu": "Columbia University",
  "berkeley.edu": "University of California, Berkeley",
  "ucla.edu": "University of California, Los Angeles",
  "cornell.edu": "Cornell University",
  "upenn.edu": "University of Pennsylvania",
  "nyu.edu": "New York University",
  "uchicago.edu": "University of Chicago",
  "duke.edu": "Duke University",
  "northwestern.edu": "Northwestern University",
  "caltech.edu": "California Institute of Technology",
  "brown.edu": "Brown University",
  "dartmouth.edu": "Dartmouth College",
  "vanderbilt.edu": "Vanderbilt University",
  "rice.edu": "Rice University",
  "notredame.edu": "University of Notre Dame",
  "usc.edu": "University of Southern California",
  "umich.edu": "University of Michigan",
  "virginia.edu": "University of Virginia",
  "unc.edu": "University of North Carolina at Chapel Hill",
  "gatech.edu": "Georgia Institute of Technology",
  "utexas.edu": "University of Texas at Austin",
  "wisc.edu": "University of Wisconsin-Madison",
  "illinois.edu": "University of Illinois Urbana-Champaign",
  "purdue.edu": "Purdue University",
  "psu.edu": "Pennsylvania State University",
  "osu.edu": "Ohio State University",
  "umn.edu": "University of Minnesota",
  "ufl.edu": "University of Florida",
  "uw.edu": "University of Washington",
  "arizona.edu": "University of Arizona",
  "colorado.edu": "University of Colorado Boulder",
  "bu.edu": "Boston University",
  "bc.edu": "Boston College",
  "georgetown.edu": "Georgetown University",
  "cmu.edu": "Carnegie Mellon University",
  "jhu.edu": "Johns Hopkins University",
  "wustl.edu": "Washington University in St. Louis",
  "emory.edu": "Emory University",
  "tufts.edu": "Tufts University",
  "ucdavis.edu": "University of California, Davis",
  "uci.edu": "University of California, Irvine",
  "ucsd.edu": "University of California, San Diego",
  "ucsb.edu": "University of California, Santa Barbara",
  "ucsc.edu": "University of California, Santa Cruz",
};

// Extract school name from email domain
function detectSchoolFromEmail(email: string): string | null {
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return null;

  if (eduDomainMap[domain]) {
    return eduDomainMap[domain];
  }

  if (domain.endsWith(".edu")) {
    const parts = domain.replace(".edu", "").split(".");
    const mainPart = parts[parts.length - 1];
    if (mainPart.length > 2) {
      const formatted = mainPart.charAt(0).toUpperCase() + mainPart.slice(1);
      return `${formatted} (detected from email)`;
    }
  }

  return null;
}

const valueProps = {
  student: [
    { icon: Brain, text: "AI tutor available 24/7" },
    { icon: Sparkles, text: "Personalized learning paths" },
    { icon: Trophy, text: "Brain break games & rewards" },
  ],
  teacher: [
    { icon: Zap, text: "AI-powered course creation" },
    { icon: Users, text: "Track all students in one place" },
    { icon: Star, text: "Analytics & insights dashboard" },
  ],
};

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [schoolAutoDetected, setSchoolAutoDetected] = useState(false);
  const [role, setRole] = useState<AppRole>("student");
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleEmailChange = (newEmail: string) => {
    setEmail(newEmail);
    if (!schoolName || schoolAutoDetected) {
      const detected = detectSchoolFromEmail(newEmail);
      if (detected) {
        setSchoolName(detected.replace(" (detected from email)", ""));
        setSchoolAutoDetected(true);
      } else if (schoolAutoDetected) {
        setSchoolName("");
        setSchoolAutoDetected(false);
      }
    }
  };

  const handleSchoolNameChange = (value: string) => {
    setSchoolName(value);
    setSchoolAutoDetected(false);
  };

  const passwordValidation = useMemo(() => {
    return passwordRequirements.map((req) => ({
      ...req,
      met: req.test(password),
    }));
  }, [password]);

  const isPasswordValid = passwordValidation.every((req) => req.met);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isPasswordValid) {
      toast({
        title: "Invalid password",
        description: "Please meet all password requirements.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);

    try {
      await signUp(email, password, displayName, role, schoolName);
      toast({
        title: "Welcome aboard! 🎉",
        description: role === "student" ? "Let's start learning!" : "Ready to inspire students!",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Signup failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const ctaText = role === "student" ? "Start Learning Free" : "Start Teaching Free";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Floating AI Chat Hint */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
        className="fixed bottom-6 right-6 z-50 hidden md:flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-primary-foreground shadow-lg"
      >
        <MessageCircle className="h-4 w-4" />
        <span className="text-sm font-medium">AI Tutor ready to help!</span>
      </motion.div>

      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* Left Side - Hero Section */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-12 lg:py-0"
        >
          {/* Logo & Tagline */}
          <div className="mb-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/60 text-primary-foreground shadow-lg">
                <GraduationCap className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold text-foreground">EduAI</span>
            </div>
            <h1 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl">
              Learn Smarter,{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Not Harder
              </span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Your AI-powered learning companion. Get personalized tutoring, create courses, 
              and track progress — all in one place.
            </p>
          </div>

          {/* Value Props - Dynamic based on role */}
          <div className="mb-8 space-y-4">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              {role === "student" ? "For Students" : "For Teachers"}
            </p>
            <div className="space-y-3">
              {valueProps[role].map((prop, i) => (
                <motion.div
                  key={prop.text}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <prop.icon className="h-5 w-5" />
                  </div>
                  <span className="text-foreground">{prop.text}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Trust Badges */}
          <div className="hidden lg:block">
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-green-500" />
                <span>Secure & Private</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span>Free to Start</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-1.5">
                <Star className="h-4 w-4 text-primary" />
                <span>Pro Features Available</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 lg:px-12"
        >
          <div className="w-full max-w-md">
            <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-6 sm:p-8 shadow-xl">
              <div className="mb-6 text-center lg:text-left">
                <h2 className="text-xl font-bold text-foreground">Create your account</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Join thousands of learners today
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Role Selection */}
                <div className="space-y-2">
                  <Label>I am a...</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole("student")}
                      className={cn(
                        "flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 sm:p-4 transition-all text-center",
                        role === "student"
                          ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/20"
                          : "border-border bg-muted/30 text-muted-foreground hover:border-primary/50"
                      )}
                    >
                      <BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />
                      <span className="font-medium text-sm sm:text-base">Student</span>
                      <span className="text-[10px] leading-tight opacity-70">
                        Learn, practice & ask doubts
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole("teacher")}
                      className={cn(
                        "flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 sm:p-4 transition-all text-center",
                        role === "teacher"
                          ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/20"
                          : "border-border bg-muted/30 text-muted-foreground hover:border-primary/50"
                      )}
                    >
                      <Users className="h-5 w-5 sm:h-6 sm:w-6" />
                      <span className="font-medium text-sm sm:text-base">Teacher</span>
                      <span className="text-[10px] leading-tight opacity-70">
                        Create courses & track students
                      </span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    type="text"
                    placeholder="Your name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="h-11"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@school.edu"
                    value={email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    className="h-11"
                    required
                  />
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    We never spam or share your email
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="schoolName">School / College</Label>
                  <div className="relative">
                    <School className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="schoolName"
                      type="text"
                      placeholder="Your school or college name"
                      value={schoolName}
                      onChange={(e) => handleSchoolNameChange(e.target.value)}
                      className={cn("h-11 pl-10", schoolAutoDetected && "border-green-500/50 bg-green-500/5")}
                      required
                    />
                  </div>
                  {schoolAutoDetected && (
                    <p className="text-[10px] text-green-500 flex items-center gap-1">
                      <Check className="h-3 w-3" />
                      Auto-detected from your email
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11"
                    required
                  />
                  {password.length > 0 && (
                    <div className="mt-2 space-y-1 rounded-lg border border-border bg-muted/30 p-2.5">
                      {passwordValidation.map((req, index) => (
                        <div
                          key={index}
                          className={cn(
                            "flex items-center gap-2 text-xs transition-colors",
                            req.met ? "text-green-500" : "text-muted-foreground"
                          )}
                        >
                          {req.met ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                          <span>{req.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 text-base font-semibold mt-2" 
                  disabled={isLoading}
                  size="lg"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-5 w-5" />
                  )}
                  {ctaText}
                </Button>

                {/* Upgrade hint */}
                <p className="text-center text-[10px] text-muted-foreground">
                  Free forever • Upgrade anytime for premium features
                </p>
              </form>

              <div className="mt-6 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="font-medium text-primary hover:underline">
                  Sign in
                </Link>
              </div>

              {/* Trust & Policy */}
              <div className="mt-4 flex justify-center gap-3 text-[10px] text-muted-foreground">
                <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
                <span>•</span>
                <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
              </div>
            </div>

            {/* Mobile Trust Badges */}
            <div className="mt-6 flex justify-center lg:hidden">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Shield className="h-3.5 w-3.5 text-green-500" />
                  <span>Secure</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="h-3.5 w-3.5 text-yellow-500" />
                  <span>Free</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 text-primary" />
                  <span>Pro Available</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
