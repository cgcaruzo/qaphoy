"use client";
import { useState } from "react";
import { DisponibilidadesList } from "@/components/DisponibilidadesList";
import { IntroVideo } from "@/components/IntroVideo";

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);
  const [fadeIn, setFadeIn] = useState(false);

  const handleIntroEnd = () => {
    setShowIntro(false);
    requestAnimationFrame(() => setFadeIn(true));
  };

  if (showIntro) return <IntroVideo onEnded={handleIntroEnd} />;
  return (
    <div
      className={`transition-opacity duration-500 ${
        fadeIn ? "opacity-100" : "opacity-0"
      }`}
    >
      <DisponibilidadesList />
    </div>
  );
}