import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { GraduationCap, Loader2, Users, BookOpen, School, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

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

  // Direct match
  if (eduDomainMap[domain]) {
    return eduDomainMap[domain];
  }

  // Check for .edu domain and format nicely
  if (domain.endsWith(".edu")) {
    // Try to extract institution name from subdomain patterns
    const parts = domain.replace(".edu", "").split(".");
    const mainPart = parts[parts.length - 1];
    
    // Format as title case with "University" suffix if it looks like an institution
    if (mainPart.length > 2) {
      const formatted = mainPart.charAt(0).toUpperCase() + mainPart.slice(1);
      return `${formatted} (detected from email)`;
    }
  }

  return null;
}

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

  // Auto-detect school from email
  const handleEmailChange = (newEmail: string) => {
    setEmail(newEmail);
    
    // Only auto-fill if user hasn't manually edited the school name
    if (!schoolName || schoolAutoDetected) {
      const detected = detectSchoolFromEmail(newEmail);
      if (detected) {
        setSchoolName(detected.replace(" (detected from email)", ""));
        setSchoolAutoDetected(true);
      } else if (schoolAutoDetected) {
        // Clear auto-detected value if email no longer matches
        setSchoolName("");
        setSchoolAutoDetected(false);
      }
    }
  };

  const handleSchoolNameChange = (value: string) => {
    setSchoolName(value);
    setSchoolAutoDetected(false); // User manually edited
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
        title: "Account created!",
        description: "You can now start learning.",
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

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/60 text-primary-foreground shadow-lg">
            <GraduationCap className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Create Account</h1>
          <p className="mt-1 text-muted-foreground">Join as a teacher or student</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection */}
            <div className="space-y-2">
              <Label>I am a...</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("student")}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all text-center",
                    role === "student"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-muted/30 text-muted-foreground hover:border-primary/50"
                  )}
                >
                  <BookOpen className="h-6 w-6" />
                  <span className="font-medium">Student</span>
                  <span className="text-[10px] leading-tight opacity-70">
                    Learn, practice & ask doubts
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("teacher")}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all text-center",
                    role === "teacher"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-muted/30 text-muted-foreground hover:border-primary/50"
                  )}
                >
                  <Users className="h-6 w-6" />
                  <span className="font-medium">Teacher</span>
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
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="schoolName">School / College Name</Label>
              <div className="relative">
                <School className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="schoolName"
                  type="text"
                  placeholder="Your school or college name"
                  value={schoolName}
                  onChange={(e) => handleSchoolNameChange(e.target.value)}
                  className={cn("pl-10", schoolAutoDetected && "border-green-500/50 bg-green-500/5")}
                  required
                />
                {schoolAutoDetected && (
                  <p className="mt-1 text-xs text-green-500">
                    ✓ Auto-detected from your email
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@school.edu"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {password.length > 0 && (
                <div className="mt-2 space-y-1.5 rounded-lg border border-border bg-muted/30 p-3">
                  {passwordValidation.map((req, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex items-center gap-2 text-sm transition-colors",
                        req.met ? "text-green-500" : "text-muted-foreground"
                      )}
                    >
                      {req.met ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                      <span>{req.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
