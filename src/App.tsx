import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type LangCode = "en" | "da" | "sv" | "no" | "fi" | "de";

interface TrainingSection {
  id: number;
  title: string;
  text: string;
  mediaUrl: string;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface LanguageConfig {
  code: LangCode;
  label: string;
  flag: string;
  t: {
    // Training
    appTitle: string;
    introLead: string;
    startButton: string;
    sectionPrefix: string;
    sectionOf: string;
    trainingLabel: string;
    autoNarrationHint: string;
    quizButton: string;
    prevSection: string;
    nextSection: string;
    chooseLanguage: string;
    trainingBullets: string[];

    // Quiz UI
    quizTitle: string;
    quizIntro: string;
    quizStartButton: string;
    quizQuestionsLabel: string;
    quizRetriesLabel: string;
    quizQuestionShort: string;
    quizCorrectShort: string;
    quizSubmit: string;
    quizNextQuestion: string;
    quizFinishQuiz: string;
    quizCorrectLabel: string;
    quizIncorrectLabel: string;
    quizCompleteTitle: string;
    quizScoreSummary: string;
    quizGreatJob: string;
    quizGoodStart: string;
    quizNeedsReview: string;
    quizRestart: string;
    backToTraining: string;
  };
  ttsLang: string;
}

// Collectia‑like color palette
const COLORS = {
  teal: "#00B894",
  darkBlue: "#0B1727",
  mint: "#C8FFF4",
  mintSoft: "#E1FFFA",
  tealSoft: "#5EF2CF",
  white: "#FFFFFF",
};

const languageConfigs: LanguageConfig[] = [
  {
    code: "en",
    label: "English (EN)",
    flag: "🇬🇧",
    t: {
      appTitle: "GenAI Mandatory Training",
      introLead: "Choose language and complete the mandatory training on safe and compliant use of GenAI at Collectia.",
      startButton: "Start training",
      sectionPrefix: "Section",
      sectionOf: "of",
      trainingLabel: "GenAI Training",
      autoNarrationHint: "The text is read out automatically. You can also read along below.",
      quizButton: "Go to GenAI quiz",
      prevSection: "← Previous section",
      nextSection: "Next section →",
      chooseLanguage: "Choose language",
      trainingBullets: [
        "Training is mandatory before you can access GenAI tools.",
        "Each section is narrated automatically.",
        "You will finish with a short GenAI quiz.",
      ],
      quizTitle: "GenAI Quiz",
      quizIntro: "Test your understanding of safe and compliant use of GenAI in Collectia's debt collection context.",
      quizStartButton: "Start quiz →",
      quizQuestionsLabel: "Questions",
      quizRetriesLabel: "Retries",
      quizQuestionShort: "Question",
      quizCorrectShort: "correct",
      quizSubmit: "Submit answer",
      quizNextQuestion: "Next question →",
      quizFinishQuiz: "Finish quiz →",
      quizCorrectLabel: "✓ Correct!",
      quizIncorrectLabel: "✗ Incorrect",
      quizCompleteTitle: "Quiz complete",
      quizScoreSummary: "correct out of",
      quizGreatJob: "Great job! You have a strong understanding of GenAI usage at Collectia.",
      quizGoodStart: "Good start. Review the guide and try the quiz again to improve your score.",
      quizNeedsReview: "You should revisit the GenAI usage guide before relying on GenAI in your work.",
      quizRestart: "↻ Restart quiz",
      backToTraining: "← Back to training",
    },
    ttsLang: "en-GB",
  },
  {
    code: "da",
    label: "Dansk (DK)",
    flag: "🇩🇰",
    t: {
      appTitle: "GenAI Obligatorisk Træning",
      introLead: "Vælg sprog og start den obligatoriske træning i sikker og compliant brug af GenAI hos Collectia.",
      startButton: "Start træning",
      sectionPrefix: "Afsnit",
      sectionOf: "af",
      trainingLabel: "GenAI‑træning",
      autoNarrationHint: "Teksten læses automatisk op. Du kan også læse med nedenfor.",
      quizButton: "Gå til GenAI‑quiz",
      prevSection: "← Forrige afsnit",
      nextSection: "Næste afsnit →",
      chooseLanguage: "Vælg sprog",
      trainingBullets: [
        "Træningen er obligatorisk før adgang til GenAI‑værktøjer.",
        "Hvert afsnit bliver læst op automatisk.",
        "Du afslutter med en kort GenAI‑quiz.",
      ],
      quizTitle: "GenAI‑quiz",
      quizIntro: "Test din forståelse af sikker og compliant brug af GenAI i Collectias inkassokontekst.",
      quizStartButton: "Start quiz →",
      quizQuestionsLabel: "Spørgsmål",
      quizRetriesLabel: "Forsøg",
      quizQuestionShort: "Spørgsmål",
      quizCorrectShort: "korrekte",
      quizSubmit: "Indsend svar",
      quizNextQuestion: "Næste spørgsmål →",
      quizFinishQuiz: "Afslut quiz →",
      quizCorrectLabel: "✓ Korrekt!",
      quizIncorrectLabel: "✗ Forkert",
      quizCompleteTitle: "Quiz gennemført",
      quizScoreSummary: "rigtige ud af",
      quizGreatJob: "Flot arbejde! Du har en stærk forståelse af GenAI‑brug i Collectia.",
      quizGoodStart: "God start. Gennemgå retningslinjen igen og prøv quizzen en gang til.",
      quizNeedsReview: "Du bør læse GenAI‑retningslinjen igen, før du anvender GenAI i dit arbejde.",
      quizRestart: "↻ Start quiz igen",
      backToTraining: "← Tilbage til træning",
    },
    ttsLang: "da-DK",
  },
  {
    code: "sv",
    label: "Svenska (SE)",
    flag: "🇸🇪",
    t: {
      appTitle: "Obligatorisk GenAI‑utbildning",
      introLead:
        "Välj språk och starta den obligatoriska utbildningen i säker och compliant användning av GenAI hos Collectia.",
      startButton: "Starta utbildning",
      sectionPrefix: "Avsnitt",
      sectionOf: "av",
      trainingLabel: "GenAI‑utbildning",
      autoNarrationHint: "Texten läses upp automatiskt. Du kan också läsa med nedan.",
      quizButton: "Gå till GenAI‑quiz",
      prevSection: "← Föregående avsnitt",
      nextSection: "Nästa avsnitt →",
      chooseLanguage: "Välj språk",
      trainingBullets: [
        "Utbildningen är obligatorisk innan du får tillgång till GenAI‑verktyg.",
        "Varje avsnitt läses upp automatiskt.",
        "Du avslutar med ett kort GenAI‑quiz.",
      ],
      quizTitle: "GenAI‑quiz",
      quizIntro: "Testa din förståelse för säker och compliant användning av GenAI i Collectias inkassomiljö.",
      quizStartButton: "Starta quiz →",
      quizQuestionsLabel: "Frågor",
      quizRetriesLabel: "Försök",
      quizQuestionShort: "Fråga",
      quizCorrectShort: "rätt",
      quizSubmit: "Skicka svar",
      quizNextQuestion: "Nästa fråga →",
      quizFinishQuiz: "Avsluta quiz →",
      quizCorrectLabel: "✓ Rätt!",
      quizIncorrectLabel: "✗ Fel",
      quizCompleteTitle: "Quiz färdig",
      quizScoreSummary: "rätt av",
      quizGreatJob: "Mycket bra! Du har god förståelse för GenAI‑användning hos Collectia.",
      quizGoodStart: "Bra början. Läs riktlinjen igen och försök quizet en gång till.",
      quizNeedsReview: "Du bör gå igenom GenAI‑riktlinjen igen innan du förlitar dig på GenAI i ditt arbete.",
      quizRestart: "↻ Starta quiz igen",
      backToTraining: "← Tillbaka till utbildningen",
    },
    ttsLang: "sv-SE",
  },
  {
    code: "no",
    label: "Norsk (NO)",
    flag: "🇳🇴",
    t: {
      appTitle: "Obligatorisk GenAI‑opplæring",
      introLead: "Velg språk, og start den obligatoriske opplæringen i trygg og compliant bruk av GenAI i Collectia.",
      startButton: "Start opplæring",
      sectionPrefix: "Del",
      sectionOf: "av",
      trainingLabel: "GenAI‑opplæring",
      autoNarrationHint: "Teksten leses automatisk opp. Du kan også lese under.",
      quizButton: "Gå til GenAI‑quiz",
      prevSection: "← Forrige del",
      nextSection: "Neste del →",
      chooseLanguage: "Velg språk",
      trainingBullets: [
        "Opplæringen er obligatorisk før du får tilgang til GenAI‑verktøy.",
        "Hver del blir lest opp automatisk.",
        "Du avslutter med en kort GenAI‑quiz.",
      ],
      quizTitle: "GenAI‑quiz",
      quizIntro: "Test forståelsen din av trygg og compliant bruk av GenAI i Collectias inkassokontekst.",
      quizStartButton: "Start quiz →",
      quizQuestionsLabel: "Spørsmål",
      quizRetriesLabel: "Forsøk",
      quizQuestionShort: "Spørsmål",
      quizCorrectShort: "riktige",
      quizSubmit: "Send inn svar",
      quizNextQuestion: "Neste spørsmål →",
      quizFinishQuiz: "Fullfør quiz →",
      quizCorrectLabel: "✓ Riktig!",
      quizIncorrectLabel: "✗ Feil",
      quizCompleteTitle: "Quiz fullført",
      quizScoreSummary: "riktige av",
      quizGreatJob: "Veldig bra! Du har god forståelse av GenAI‑bruk i Collectia.",
      quizGoodStart: "God start. Les retningslinjene på nytt og prøv quizzen igjen.",
      quizNeedsReview: "Du bør lese GenAI‑retningslinjene på nytt før du stoler på GenAI i arbeidet ditt.",
      quizRestart: "↻ Start quiz på nytt",
      backToTraining: "← Tilbake til opplæringen",
    },
    ttsLang: "nb-NO",
  },
  {
    code: "fi",
    label: "Suomi (FI)",
    flag: "🇫🇮",
    t: {
      appTitle: "Pakollinen GenAI‑koulutus",
      introLead:
        "Valitse kieli ja aloita pakollinen koulutus GenAI:n turvallisesta ja vaatimustenmukaisesta käytöstä Collectialla.",
      startButton: "Aloita koulutus",
      sectionPrefix: "Osa",
      sectionOf: "/",
      trainingLabel: "GenAI‑koulutus",
      autoNarrationHint: "Teksti luetaan automaattisesti. Voit myös lukea sen alta.",
      quizButton: "Siirry GenAI‑testiin",
      prevSection: "← Edellinen osa",
      nextSection: "Seuraava osa →",
      chooseLanguage: "Valitse kieli",
      trainingBullets: [
        "Koulutus on pakollinen ennen GenAI‑työkalujen käyttöä.",
        "Jokainen osa luetaan automaattisesti ääneen.",
        "Lopuksi suoritat lyhyen GenAI‑testin.",
      ],
      quizTitle: "GenAI‑testi",
      quizIntro:
        "Testaa ymmärrystäsi GenAI:n turvallisesta ja vaatimustenmukaisesta käytöstä Collectian perintäympäristössä.",
      quizStartButton: "Aloita testi →",
      quizQuestionsLabel: "Kysymystä",
      quizRetriesLabel: "Yritystä",
      quizQuestionShort: "Kysymys",
      quizCorrectShort: "oikein",
      quizSubmit: "Lähetä vastaus",
      quizNextQuestion: "Seuraava kysymys →",
      quizFinishQuiz: "Lopeta testi →",
      quizCorrectLabel: "✓ Oikein!",
      quizIncorrectLabel: "✗ Väärin",
      quizCompleteTitle: "Testi valmis",
      quizScoreSummary: "oikein /",
      quizGreatJob: "Hienoa! Ymmärrät hyvin GenAI:n käytön Collectialla.",
      quizGoodStart: "Hyvä alku. Lue ohjeistus uudelleen ja kokeile testiä uudelleen.",
      quizNeedsReview: "Sinun kannattaa käydä GenAI‑ohjeistus uudelleen läpi ennen kuin tukeudut GenAI:hin työssäsi.",
      quizRestart: "↻ Aloita testi uudelleen",
      backToTraining: "← Takaisin koulutukseen",
    },
    ttsLang: "fi-FI",
  },
  {
    code: "de",
    label: "Deutsch (DE)",
    flag: "🇩🇪",
    t: {
      appTitle: "Verpflichtendes GenAI‑Training",
      introLead:
        "Wählen Sie eine Sprache und starten Sie das verpflichtende Training zur sicheren und konformen Nutzung von GenAI bei Collectia.",
      startButton: "Training starten",
      sectionPrefix: "Abschnitt",
      sectionOf: "von",
      trainingLabel: "GenAI‑Training",
      autoNarrationHint: "Der Text wird automatisch vorgelesen. Sie können unten mitlesen.",
      quizButton: "Zur GenAI‑Quiz",
      prevSection: "← Vorheriger Abschnitt",
      nextSection: "Nächster Abschnitt →",
      chooseLanguage: "Sprache wählen",
      trainingBullets: [
        "Das Training ist Pflicht, bevor Sie GenAI‑Tools verwenden dürfen.",
        "Jeder Abschnitt wird automatisch vorgelesen.",
        "Zum Abschluss machen Sie ein kurzes GenAI‑Quiz.",
      ],
      quizTitle: "GenAI‑Quiz",
      quizIntro:
        "Testen Sie Ihr Verständnis für den sicheren und rechtskonformen Einsatz von GenAI im Inkassokontext von Collectia.",
      quizStartButton: "Quiz starten →",
      quizQuestionsLabel: "Fragen",
      quizRetriesLabel: "Versuche",
      quizQuestionShort: "Frage",
      quizCorrectShort: "richtig",
      quizSubmit: "Antwort absenden",
      quizNextQuestion: "Nächste Frage →",
      quizFinishQuiz: "Quiz beenden →",
      quizCorrectLabel: "✓ Richtig!",
      quizIncorrectLabel: "✗ Falsch",
      quizCompleteTitle: "Quiz abgeschlossen",
      quizScoreSummary: "richtig von",
      quizGreatJob: "Sehr gut! Sie haben ein starkes Verständnis für den Einsatz von GenAI bei Collectia.",
      quizGoodStart: "Guter Start. Lesen Sie die Richtlinie erneut und versuchen Sie das Quiz noch einmal.",
      quizNeedsReview: "Sie sollten die GenAI‑Richtlinie erneut lesen, bevor Sie GenAI in Ihrer Arbeit einsetzen.",
      quizRestart: "↻ Quiz neu starten",
      backToTraining: "← Zurück zum Training",
    },
    ttsLang: "de-DE",
  },
];

// Media reused for all languages
const mediaUrls = {
  s1: "https://images.pexels.com/photos/1181355/pexels-photo-1181355.jpeg?auto=compress&cs=tinysrgb&w=1200",
  s2: "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=1200",
  s3: "https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg?auto=compress&cs=tinysrgb&w=1200",
  s4: "https://images.pexels.com/photos/5380642/pexels-photo-5380642.jpeg?auto=compress&cs=tinysrgb&w=1200",
  s5: "https://images.pexels.com/photos/4386373/pexels-photo-4386373.jpeg?auto=compress&cs=tinysrgb&w=1200",
  s6: "https://images.pexels.com/photos/5380648/pexels-photo-5380648.jpeg?auto=compress&cs=tinysrgb&w=1200",
  s7: "https://images.pexels.com/photos/6476589/pexels-photo-6476589.jpeg?auto=compress&cs=tinysrgb&w=1200",
  s8: "https://images.pexels.com/photos/2777898/pexels-photo-2777898.jpeg?auto=compress&cs=tinysrgb&w=1200",
  s9: "https://images.pexels.com/photos/3184396/pexels-photo-3184396.jpeg?auto=compress&cs=tinysrgb&w=1200",
  s10: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1200",
};

// Simple shuffle helper
const shuffleArray = <T,>(arr: T[]): T[] => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

// Short, localized training content per language (3 sections each for demo)
const sectionsByLang: Record<LangCode, TrainingSection[]> = {
  en: [
    {
      id: 1,
      title: "Welcome to GenAI Training",
      text: `
Welcome to Collectia’s mandatory training on safe and compliant use of Generative AI.

You will learn the basic rules for using GenAI in a debt collection context.`,
      mediaUrl: mediaUrls.s1,
    },
    {
      id: 2,
      title: "Why governance matters",
      text: `
GenAI must be used in line with GDPR, the EU AI Act and local debt collection rules.

GenAI supports your work but never replaces your professional judgement.`,
      mediaUrl: mediaUrls.s2,
    },
    {
      id: 3,
      title: "Next step: the quiz",
      text: `
After this short introduction you will complete a quiz.

The quiz checks that you understand data protection, safe prompting and your responsibility.`,
      mediaUrl: mediaUrls.s3,
    },
  ],
  da: [
    {
      id: 1,
      title: "Velkommen til GenAI‑træning",
      text: `
Velkommen til Collectias obligatoriske træning i sikker og compliant brug af GenAI.

Du får et overblik over de vigtigste regler for brug af GenAI i inkasso.`,
      mediaUrl: mediaUrls.s1,
    },
    {
      id: 2,
      title: "Hvorfor governance er vigtigt",
      text: `
GenAI skal bruges i overensstemmelse med GDPR, EU’s AI‑forordning og lokale inkassoregler.

GenAI støtter dit arbejde – den erstatter aldrig din faglige vurdering.`,
      mediaUrl: mediaUrls.s2,
    },
    {
      id: 3,
      title: "Næste skridt: quizzen",
      text: `
Efter denne korte introduktion gennemfører du en quiz.

Quizzen tester din forståelse af databeskyttelse, sikker prompting og dit ansvar.`,
      mediaUrl: mediaUrls.s3,
    },
  ],
  sv: [
    {
      id: 1,
      title: "Välkommen till GenAI‑utbildningen",
      text: `
Välkommen till Collectias obligatoriska utbildning i säker och compliant användning av GenAI.

Du får en översikt över de viktigaste reglerna för GenAI i inkasso.`,
      mediaUrl: mediaUrls.s1,
    },
    {
      id: 2,
      title: "Varför styrning är viktigt",
      text: `
GenAI ska användas i linje med GDPR, EU:s AI‑förordning och nationella inkassoregler.

GenAI är ett stöd – den ersätter aldrig din professionella bedömning.`,
      mediaUrl: mediaUrls.s2,
    },
    {
      id: 3,
      title: "Nästa steg: quiz",
      text: `
Efter denna korta introduktion gör du ett quiz.

Quizet testar att du förstår dataskydd, säkra prompts och ditt ansvar.`,
      mediaUrl: mediaUrls.s3,
    },
  ],
  no: [
    {
      id: 1,
      title: "Velkommen til GenAI‑opplæring",
      text: `
Velkommen til Collectias obligatoriske opplæring i trygg og compliant bruk av GenAI.

Du får en oversikt over de viktigste reglene for GenAI i inkasso.`,
      mediaUrl: mediaUrls.s1,
    },
    {
      id: 2,
      title: "Hvorfor styring er viktig",
      text: `
GenAI skal brukes i tråd med GDPR, EUs AI‑forordning og lokale inkassoregler.

GenAI støtter arbeidet ditt – den erstatter aldri faglig vurdering.`,
      mediaUrl: mediaUrls.s2,
    },
    {
      id: 3,
      title: "Neste steg: quiz",
      text: `
Etter denne korte introduksjonen tar du en quiz.

Quizen tester forståelse av personvern, sikre prompts og ditt ansvar.`,
      mediaUrl: mediaUrls.s3,
    },
  ],
  fi: [
    {
      id: 1,
      title: "Tervetuloa GenAI‑koulutukseen",
      text: `
Tervetuloa Collectian pakolliseen GenAI‑koulutukseen.

Saat yleiskuvan tärkeimmistä säännöistä GenAI:n käytössä perinnässä.`,
      mediaUrl: mediaUrls.s1,
    },
    {
      id: 2,
      title: "Miksi hallinta on tärkeää",
      text: `
GenAI:tä on käytettävä GDPR:n, EU:n tekoälyasetuksen ja paikallisten perintäsääntöjen mukaisesti.

GenAI tukee työtäsi, mutta ei korvaa omaa harkintaasi.`,
      mediaUrl: mediaUrls.s2,
    },
    {
      id: 3,
      title: "Seuraavaksi: testi",
      text: `
Lyhyen johdannon jälkeen suoritat testin.

Testi tarkistaa ymmärrätkö tietosuojan, turvalliset kehotteet ja vastuusi.`,
      mediaUrl: mediaUrls.s3,
    },
  ],
  de: [
    {
      id: 1,
      title: "Willkommen zum GenAI‑Training",
      text: `
Willkommen zum verpflichtenden GenAI‑Training von Collectia.

Sie erhalten einen Überblick über die wichtigsten Regeln für den Einsatz von GenAI im Inkasso.`,
      mediaUrl: mediaUrls.s1,
    },
    {
      id: 2,
      title: "Warum Governance wichtig ist",
      text: `
GenAI muss im Einklang mit DSGVO, EU‑KI‑Verordnung und nationalen Inkassoregeln eingesetzt werden.

GenAI unterstützt Ihre Arbeit – sie ersetzt nicht Ihr fachliches Urteil.`,
      mediaUrl: mediaUrls.s2,
    },
    {
      id: 3,
      title: "Nächster Schritt: Quiz",
      text: `
Nach dieser kurzen Einführung absolvieren Sie ein Quiz.

Das Quiz prüft Ihr Verständnis von Datenschutz, sicheren Prompts und Ihrer Verantwortung.`,
      mediaUrl: mediaUrls.s3,
    },
  ],
};

// Simple TTS using language tag (guarded for browser)
function speakText(text: string, langTag: string) {
  if (typeof window === "undefined" || typeof window.speechSynthesis === "undefined") return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = langTag;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

/* -------------------------- TRAINING COMPONENT -------------------------- */

interface TrainingProps {
  selectedLang: LangCode;
  onChangeLang: (lang: LangCode) => void;
  onGoToQuiz: () => void;
}

const Training: React.FC<TrainingProps> = ({ selectedLang, onChangeLang, onGoToQuiz }) => {
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const langConfig = languageConfigs.find((l) => l.code === selectedLang) ?? languageConfigs[0];
  const t = langConfig.t;

  const sections = sectionsByLang[langConfig.code] ?? sectionsByLang.en;
  const currentSection = sections[currentIndex];
  const totalSections = sections.length;
  const progress = ((currentIndex + 1) / totalSections) * 100;

  useEffect(() => {
    if (!started) return;
    const timer = setTimeout(() => {
      speakText(currentSection.text, langConfig.ttsLang);
    }, 200);
    return () => clearTimeout(timer);
  }, [started, currentIndex, currentSection.text, langConfig.ttsLang]);

  // Start screen
  if (!started) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{
          background: `linear-gradient(135deg, ${COLORS.darkBlue} 0%, ${COLORS.teal} 40%, ${COLORS.mintSoft} 100%)`,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-3xl"
        >
          <Card
            className="backdrop-blur-sm"
            style={{
              borderColor: "#1E293B",
              background: "linear-gradient(135deg, rgba(11,23,39,0.98), rgba(11,23,39,0.92))",
            }}
          >
            <CardHeader className="space-y-4">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <CardTitle className="text-3xl font-bold" style={{ color: COLORS.mint }}>
                    {t.appTitle}
                  </CardTitle>
                  <CardDescription className="mt-2 text-sm" style={{ color: "rgba(226,232,240,0.8)" }}>
                    {t.introLead}
                  </CardDescription>
                </div>
                <div
                  className="px-3 py-2 rounded-lg text-xs font-semibold"
                  style={{
                    backgroundColor: COLORS.teal,
                    color: COLORS.darkBlue,
                  }}
                >
                  Collectia • GenAI
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: COLORS.mintSoft }}>
                  {t.chooseLanguage} / Choose language
                </p>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
                  {languageConfigs.map((lang) => {
                    const isActive = selectedLang === lang.code;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => onChangeLang(lang.code)}
                        className="flex flex-col items-center justify-center rounded-lg px-2 py-2 border text-xs font-medium transition"
                        style={{
                          borderColor: isActive ? COLORS.tealSoft : "rgba(148,163,184,0.4)",
                          backgroundColor: isActive ? "rgba(0,184,148,0.18)" : "rgba(15,23,42,0.7)",
                          color: COLORS.white,
                        }}
                      >
                        <span className="text-lg mb-1">{lang.flag}</span>
                        <span>{lang.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
                <div className="flex-1 text-xs text-slate-300">
                  {t.trainingBullets.map((b, i) => (
                    <p key={i}>• {b}</p>
                  ))}
                </div>
                <Button
                  onClick={() => setStarted(true)}
                  className="md:w-48 h-11 font-semibold"
                  style={{
                    backgroundColor: COLORS.teal,
                    color: COLORS.darkBlue,
                    borderColor: "transparent",
                  }}
                >
                  {t.startButton} →
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Training screen
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: `radial-gradient(circle at top left, ${COLORS.tealSoft} 0, transparent 55%), radial-gradient(circle at bottom right, ${COLORS.mint} 0, transparent 65%), ${COLORS.darkBlue}`,
      }}
    >
      <div className="w-full max-w-4xl space-y-4">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
          <div className="flex justify-between items-center text-xs md:text-sm">
            <span className="font-mono" style={{ color: COLORS.mintSoft }}>
              {t.sectionPrefix} {currentIndex + 1} {t.sectionOf} {totalSections}
            </span>
            <span className="font-mono font-semibold" style={{ color: COLORS.tealSoft }}>
              {t.trainingLabel}
            </span>
          </div>
          <Progress
            value={progress}
            className="h-1.5"
            style={{
              backgroundColor: "rgba(15,23,42,0.9)",
            }}
          />
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentSection.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
          >
            <Card
              className="backdrop-blur-md"
              style={{
                borderColor: "rgba(148,163,184,0.45)",
                background: "linear-gradient(145deg, rgba(15,23,42,0.96), rgba(15,23,42,0.94))",
              }}
            >
              <CardHeader className="space-y-2">
                <CardTitle className="text-2xl md:text-3xl font-semibold" style={{ color: COLORS.white }}>
                  {currentSection.title}
                </CardTitle>
                <CardDescription className="text-xs md:text-sm" style={{ color: "rgba(203,213,225,0.9)" }}>
                  {t.autoNarrationHint}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  className="rounded-xl overflow-hidden border aspect-video"
                  style={{
                    borderColor: "rgba(51,65,85,0.9)",
                    backgroundColor: "#020617",
                  }}
                >
                  <img
                    src={currentSection.mediaUrl}
                    alt={currentSection.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div
                  className="rounded-lg p-4 max-h-64 overflow-y-auto text-sm md:text-base"
                  style={{
                    backgroundColor: "rgba(15,23,42,0.9)",
                    borderColor: "rgba(51,65,85,0.9)",
                    color: "rgba(226,232,240,0.95)",
                    borderWidth: 1,
                  }}
                >
                  {currentSection.text
                    .trim()
                    .split("\n")
                    .filter((p) => p.trim().length > 0)
                    .map((p, idx) => (
                      <p key={idx} className="mb-2 leading-relaxed">
                        {p.trim()}
                      </p>
                    ))}
                </div>

                <div className="flex justify-between items-center pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                    disabled={currentIndex === 0}
                    style={{
                      borderColor: "rgba(148,163,184,0.6)",
                      color: COLORS.mintSoft,
                      backgroundColor: "transparent",
                    }}
                  >
                    {t.prevSection}
                  </Button>

                  {currentIndex === totalSections - 1 ? (
                    <Button
                      size="sm"
                      className="font-semibold"
                      onClick={onGoToQuiz}
                      style={{
                        backgroundColor: COLORS.teal,
                        color: COLORS.darkBlue,
                      }}
                    >
                      {t.quizButton} →
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="font-semibold"
                      onClick={() => setCurrentIndex((i) => Math.min(totalSections - 1, i + 1))}
                      style={{
                        backgroundColor: COLORS.teal,
                        color: COLORS.darkBlue,
                      }}
                    >
                      {t.nextSection}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

/* -------------------------- QUIZ QUESTIONS (MULTILINGUAL) -------------------------- */

const questionsByLang: Record<LangCode, Question[]> = {
  en: [
    {
      id: 1,
      question: "What is the primary purpose of Collectia's GenAI guideline?",
      options: [
        "To let everyone experiment freely with any AI tool",
        "To define mandatory rules for safe, compliant GenAI use in debt collection",
        "To replace all other company policies",
        "To allow sharing debtor data with any external provider",
      ],
      correctIndex: 1,
      explanation:
        "The guideline defines binding rules for safe and compliant use of GenAI in Collectia's regulated debt collection context.",
    },
    {
      id: 2,
      question: "Before you can access GenAI tools at Collectia, what is required?",
      options: [
        "Only verbal confirmation from your manager",
        "You must complete the GenAI training and acknowledge the guideline",
        "You must sign up to any public AI service",
        "Nothing, access is always open",
      ],
      correctIndex: 1,
      explanation:
        "Access to GenAI tools is conditional on completing training and formally acknowledging the guideline.",
    },
    {
      id: 3,
      question: "Which type of information is generally safe to use in an approved GenAI tool?",
      options: [
        "Fully anonymised examples without real debtor identifiers",
        "Full debtor names and addresses",
        "Debtor personal ID numbers",
        "Full case files with payment history and contact details",
      ],
      correctIndex: 0,
      explanation:
        "Anonymised or fictional examples that cannot identify real people are generally safe; real debtor data must not be shared with non‑approved tools.",
    },
    {
      id: 4,
      question: "What best describes GenAI's role in decision‑making at Collectia?",
      options: [
        "GenAI fully replaces human judgement",
        "GenAI is a support tool; humans are still responsible for decisions",
        "GenAI output is always legally binding",
        "Once GenAI suggests something, you must follow it",
      ],
      correctIndex: 1,
      explanation: "GenAI supports your work, but you remain responsible for decisions and for checking AI output.",
    },
    {
      id: 5,
      question: "How should legal content generated by GenAI be handled?",
      options: [
        "Use it directly as final legal advice",
        "Assume it is always aligned with the latest law",
        "Treat it as a draft and have Legal / Compliance validate it",
        "Ignore it completely",
      ],
      correctIndex: 2,
      explanation: "Legal texts from GenAI must always be reviewed and validated by Legal or Compliance before use.",
    },
  ],
  da: [
    {
      id: 1,
      question: "Hvad er hovedformålet med Collectias GenAI‑retningslinje?",
      options: [
        "At alle frit kan eksperimentere med alle AI‑værktøjer",
        "At fastlægge bindende regler for sikker og compliant brug af GenAI i inkasso",
        "At erstatte alle andre politikker",
        "At gøre det muligt at dele skyldnerdata med alle leverandører",
      ],
      correctIndex: 1,
      explanation:
        "GenAI‑retningslinjen fastlægger de bindende regler for sikker og compliant GenAI‑brug i Collectias regulerede inkassokontekst.",
    },
    {
      id: 2,
      question: "Hvad kræves, før du kan få adgang til GenAI‑værktøjer i Collectia?",
      options: [
        "Kun mundtlig godkendelse fra din leder",
        "Du skal gennemføre GenAI‑træningen og kvittere for retningslinjen",
        "Du skal oprette en konto hos en vilkårlig offentlig AI‑tjeneste",
        "Intet, adgang er altid åben",
      ],
      correctIndex: 1,
      explanation:
        "Adgang til GenAI‑værktøjer er betinget af, at du gennemfører træningen og formelt kvitterer for retningslinjen.",
    },
    {
      id: 3,
      question: "Hvilken type information er normalt sikker at bruge i et godkendt GenAI‑værktøj?",
      options: [
        "Fuldstændigt anonymiserede eksempler uden rigtige skyldner‑identifikatorer",
        "Fuldstændige navne og adresser på skyldnere",
        "Skyldners CPR‑numre",
        "Komplette sagsmapper med betalingshistorik og kontaktdata",
      ],
      correctIndex: 0,
      explanation:
        "Anonymiserede eller fiktive eksempler, der ikke kan knyttes til virkelige personer, er typisk sikre. Rigtige skyldnerdata må ikke bruges i ikke‑godkendte værktøjer.",
    },
    {
      id: 4,
      question: "Hvordan beskrives GenAI’s rolle i beslutningstagning bedst?",
      options: [
        "GenAI kan erstatte menneskelig vurdering",
        "GenAI er et støtteværktøj – du er stadig ansvarlig for beslutningen",
        "GenAI’s output er altid juridisk bindende",
        "Når GenAI foreslår noget, skal du følge det",
      ],
      correctIndex: 1,
      explanation:
        "GenAI understøtter dit arbejde, men erstatter det ikke. Du har stadig ansvaret for den endelige beslutning.",
    },
    {
      id: 5,
      question: "Hvordan skal juridisk indhold fra GenAI håndteres?",
      options: [
        "Bruges direkte som endelig juridisk rådgivning",
        "Antages altid at være opdateret",
        "Behandles som et udkast, der skal godkendes af Legal / Compliance",
        "Ignoreres helt",
      ],
      correctIndex: 2,
      explanation:
        "Juridiske tekster fra GenAI skal altid gennemgås og godkendes af Legal eller Compliance, før de anvendes.",
    },
  ],
  sv: [
    {
      id: 1,
      question: "Vad är huvudsyftet med Collectias GenAI‑riktlinje?",
      options: [
        "Att alla ska kunna experimentera fritt med alla AI‑verktyg",
        "Att ange bindande regler för säker och compliant GenAI‑användning i inkasso",
        "Att ersätta alla andra policys",
        "Att möjliggöra delning av gäldenärsdata med alla leverantörer",
      ],
      correctIndex: 1,
      explanation:
        "GenAI‑riktlinjen anger bindande regler för säker och compliant GenAI‑användning i Collectias reglerade inkassomiljö.",
    },
    {
      id: 2,
      question: "Vad krävs innan du får tillgång till GenAI‑verktyg hos Collectia?",
      options: [
        "Enbart muntligt godkännande från chef",
        "Du måste genomföra GenAI‑utbildningen och bekräfta riktlinjen",
        "Du måste skapa konto hos en valfri publik AI‑tjänst",
        "Ingenting, tillgången är alltid öppen",
      ],
      correctIndex: 1,
      explanation: "Tillgång till GenAI‑verktyg är villkorad av att du genomför utbildningen och bekräftar riktlinjen.",
    },
    {
      id: 3,
      question: "Vilken typ av information är normalt säker att använda i ett godkänt GenAI‑verktyg?",
      options: [
        "Helt anonymiserade exempel utan verkliga gäldenärs‑identifierare",
        "Fullständiga namn och adresser",
        "Personnummer",
        "Fullständiga ärendefiler med betalningshistorik",
      ],
      correctIndex: 0,
      explanation: "Anonymiserade eller fiktiva exempel som inte kan kopplas till verkliga personer är normalt säkra.",
    },
    {
      id: 4,
      question: "Hur beskrivs GenAI:s roll i beslutsfattande bäst?",
      options: [
        "GenAI kan ersätta mänsklig bedömning",
        "GenAI är ett stödverktyg – du är fortfarande ansvarig för beslutet",
        "GenAI:s svar är alltid juridiskt bindande",
        "När GenAI föreslår något måste du följa det",
      ],
      correctIndex: 1,
      explanation: "GenAI stödjer ditt arbete men ersätter det inte. Du har fortfarande ansvaret för dina beslut.",
    },
    {
      id: 5,
      question: "Hur ska juridiskt innehåll från GenAI hanteras?",
      options: [
        "Användas direkt som slutlig juridisk rådgivning",
        "Antas alltid vara korrekt",
        "Behandlas som ett utkast som granskas av Legal / Compliance",
        "Ignoreras helt",
      ],
      correctIndex: 2,
      explanation: "Juridiskt innehåll från GenAI måste granskas av Legal eller Compliance innan det används.",
    },
  ],
  no: [
    {
      id: 1,
      question: "Hva er hovedformålet med Collectias GenAI‑retningslinje?",
      options: [
        "At alle fritt kan eksperimentere med alle AI‑verktøy",
        "Å fastsette bindende regler for trygg og compliant bruk av GenAI i inkasso",
        "Å erstatte alle andre retningslinjer",
        "Å muliggjøre deling av skyldnerdata med alle leverandører",
      ],
      correctIndex: 1,
      explanation:
        "GenAI‑retningslinjen fastsetter bindende regler for trygg og compliant bruk av GenAI i Collectias regulerte inkassokontekst.",
    },
    {
      id: 2,
      question: "Hva kreves før du får tilgang til GenAI‑verktøy i Collectia?",
      options: [
        "Kun muntlig godkjenning fra leder",
        "Du må gjennomføre GenAI‑opplæringen og bekrefte retningslinjen",
        "Du må opprette konto hos en vilkårlig AI‑tjeneste",
        "Ingenting, tilgangen er alltid åpen",
      ],
      correctIndex: 1,
      explanation: "Tilgang til GenAI‑verktøy er betinget av at du fullfører opplæringen og bekrefter retningslinjen.",
    },
    {
      id: 3,
      question: "Hvilken type informasjon er normalt trygg å bruke i et godkjent GenAI‑verktøy?",
      options: [
        "Fullt anonymiserte eksempler uten ekte skyldner‑identifikatorer",
        "Fullt navn og adresse på skyldnere",
        "Fødselsnumre",
        "Komplette saksmapper med betalingshistorikk",
      ],
      correctIndex: 0,
      explanation:
        "Anonymiserte eller fiktive eksempler som ikke kan knyttes til virkelige personer, er normalt trygge.",
    },
    {
      id: 4,
      question: "Hvordan beskrives GenAI sin rolle i beslutninger best?",
      options: [
        "GenAI kan erstatte menneskelig vurdering",
        "GenAI er et støtteverktøy – du er fortsatt ansvarlig for beslutningen",
        "GenAI‑svar er alltid juridisk bindende",
        "Når GenAI foreslår noe, må du følge det",
      ],
      correctIndex: 1,
      explanation: "GenAI støtter arbeidet ditt, men du er fortsatt ansvarlig for beslutningene dine.",
    },
    {
      id: 5,
      question: "Hvordan skal juridisk innhold fra GenAI håndteres?",
      options: [
        "Brukes direkte som endelig juridisk råd",
        "Antas alltid å være korrekt",
        "Behandles som utkast som kontrolleres av Legal / Compliance",
        "Ignoreres helt",
      ],
      correctIndex: 2,
      explanation: "Juridisk innhold fra GenAI må alltid kontrolleres av Legal eller Compliance.",
    },
  ],
  fi: [
    {
      id: 1,
      question: "Mikä on Collectian GenAI‑ohjeen päätarkoitus?",
      options: [
        "Mahdollistaa vapaa kokeilu kaikilla AI‑työkaluilla",
        "Määritellä sitovat säännöt GenAI:n turvalliselle ja vaatimustenmukaiselle käytölle perinnässä",
        "Korvata kaikki muut politiikat",
        "Mahdollistaa velallisten tietojen jakamisen kaikille toimittajille",
      ],
      correctIndex: 1,
      explanation:
        "GenAI‑ohje määrittelee sitovat säännöt GenAI:n turvalliselle ja vaatimustenmukaiselle käytölle Collectian säännellyssä perintäympäristössä.",
    },
    {
      id: 2,
      question: "Mitä vaaditaan ennen kuin voit käyttää GenAI‑työkaluja Collectialla?",
      options: [
        "Vain suullinen lupa esihenkilöltä",
        "Sinun on suoritettava GenAI‑koulutus ja kuitattava ohje luetuksi",
        "Sinun on luotava tili mihin tahansa AI‑palveluun",
        "Ei mitään – pääsy on aina vapaa",
      ],
      correctIndex: 1,
      explanation: "GenAI‑työkalujen käyttö edellyttää koulutuksen suorittamista ja ohjeen hyväksymistä.",
    },
    {
      id: 3,
      question: "Minkä tyyppinen tieto on yleensä turvallista käyttää hyväksytyssä GenAI‑työkalussa?",
      options: [
        "Täysin anonymisoidut esimerkit ilman todellisia tunnistetietoja",
        "Velallisten täydelliset nimet ja osoitteet",
        "Henkilötunnukset",
        "Täydelliset tapaustiedot maksuhistorioineen",
      ],
      correctIndex: 0,
      explanation:
        "Anonymisoidut tai fiktiiviset esimerkit, joita ei voi yhdistää todellisiin henkilöihin, ovat yleensä turvallisia.",
    },
    {
      id: 4,
      question: "Miten GenAI:n roolia päätöksenteossa kuvataan parhaiten?",
      options: [
        "GenAI korvaa ihmisen harkinnan",
        "GenAI on tukityökalu – vastuu päätöksestä on sinulla",
        "GenAI:n vastaus on aina juridisesti sitova",
        "Kun GenAI ehdottaa jotain, sitä on noudatettava",
      ],
      correctIndex: 1,
      explanation: "GenAI tukee työtäsi, mutta et voi siirtää vastuuta sille. Päätöksestä vastaat sinä.",
    },
    {
      id: 5,
      question: "Miten GenAI:n tuottamaa juridista sisältöä tulee käsitellä?",
      options: [
        "Käytetään sellaisenaan lopullisena oikeudellisena neuvona",
        "Oletetaan aina ajantasaiseksi",
        "Käsitellään luonnoksena, joka tarkistetaan Legal / Compliance ‑tiimissä",
        "Ignoroidaan kokonaan",
      ],
      correctIndex: 2,
      explanation: "Juridinen sisältö on aina tarkistettava Legal‑ tai Compliance‑tiimin toimesta ennen käyttöä.",
    },
  ],
  de: [
    {
      id: 1,
      question: "Was ist das Hauptziel der GenAI‑Richtlinie von Collectia?",
      options: [
        "Allen freies Experimentieren mit beliebigen KI‑Tools zu ermöglichen",
        "Verbindliche Regeln für den sicheren und rechtskonformen Einsatz von GenAI im Inkasso festzulegen",
        "Alle anderen Richtlinien zu ersetzen",
        "Die Weitergabe von Schuldnerdaten an beliebige Anbieter zu erlauben",
      ],
      correctIndex: 1,
      explanation:
        "Die Richtlinie legt verbindliche Regeln für den sicheren, rechtskonformen Einsatz von GenAI im regulierten Inkassokontext fest.",
    },
    {
      id: 2,
      question: "Was ist erforderlich, bevor Sie Zugang zu GenAI‑Tools erhalten?",
      options: [
        "Nur eine mündliche Zusage der Führungskraft",
        "Sie müssen das GenAI‑Training absolvieren und die Richtlinie bestätigen",
        "Sie müssen ein Konto bei einem beliebigen KI‑Dienst eröffnen",
        "Nichts, der Zugang ist immer offen",
      ],
      correctIndex: 1,
      explanation:
        "Der Zugang zu GenAI‑Tools setzt voraus, dass Sie das Training absolvieren und die Richtlinie bestätigen.",
    },
    {
      id: 3,
      question: "Welche Informationen sind in einem zugelassenen GenAI‑Tool in der Regel unkritisch?",
      options: [
        "Vollständig anonymisierte Beispiele ohne reale Schuldnerkennungen",
        "Vollständige Namen und Adressen von Schuldnern",
        "Personenkennziffern",
        "Vollständige Akten mit Zahlungshistorie",
      ],
      correctIndex: 0,
      explanation:
        "Anonymisierte oder fiktive Beispiele, die nicht auf reale Personen schließen lassen, sind in der Regel unkritisch.",
    },
    {
      id: 4,
      question: "Wie wird die Rolle von GenAI bei Entscheidungen am besten beschrieben?",
      options: [
        "GenAI ersetzt menschliche Entscheidungen",
        "GenAI ist ein Unterstützungstool – Sie bleiben verantwortlich für Entscheidungen",
        "GenAI‑Ausgaben sind immer rechtsverbindlich",
        "Sobald GenAI etwas vorschlägt, müssen Sie es befolgen",
      ],
      correctIndex: 1,
      explanation: "GenAI unterstützt Ihre Arbeit, ersetzt aber nicht Ihr Urteil. Sie tragen die Verantwortung.",
    },
    {
      id: 5,
      question: "Wie ist mit rechtlichen Texten aus GenAI umzugehen?",
      options: [
        "Direkt als endgültige Rechtsberatung verwenden",
        "Als stets aktuell ansehen",
        "Als Entwurf behandeln, der von Legal / Compliance geprüft wird",
        "Grundsätzlich ignorieren",
      ],
      correctIndex: 2,
      explanation:
        "Rechtliche Texte aus GenAI müssen von Legal oder Compliance geprüft werden, bevor sie verwendet werden.",
    },
  ],
};

/* -------------------------- QUIZ COMPONENT -------------------------- */

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

const Quiz: React.FC<QuizProps> = ({ lang, onBackToTraining }) => {
  const langConfig = languageConfigs.find((l) => l.code === lang) ?? languageConfigs[0];
  const t = langConfig.t;

  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answerLog, setAnswerLog] = useState<AnswerLogEntry[]>([]);
  const [finished, setFinished] = useState(false);

  const allQuestions = questionsByLang[langConfig.code] ?? questionsByLang.en;
  const randomizedQuestions = useMemo(() => shuffleArray(allQuestions), [langConfig.code]);

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
              <CardDescription className="text-base text-muted-foreground">{t.quizIntro}</CardDescription>
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
              <Button variant="outline" className="w-full h-10 text-xs mt-1" onClick={onBackToTraining}>
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
                  <span className="text-primary font-semibold">{correctCount}</span> {t.quizScoreSummary}{" "}
                  {totalQuestions}
                </p>
              </div>
              <div className="rounded-lg bg-secondary/50 border border-border/50 p-4">
                <p className="text-sm text-foreground/80">{message}</p>
              </div>
              <div className="space-y-2">
                <Button onClick={handleRestart} className="w-full h-12 text-base font-semibold" size="lg">
                  {t.quizRestart}
                </Button>
                <Button variant="outline" className="w-full h-10 text-xs" onClick={onBackToTraining}>
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
                <CardTitle className="text-xl leading-relaxed font-medium">{currentQuestion.question}</CardTitle>
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
                      optionClasses += "border-border/30 bg-secondary/20 text-muted-foreground opacity-50";
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
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 pt-2">
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
                      <p className="text-sm text-muted-foreground leading-relaxed">{currentQuestion.explanation}</p>
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

/* -------------------------- APP ROOT -------------------------- */

const App: React.FC = () => {
  const [mode, setMode] = useState<"training" | "quiz">("training");
  const [selectedLang, setSelectedLang] = useState<LangCode>("da");

  return mode === "training" ? (
    <Training selectedLang={selectedLang} onChangeLang={setSelectedLang} onGoToQuiz={() => setMode("quiz")} />
  ) : (
    <Quiz lang={selectedLang} onBackToTraining={() => setMode("training")} />
  );
};

export default App;
