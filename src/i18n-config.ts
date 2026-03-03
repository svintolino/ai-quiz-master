// src/i18n.ts
export type LangCode = "en" | "da" | "sv" | "no" | "fi" | "de";

export interface TrainingSection {
  id: number;
  title: string;
  text: string;
  mediaUrl: string;
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LanguageConfig {
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
export const COLORS = {
  teal: "#00B894",
  darkBlue: "#0B1727",
  mint: "#C8FFF4",
  mintSoft: "#E1FFFA",
  tealSoft: "#5EF2CF",
  white: "#FFFFFF",
};

export const languageConfigs: LanguageConfig[] = [
  {
    code: "en",
    label: "English (EN)",
    flag: "🇬🇧",
    t: {
      appTitle: "GenAI Mandatory Training",
      introLead:
        "Choose language and complete the mandatory training on safe and compliant use of GenAI at Collectia.",
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
      quizIntro:
        "Test your understanding of safe and compliant use of GenAI in Collectia's debt collection context.",
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
      introLead:
        "Vælg s sprog og start den obligatoriske træning i sikker og compliant brug af GenAI hos Collectia.",
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
      quizIntro:
        "Test din forståelse af sikker og compliant brug af GenAI i Collectias inkassokontekst.",
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
      quizNeedsReview:
        "Du bør læse GenAI‑retningslinjen igen, før du anvender GenAI i dit arbejde.",
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
      quizIntro:
        "Testa din förståelse för säker och compliant användning av GenAI i Collectias inkassomiljö.",
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
      quizNeedsReview:
        "Du bör gå igenom GenAI‑riktlinjen igen innan du förlitar dig på GenAI i ditt arbete.",
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
      introLead:
        "Velg språk, og start den obligatoriske opplæringen i trygg og compliant bruk av GenAI i Collectia.",
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
      quizIntro:
        "Test forståelsen din av trygg og compliant bruk av GenAI i Collectias inkassokontekst.",
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
      quizNeedsReview:
        "Du bør lese GenAI‑retningslinjene på nytt før du stoler på GenAI i arbeidet ditt.",
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
      quizNeedsReview:
        "Sinun kannattaa käydä GenAI‑ohjeistus uudelleen läpi ennen kuin tukeudut GenAI:hin työssäsi.",
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
      quizGreatJob:
        "Sehr gut! Sie haben ein starkes Verständnis für den Einsatz von GenAI bei Collectia.",
      quizGoodStart:
        "Guter Start. Lesen Sie die Richtlinie erneut und versuchen Sie das Quiz noch einmal.",
      quizNeedsReview:
        "Sie sollten die GenAI‑Richtlinie erneut lesen, bevor Sie GenAI in Ihrer Arbeit einsetzen.",
      quizRestart: "↻ Quiz neu starten",
      backToTraining: "← Zurück zum Training",
    },
    ttsLang: "de-DE",
  },
];