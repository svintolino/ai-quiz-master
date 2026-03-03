// src/App.tsx
import React, { useState } from "react";
import { LangCode } from "./i18n";
import { Training } from "./Training";
import { Quiz } from "./Quiz";

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
