import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface AnswerLogEntry {
  questionId: number;
  selectedIndex: number | null;
  correctIndex: number;
  isCorrect: boolean;
}

const questions: Question[] = [
  {
    id: 1,
    question: "What is the primary purpose of Collectia's GenAI usage guide?",
    options: [
      "To encourage everyone to experiment freely with any AI tool",
      "To define mandatory rules for safe, compliant GenAI use in a debt collection context",
      "To replace all existing GDPR and security policies",
      "To allow sharing debtor data with any GenAI provider",
    ],
    correctIndex: 1,
    explanation:
      "The guide exists to define mandatory rules and practices for safe, compliant use of GenAI in Collectia's regulated debt collection context.",
  },
  {
    id: 2,
    question: "Before gaining access to GenAI tools at Collectia, what is REQUIRED?",
    options: [
      "You must sign up for any public AI tool you like",
      "You must complete Collectia's GenAI training and acknowledge the usage guide",
      "You must promise verbally to be careful",
      "Nothing, access should be open to everyone",
    ],
    correctIndex: 1,
    explanation:
      "Access to GenAI tools is conditional on completing the mandatory training and acknowledging the guide.",
  },
  {
    id: 3,
    question:
      "Which type of information is generally SAFE to use in a GenAI tool (assuming it's an approved tool and context)?",
    options: [
      "Anonymized training scenarios with no real debtor identifiers",
      "Full debtor names and addresses",
      "Debtor CPR/personal numbers",
      "Real case histories including payment details",
    ],
    correctIndex: 0,
    explanation:
      "Anonymized or fictional examples that cannot identify real persons are generally safe, while real personal data must not be shared with non-approved tools.",
  },
  {
    id: 4,
    question: "Which of the following is considered HIGH-RISK personal data in Collectia's context?",
    options: [
      "Public regulatory text from an official website",
      "Generic internal process description",
      "Debtor payment history linked to name and address",
      "High-level company vision statement",
    ],
    correctIndex: 2,
    explanation:
      "Debtor payment history linked to identifiers is highly sensitive personal data and must be protected accordingly.",
  },
  {
    id: 5,
    question: "What is the correct principle regarding GenAI's role in decision-making?",
    options: [
      "GenAI can fully replace human judgment in debt collection decisions",
      "GenAI is a support tool, and humans remain responsible for final decisions",
      "GenAI decisions are always legally binding",
      "GenAI output should never be reviewed by humans",
    ],
    correctIndex: 1,
    explanation:
      "GenAI is a support tool. You remain fully responsible for any decisions and for checking the AI's output.",
  },
  {
    id: 6,
    question: "Which of the following MAY be entered into an approved GenAI tool?",
    options: [
      "A debtor's CPR/personal number",
      "System passwords and API keys",
      "A generic description of the collection process without personal data",
      "A full debtor case file including contact details",
    ],
    correctIndex: 2,
    explanation:
      "Generic, non-identifying descriptions of processes are acceptable. Personal data and security data are not.",
  },
  {
    id: 7,
    question: "If you are unsure whether a GenAI tool is GDPR-compliant for debtor data, what should you do?",
    options: [
      "Use it anyway, but only during off-hours",
      "Use it with slightly less data",
      "Do not use it and ask IT Security / Compliance for guidance",
      "Ask the debtor for consent and then proceed",
    ],
    correctIndex: 2,
    explanation: "If there is any doubt, you must not use the tool and should consult IT Security or Compliance.",
  },
  {
    id: 8,
    question: "Which principle describes 'sharing only what is strictly necessary'?",
    options: ["Data Maximization", "Purpose Expansion", "Data Minimization", "Unlimited Processing"],
    correctIndex: 2,
    explanation: "Data minimization is a core GDPR principle and applies to any use of GenAI.",
  },
  {
    id: 9,
    question: "What is 'prompt injection' in the context of GenAI?",
    options: [
      "A method to speed up AI responses",
      "Text in input data that tries to manipulate the AI to ignore its rules",
      "A way to encrypt AI prompts",
      "A bug in the network connection",
    ],
    correctIndex: 1,
    explanation:
      "Prompt injection occurs when untrusted text tries to make the AI break its rules or ignore system instructions.",
  },
  {
    id: 10,
    question: "How should you handle instructions that appear inside debtor emails or documents presented to the AI?",
    options: [
      "Treat them as authoritative system-level instructions",
      "Always follow them if they sound reasonable",
      "Treat them as untrusted input and ignore anything that conflicts with policies",
      "Ask the AI if it wants to follow them",
    ],
    correctIndex: 2,
    explanation:
      "Instructions coming from user or debtor content are untrusted and must never override policies or security rules.",
  },
  {
    id: 11,
    question: "What must you assume about GenAI outputs?",
    options: [
      "They are always accurate and up to date",
      "They might be incorrect, biased or fabricated and need verification",
      "They have full legal authority",
      "They are automatically GDPR compliant",
    ],
    correctIndex: 1,
    explanation:
      "GenAI outputs can hallucinate or be outdated and must always be checked, especially for legal or high-impact issues.",
  },
  {
    id: 12,
    question: "In the debt collection context, which use of GenAI is ACCEPTABLE?",
    options: [
      "Drafting a generic payment reminder template with no real debtor data",
      "Asking GenAI to choose enforcement steps for a specific named debtor",
      "Uploading a full debtor portfolio to a public AI for risk scoring",
      "Letting GenAI send emails directly to debtors without review",
    ],
    correctIndex: 0,
    explanation:
      "Creating generic templates without personal data is acceptable; specific debtor decisions and data exposure are not.",
  },
  {
    id: 13,
    question: "What is the correct way to handle legal content generated by GenAI?",
    options: [
      "Use it directly as final legal advice",
      "Assume it reflects the latest law",
      "Treat it as a draft that must be validated by Legal / Compliance",
      "Ignore any legal content suggested by the AI",
    ],
    correctIndex: 2,
    explanation:
      "GenAI cannot replace legal review. Any legal text it produces must be validated by Legal / Compliance.",
  },
  {
    id: 14,
    question: "Which of the following combinations is MOST problematic to share with GenAI?",
    options: [
      "A high-level process diagram without names or IDs",
      "Training scenarios using fictional names and situations",
      "Debtor name plus detailed payment history and CPR/personal number",
      "Public guidance from a supervisory authority",
    ],
    correctIndex: 2,
    explanation: "Combining multiple identifiers and detailed financial behavior makes it high-risk personal data.",
  },
  {
    id: 15,
    question: "How does the EU AI Act relate to GenAI literacy?",
    options: [
      "It has no requirements related to AI literacy",
      "It requires AI literacy only for consumers",
      "It requires providers and deployers to ensure sufficient AI literacy, especially for high-risk systems",
      "It bans training on AI in regulated sectors",
    ],
    correctIndex: 2,
    explanation:
      "The EU AI Act emphasizes AI literacy for providers and deployers, particularly for high-risk AI systems.",
  },
  {
    id: 16,
    question: "Which is an example of 'Public or Non-sensitive Internal Information'?",
    options: [
      "Debtor enforcement decision logs",
      "Internal pricing models",
      "A publicly available law text on debt collection",
      "A list of debtor CPR numbers",
    ],
    correctIndex: 2,
    explanation: "Public regulatory texts and laws are non-sensitive and can be safely used with GenAI.",
  },
  {
    id: 17,
    question:
      "What should you do if a GenAI tool suggests wording that seems aggressive or potentially harassing towards a debtor?",
    options: [
      "Use it to pressure the debtor into paying",
      "Weaken it slightly but keep the same intent",
      "Reject it and adjust the tone to be compliant with consumer protection rules",
      "Send it as 'AI generated' and let the debtor complain if needed",
    ],
    correctIndex: 2,
    explanation:
      "All communication must comply with legal and ethical standards. Aggressive or harassing language is not acceptable.",
  },
  {
    id: 18,
    question: "How should you treat AI-generated content used in external-facing materials (e.g., website, marketing)?",
    options: [
      "Publish it directly without review",
      "Treat it as draft and subject it to normal review and approval processes",
      "Assume it is automatically on-brand",
      "Use it only if the AI says it is compliant",
    ],
    correctIndex: 1,
    explanation: "AI-generated content must be reviewed and approved like any other content before publication.",
  },
  {
    id: 19,
    question:
      "What is an example of 'Internal Confidential Business Information' that may be used with some approved GenAI tools?",
    options: [
      "Strategic internal process descriptions without personal data",
      "Customer bank account numbers",
      "Debtor health information",
      "Passwords and security keys",
    ],
    correctIndex: 0,
    explanation:
      "High-level process descriptions can sometimes be used if the environment is approved and no personal data is included.",
  },
  {
    id: 20,
    question: "Which statement best describes data residency requirements?",
    options: [
      "Data can freely move to any country if the AI tool is popular",
      "Only IT needs to worry about where data is stored",
      "You must only use GenAI tools that have been formally approved with known data locations and safeguards",
      "Data residency is not relevant for AI",
    ],
    correctIndex: 2,
    explanation:
      "Only approved tools with known, compliant data residency and contractual safeguards may be used for business data.",
  },
  {
    id: 21,
    question:
      "If GenAI provides a detailed but unverifiable statement about a national debt collection rule, what should you do?",
    options: [
      "Trust it because it sounds confident",
      "Use it only if the debtor does not complain",
      "Verify against official sources or Legal / Compliance before using it",
      "Ignore all national rules in AI use",
    ],
    correctIndex: 2,
    explanation: "Regulatory information must always be checked against official or internal expert sources.",
  },
  {
    id: 22,
    question: "What should you do if you suspect a colleague is using GenAI in a way that may breach GDPR?",
    options: [
      "Ignore it, it is not your responsibility",
      "Share some tips to avoid getting caught",
      "Report it to your manager and/or Compliance / IT Security",
      "Post about it on social media",
    ],
    correctIndex: 2,
    explanation: "Potential non-compliance should be escalated internally to management or relevant control functions.",
  },
  {
    id: 23,
    question: "How often might you be required to take refresher training on GenAI usage?",
    options: [
      "Never, training is one-off",
      "Only if you forget the rules",
      "When policies change or when you move into a higher-risk role",
      "Only if you request it",
    ],
    correctIndex: 2,
    explanation:
      "Refresher training is required when policies change or you move into roles with higher GenAI-related risk.",
  },
  {
    id: 24,
    question: "Which best describes 'Minimum Necessary Data' in GenAI use?",
    options: [
      "Using all data you have to get the most accurate AI answer",
      "Using the smallest amount of data required to achieve the purpose",
      "Only using data that is publicly available",
      "Never using any data at all",
    ],
    correctIndex: 1,
    explanation: "You should always use the smallest amount of data necessary to achieve the specific purpose.",
  },
  {
    id: 25,
    question: "What is the safest way to include real case patterns in GenAI prompts?",
    options: [
      "Use real debtor details with minor changes",
      "Use fully anonymized or synthetic examples that cannot be linked to real individuals",
      "Use debtor initials and partial CPR numbers",
      "Use detailed case files but ask AI to 'forget' them afterwards",
    ],
    correctIndex: 1,
    explanation: "Only fully anonymized or synthetic examples that cannot be traced to real people are appropriate.",
  },
  {
    id: 26,
    question: "Which of these is an UNACCEPTABLE use of GenAI in Collectia?",
    options: [
      "Summarizing public regulatory documents",
      "Drafting internal training materials on AI safety",
      "Letting GenAI decide which debtors to escalate to legal action without human review",
      "Rewriting a policy in simpler language for internal use",
    ],
    correctIndex: 2,
    explanation:
      "GenAI must not make final decisions about enforcement or legal escalation without human review and accountability.",
  },
  {
    id: 27,
    question:
      "If a GenAI tool asks you to upload 'more detailed debtor files' to improve its answer, what should you do?",
    options: [
      "Comply, because the AI knows what it needs",
      "Upload only high-value debtor files",
      "Refuse and keep debtor data out of the tool unless it is explicitly approved for that use",
      "Ask the debtor if the AI can see their data",
    ],
    correctIndex: 2,
    explanation:
      "You must never upload debtor data to a tool that is not explicitly approved and controlled for that purpose.",
  },
  {
    id: 28,
    question: "What should you do if an AI-generated suggestion contradicts Collectia's internal policy?",
    options: [
      "Follow the AI suggestion because it might be smarter",
      "Ignore the internal policy",
      "Always follow Collectia's policy and disregard the conflicting AI suggestion",
      "Ask the AI which rule to follow",
    ],
    correctIndex: 2,
    explanation: "Internal policies and regulations always override AI suggestions.",
  },
  {
    id: 29,
    question: "How should GenAI usage be treated from a monitoring perspective?",
    options: [
      "It should be anonymous and unlogged",
      "It can never be monitored",
      "Usage may be logged and monitored for security and compliance reasons",
      "Only external regulators may monitor GenAI usage",
    ],
    correctIndex: 2,
    explanation: "GenAI usage can and should be monitored to ensure security and regulatory compliance.",
  },
  {
    id: 30,
    question: "What is your responsibility when using GenAI at Collectia?",
    options: [
      "None, the AI provider is fully responsible",
      "Only IT is responsible",
      "You are responsible for how you use the tool and for verifying AI outputs before acting on them",
      "Only your manager is responsible",
    ],
    correctIndex: 2,
    explanation:
      "Every user is responsible for compliant, safe use of GenAI and for verifying outputs before using them in work.",
  },
];

