import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gamepad2, Trophy, RotateCcw, Zap, Brain, Calculator, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

type GameType = "math-blast" | "word-scramble" | "memory-match" | "quick-quiz";

interface MiniGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: (score: number) => void;
}

type MathQuestion = {
  question: string;
  answer: number;
  options: number[];
};

const generateMathQuestion = (): MathQuestion => {
  const operations = ["+", "-", "×"];
  const op = operations[Math.floor(Math.random() * operations.length)];
  let a: number, b: number, answer: number;

  switch (op) {
    case "+":
      a = Math.floor(Math.random() * 50) + 1;
      b = Math.floor(Math.random() * 50) + 1;
      answer = a + b;
      break;
    case "-":
      a = Math.floor(Math.random() * 50) + 20;
      b = Math.floor(Math.random() * 20) + 1;
      answer = a - b;
      break;
    case "×":
      a = Math.floor(Math.random() * 12) + 1;
      b = Math.floor(Math.random() * 12) + 1;
      answer = a * b;
      break;
    default:
      a = 1;
      b = 1;
      answer = 2;
  }

  // Generate wrong options
  const options = [answer];
  while (options.length < 4) {
    const wrong = answer + (Math.floor(Math.random() * 20) - 10);
    if (wrong !== answer && wrong > 0 && !options.includes(wrong)) {
      options.push(wrong);
    }
  }

  return {
    question: `${a} ${op} ${b} = ?`,
    answer,
    options: options.sort(() => Math.random() - 0.5),
  };
};

const words = [
  { scrambled: "RNAEL", answer: "LEARN", hint: "To gain knowledge" },
  { scrambled: "YTSDU", answer: "STUDY", hint: "Focus on learning" },
  { scrambled: "KBOO", answer: "BOOK", hint: "Source of knowledge" },
  { scrambled: "RBANI", answer: "BRAIN", hint: "Thinking organ" },
  { scrambled: "SMART", answer: "SMART", hint: "Intelligent" },
  { scrambled: "DIEA", answer: "IDEA", hint: "A thought" },
  { scrambled: "CSOOL", answer: "SCHOOL", hint: "Place of learning" },
  { scrambled: "TEACHRE", answer: "TEACHER", hint: "Educator" },
];

