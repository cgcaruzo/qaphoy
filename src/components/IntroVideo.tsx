"use client";

import { useState } from "react";

export function IntroVideo({ onEnded }: { onEnded: () => void }) {
  const [fadingOut, setFadingOut] = useState(false);

  const handleEnd = () => {
    setFadingOut(true);
    setTimeout(() => onEnded(), 500);
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-black flex items-center justify-center transition-opacity duration-500 ${
        fadingOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <video
        src="/intro_qaphoy.mp4"
        autoPlay
        muted
        playsInline
        onEnded={handleEnd}
        className="w-full h-full object-contain"
      />
      <button
        onClick={handleEnd}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 px-6 py-2 bg-white/20 text-white rounded-full backdrop-blur-sm text-sm"
      >
        Saltar intro
      </button>
    </div>
  );
}
