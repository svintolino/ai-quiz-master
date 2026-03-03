// src/Quiz.tsx
import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LangCode, languageConfigs } from "./i18n";
import { questions } from "./quizQuestions";

const shuffleArray = <T,>(arr: T[]): T[] => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

interface AnswerLogEntry {
  questionId: number;
  selectedIndex: number | null;
  correctIndex: number;
  isCorrect: boolean;
}

interface QuizProps {
  lang: LangCode;
  onBackToTraining: () => void;
}

export const Quiz: React.FC<QuizProps> = ({ lang, onBackToTraining }) => {
  const langConfig = languageConfigs.find((l) => l.code === lang) ?? languageConfigs[0];
  const t = langConfig.t;

  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answerLog, setAnswerLog] = useState<AnswerLogEntry[]>([]);
  const [finished, setFinished] = useState(false);

  const randomizedQuestions = useMemo(() => shuffleArray(questions), []);

  const currentQuestion = randomizedQuestions[currentIndex];
  const correctCount = answerLog.filter((a) => a.isCorrect).length;
  const totalAnswered = answerLog.length;
  const totalQuestions = randomizedQuestions.length;
  const progressPercent =
    totalQuestions > 0 ? ((currentIndex + (showFeedback ? 1 : 0)) / totalQuestions) * 100 : 0;

  const handleStart = () => {
    setStarted(true);
    setCurrentIndex(0);
    setSelectedIndex(null);
    setShowFeedback(false);
    setAnswerLog([]);
    setFinished(false);
  };

  const handleSubmit = () => {
    if (selectedIndex === null || showFeedback) return;
    const isCorrect = selectedIndex === currentQuestion.correctIndex;
    setAnswerLog((prev) => [
      ...prev,
      { questionId: currentQuestion.id, selectedIndex, correctIndex: currentQuestion.correctIndex, isCorrect },
    ]);
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (!showFeedback) return;
    if (currentIndex + 1 >= totalQuestions) {
      setFinished(true);
      return;
    }
    setCurrentIndex((prev) => prev + 1);
    setSelectedIndex(null);
    setShowFeedback(false);
  };

  const handleRestart = () => {
    setStarted(false);
    setCurrentIndex(0);
    setSelectedIndex(null);
    setShowFeedback(false);
    setAnswerLog([]);
    setFinished(false);
  };

  if (!started) {
    return (
      <div className="min-h-screen bg-background bg-grid flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-lg"
        >
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mx-auto w-20 h-20 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center"
              >
                <span className="text-4xl">🤖</span>
              </motion.div>
              <CardTitle className="text-3xl font-bold">{t.quizTitle}</CardTitle>
              <CardDescription className="text-base text-muted-foreground">
                {t.quizIntro}{" "}
                {lang !== "en" && "(Questions are in English; explanations are also in English.)"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-secondary/50 border border-border/50 p-3 text-center">
                  <p className="text-2xl font-bold text-primary font-mono">{totalQuestions}</p>
                  <p className="text-xs text-muted-foreground mt-1">{t.quizQuestionsLabel}</p>
                </div>
                <div className="rounded-lg bg-secondary/50 border border-border/50 p-3 text-center">
                  <p className="text-2xl font-bold text-accent font-mono">∞</p>
                  <p className="text-xs text-muted-foreground mt-1">{t.quizRetriesLabel}</p>
                </div>
              </div>
              <Button onClick={handleStart} className="w-full h-12 text-base font-semibold" size="lg">
                {t.quizStartButton}
              </Button>
              <Button
                variant="outline"
                className="w-full h-10 text-xs mt-1"
                onClick={onBackToTraining}
              >
                {t.backToTraining}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (finished) {
    const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    let message: string;
    let emoji: string;
    if (percentage >= 80) {
      message = t.quizGreatJob;
      emoji = "🏆";
    } else if (percentage >= 50) {
      message = t.quizGoodStart;
      emoji = "📚";
    } else {
      message = t.quizNeedsReview;
      emoji = "⚠️";
    }

    return (
      <div className="min-h-screen bg-background bg-grid flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg"
        >
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center space-y-4">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="text-6xl mx-auto"
              >
                {emoji}
              </motion.div>
              <CardTitle className="text-3xl font-bold">{t.quizCompleteTitle}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-6xl font-bold font-mono text-primary"
                >
                  {percentage}%
                </motion.p>
                <p className="text-muted-foreground mt-2">
                  <span className="text-primary font-semibold">{correctCount}</span>{" "}
                  {t.quizScoreSummary} {totalQuestions}
                </p>
              </div>
              <div className="rounded-lg bg-secondary/50 border border-border/50 p-4">
                <p className="text-sm text-foreground/80">{message}</p>
              </div>
              <div className="space-y-2">
                <Button onClick={handleRestart} className="w-full h-12 text-base font-semibold" size="lg">
                  {t.quizRestart}
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-10 text-xs"
                  onClick={onBackToTraining}
                >
                  {t.backToTraining}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  const lastAnswer = answerLog[answerLog.length - 1];

  return (
    <div className="min-h-screen bg-background bg-grid flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-4">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span className="font-mono">
              {t.quizQuestionShort} {currentIndex + 1}/{totalQuestions}
            </span>
            <span className="font-mono text-primary">
              {correctCount}/{totalAnswered || 0} {t.quizCorrectShort}
            </span>
          </div>
          <Progress value={progressPercent} className="h-1.5" />
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl leading-relaxed font-medium">
                  {currentQuestion.question}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = selectedIndex === index;
                  const isCorrect = index === currentQuestion.correctIndex;
                  const userWasCorrect = lastAnswer?.isCorrect;

                  let optionClasses =
                    "w-full text-left p-4 rounded-lg border transition-all duration-200 text-sm leading-relaxed ";

                  if (showFeedback) {
                    if (isCorrect) {
                      optionClasses += "border-green-500/50 bg-green-500/10 text-green-300";
                    } else if (isSelected && !userWasCorrect) {
                      optionClasses += "border-destructive/50 bg-destructive/10 text-red-300";
                    } else {
                      optionClasses +=
                        "border-border/30 bg-secondary/20 text-muted-foreground opacity-50";
                    }
                  } else if (isSelected) {
                    optionClasses += "border-primary/60 bg-primary/10 text-foreground";
                  } else {
                    optionClasses +=
                      "border-border/40 bg-secondary/30 text-foreground/80 hover:border-primary/40 hover:bg-primary/5 cursor-pointer";
                  }

                  return (
                    <motion.button
                      key={index}
                      whileHover={!showFeedback ? { scale: 1.01 } : undefined}
                      whileTap={!showFeedback ? { scale: 0.99 } : undefined}
                      onClick={() => !showFeedback && setSelectedIndex(index)}
                      className={optionClasses}
                      disabled={showFeedback}
                    >
                      <span className="flex gap-3 items-start">
                        <span className="shrink-0 w-6 h-6 rounded-full border border-current/30 flex items-center justify-center text-xs font-mono font-bold mt-0.5">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span>{option}</span>
                      </span>
                    </motion.button>
                  );
                })}

                {!showFeedback && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-2">
                    <Button
                      onClick={handleSubmit}
                      disabled={selectedIndex === null}
                      className="w-full h-11 font-semibold"
                    >
                      {t.quizSubmit}
                    </Button>
                  </motion.div>
                )}

                {showFeedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3 pt-2"
                  >
                    <div
                      className={`rounded-lg p-4 border ${
                        lastAnswer?.isCorrect
                          ? "border-green-500/30 bg-green-500/5"
                          : "border-destructive/30 bg-destructive/5"
                      }`}
                    >
                      <p
                        className={`font-bold text-sm mb-1 ${
                          lastAnswer?.isCorrect ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {lastAnswer?.isCorrect ? t.quizCorrectLabel : t.quizIncorrectLabel}
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {currentQuestion.explanation}
                      </p>
                    </div>
                    <Button onClick={handleNext} className="w-full h-11 font-semibold">
                      {currentIndex + 1 >= totalQuestions ? t.quizFinishQuiz : t.quizNextQuestion}
                    </Button>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};