export function MiniGameModal({ isOpen, onClose, onComplete }: MiniGameModalProps) {
  const [gameType, setGameType] = useState<GameType | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  // Math Blast state
  const [mathQuestion, setMathQuestion] = useState<MathQuestion | null>(null);
  const [mathStreak, setMathStreak] = useState(0);

  // Word Scramble state
  const [currentWord, setCurrentWord] = useState<typeof words[0] | null>(null);
  const [wordGuess, setWordGuess] = useState("");
  const [wordIndex, setWordIndex] = useState(0);

  // Timer
  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameOver(true);
          setIsPlaying(false);
          onComplete?.(score);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, gameOver, score, onComplete]);

  const startGame = (type: GameType) => {
    setGameType(type);
    setScore(0);
    setTimeLeft(60);
    setIsPlaying(true);
    setGameOver(false);
    setMathStreak(0);
    setWordIndex(0);
    setWordGuess("");

    if (type === "math-blast") {
      setMathQuestion(generateMathQuestion());
    } else if (type === "word-scramble") {
      setCurrentWord(words[0]);
    }
  };

  const handleMathAnswer = (answer: number) => {
    if (!mathQuestion) return;

    if (answer === mathQuestion.answer) {
      const streakBonus = Math.floor(mathStreak / 3) * 5;
      setScore((prev) => prev + 10 + streakBonus);
      setMathStreak((prev) => prev + 1);
    } else {
      setMathStreak(0);
    }
    setMathQuestion(generateMathQuestion());
  };

  const handleWordSubmit = () => {
    if (!currentWord) return;

    if (wordGuess.toUpperCase() === currentWord.answer) {
      setScore((prev) => prev + 15);
      const nextIndex = wordIndex + 1;
      if (nextIndex < words.length) {
        setWordIndex(nextIndex);
        setCurrentWord(words[nextIndex]);
        setWordGuess("");
      } else {
        // All words completed
        setWordIndex(0);
        setCurrentWord(words[0]);
        setWordGuess("");
      }
    }
  };

  const resetGame = () => {
    setGameType(null);
    setScore(0);
    setTimeLeft(60);
    setIsPlaying(false);
    setGameOver(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md rounded-2xl bg-card border border-border shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-gradient-to-r from-primary/20 to-accent/20">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/30">
                <Gamepad2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="font-bold text-foreground">Brain Break!</h2>
                <p className="text-xs text-muted-foreground">1-minute fun challenge</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Game Content */}
          <div className="p-5">
            {!gameType ? (
              // Game Selection
              <div className="space-y-3">
                <p className="text-sm text-center text-muted-foreground mb-4">
                  Choose a quick game to refresh your mind!
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => startGame("math-blast")}
                    className="p-4 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 text-left transition-all hover:shadow-lg"
                  >
                    <Calculator className="h-8 w-8 text-blue-400 mb-2" />
                    <h3 className="font-semibold text-foreground">Math Blast</h3>
                    <p className="text-xs text-muted-foreground">Quick calculations</p>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => startGame("word-scramble")}
                    className="p-4 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-left transition-all hover:shadow-lg"
                  >
                    <Brain className="h-8 w-8 text-purple-400 mb-2" />
                    <h3 className="font-semibold text-foreground">Word Scramble</h3>
                    <p className="text-xs text-muted-foreground">Unscramble words</p>
                  </motion.button>
                </div>
              </div>
            ) : gameOver ? (
              // Game Over Screen
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-6"
              >
                <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 mb-4">
                  <Trophy className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-1">Time's Up!</h3>
                <p className="text-muted-foreground mb-4">Great brain workout!</p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary font-bold text-lg mb-6">
                  <Zap className="h-5 w-5" />
                  {score} points
                </div>
                <div className="flex gap-3 justify-center">
                  <Button variant="outline" onClick={resetGame} className="gap-2">
                    <RotateCcw className="h-4 w-4" />
                    Play Again
                  </Button>
                  <Button onClick={onClose}>
                    Back to Learning
                  </Button>
                </div>
              </motion.div>
            ) : (
              // Active Game
              <div>
                {/* Timer & Score */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Timer className="h-4 w-4 text-primary" />
                    <span className="font-mono font-bold text-foreground">{timeLeft}s</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Zap className="h-4 w-4 text-amber-500" />
                    <span className="font-bold text-foreground">{score} pts</span>
                  </div>
                </div>
                <Progress value={(timeLeft / 60) * 100} className="mb-6 h-2" />

                {gameType === "math-blast" && mathQuestion && (
                  <div className="text-center">
                    {mathStreak >= 3 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/20 text-amber-500 text-xs font-medium mb-3"
                      >
                        <Zap className="h-3 w-3" />
                        {mathStreak} streak! +{Math.floor(mathStreak / 3) * 5} bonus
                      </motion.div>
                    )}
                    <h3 className="text-3xl font-bold text-foreground mb-6 font-mono">
                      {mathQuestion.question}
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {mathQuestion.options.map((option, i) => (
                        <motion.button
                          key={i}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleMathAnswer(option)}
                          className="p-4 rounded-xl bg-secondary hover:bg-secondary/80 font-bold text-xl text-foreground transition-all"
                        >
                          {option}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {gameType === "word-scramble" && currentWord && (
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-2">Hint: {currentWord.hint}</p>
                    <h3 className="text-3xl font-bold text-primary mb-4 font-mono tracking-widest">
                      {currentWord.scrambled}
                    </h3>
                    <div className="flex gap-2 mb-4">
                      <input
                        type="text"
                        value={wordGuess}
                        onChange={(e) => setWordGuess(e.target.value.toUpperCase())}
                        onKeyDown={(e) => e.key === "Enter" && handleWordSubmit()}
                        placeholder="Type your answer..."
                        className="flex-1 px-4 py-3 rounded-xl bg-secondary border border-border text-center font-mono text-lg uppercase focus:outline-none focus:ring-2 focus:ring-primary"
                        autoFocus
                      />
                    </div>
                    <Button onClick={handleWordSubmit} className="w-full">
                      Submit
                    </Button>
                    <p className="text-xs text-muted-foreground mt-3">
                      Word {wordIndex + 1} of {words.length}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