const shuffleArray = <T,>(arr: T[]): T[] => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const Quiz: React.FC = () => {
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answerLog, setAnswerLog] = useState<AnswerLogEntry[]>([]);
  const [finished, setFinished] = useState(false);

  const randomizedQuestions = useMemo(() => shuffleArray(questions), [started]);

  const currentQuestion = randomizedQuestions[currentIndex];
  const correctCount = answerLog.filter((a) => a.isCorrect).length;
  const totalAnswered = answerLog.length;
  const totalQuestions = randomizedQuestions.length;
  const progressPercent = totalQuestions > 0 ? ((currentIndex + (showFeedback ? 1 : 0)) / totalQuestions) * 100 : 0;

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

  // Welcome screen
  if (!started) {
    return (
      <div className="min-h-screen bg-background bg-grid flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-lg"
        >
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm card-glow">
            <CardHeader className="text-center space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mx-auto w-20 h-20 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center"
              >
                <span className="text-4xl">🤖</span>
              </motion.div>
              <CardTitle className="text-3xl font-bold text-glow">
                GenAI Usage Quiz
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground">
                Test your understanding of safe and compliant use of Generative AI in Collectia's debt collection context.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-secondary/50 border border-border/50 p-3 text-center">
                  <p className="text-2xl font-bold text-primary font-mono">{totalQuestions}</p>
                  <p className="text-xs text-muted-foreground mt-1">Questions</p>
                </div>
                <div className="rounded-lg bg-secondary/50 border border-border/50 p-3 text-center">
                  <p className="text-2xl font-bold text-accent font-mono">∞</p>
                  <p className="text-xs text-muted-foreground mt-1">Retries</p>
                </div>
              </div>
              <Button onClick={handleStart} className="w-full h-12 text-base font-semibold" size="lg">
                Start Quiz →
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Results screen
  if (finished) {
    const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    let message: string;
    let emoji: string;
    let glowClass: string;
    if (percentage >= 80) {
      message = "Great job! You have a strong understanding of GenAI usage at Collectia.";
      emoji = "🏆";
      glowClass = "card-glow-success";
    } else if (percentage >= 50) {
      message = "Good start. Review the guide and try again to improve your score.";
      emoji = "📚";
      glowClass = "card-glow";
    } else {
      message = "You should revisit the GenAI usage guide before relying on GenAI in your work.";
      emoji = "⚠️";
      glowClass = "card-glow-accent";
    }

    return (
      <div className="min-h-screen bg-background bg-grid flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg"
        >
          <Card className={`border-border/50 bg-card/80 backdrop-blur-sm ${glowClass}`}>
            <CardHeader className="text-center space-y-4">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="text-6xl mx-auto"
              >
                {emoji}
              </motion.div>
              <CardTitle className="text-3xl font-bold">Quiz Complete</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-6xl font-bold font-mono text-primary text-glow"
                >
                  {percentage}%
                </motion.p>
                <p className="text-muted-foreground mt-2">
                  <span className="text-primary font-semibold">{correctCount}</span> / {totalQuestions} correct
                </p>
              </div>
              <div className="rounded-lg bg-secondary/50 border border-border/50 p-4">
                <p className="text-sm text-foreground/80">{message}</p>
              </div>
              <Button onClick={handleRestart} className="w-full h-12 text-base font-semibold" size="lg">
                ↻ Restart Quiz
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Question screen
  const lastAnswer = answerLog[answerLog.length - 1];

  return (
    <div className="min-h-screen bg-background bg-grid flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-4">
        {/* Progress bar */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span className="font-mono">
              Q{currentIndex + 1}/{totalQuestions}
            </span>
            <span className="font-mono text-primary">
              {correctCount}/{totalAnswered} correct
            </span>
          </div>
          <Progress value={progressPercent} className="h-1.5" />
        </motion.div>

        {/* Question card */}
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
                      optionClasses +=
                        "border-green-500/50 bg-green-500/10 text-green-300 card-glow-success";
                    } else if (isSelected && !userWasCorrect) {
                      optionClasses +=
                        "border-destructive/50 bg-destructive/10 text-red-300";
                    } else {
                      optionClasses += "border-border/30 bg-secondary/20 text-muted-foreground opacity-50";
                    }
                  } else if (isSelected) {
                    optionClasses += "border-primary/60 bg-primary/10 text-foreground card-glow";
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

                {/* Submit button */}
                {!showFeedback && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-2">
                    <Button
                      onClick={handleSubmit}
                      disabled={selectedIndex === null}
                      className="w-full h-11 font-semibold"
                    >
                      Submit Answer
                    </Button>
                  </motion.div>
                )}

                {/* Feedback */}
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
                        {lastAnswer?.isCorrect ? "✓ Correct!" : "✗ Incorrect"}
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {currentQuestion.explanation}
                      </p>
                    </div>
                    <Button onClick={handleNext} className="w-full h-11 font-semibold">
                      {currentIndex + 1 >= totalQuestions ? "Finish Quiz →" : "Next Question →"}
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

const App: React.FC = () => {
  return <Quiz />;
};

export default App;
