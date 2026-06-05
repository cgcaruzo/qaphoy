"use client";

import { useEffect, useRef, useState } from "react";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const DRAG_THRESHOLD = 80;
const VELOCITY_THRESHOLD = 500;

export function BottomSheet({ isOpen, onClose, title, children }: BottomSheetProps) {
  const [translateY, setTranslateY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const startY = useRef(0);
  const startTranslateY = useRef(0);
  const velocity = useRef(0);
  const lastY = useRef(0);
  const lastTime = useRef(0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setTranslateY(0);
      setIsDragging(false);
    }
  }, [isOpen]);

  const handleStart = (clientY: number) => {
    startY.current = clientY;
    startTranslateY.current = translateY;
    lastY.current = clientY;
    lastTime.current = Date.now();
    velocity.current = 0;
    setIsDragging(true);
    setIsAnimating(false);
  };

  const handleMove = (clientY: number) => {
    if (!isDragging) return;

    const deltaY = clientY - startY.current;
    const newTranslateY = Math.max(0, deltaY);

    const now = Date.now();
    const timeDelta = now - lastTime.current;
    if (timeDelta > 0) {
      velocity.current = Math.abs((clientY - lastY.current) / timeDelta) * 1000;
    }

    lastY.current = clientY;
    lastTime.current = now;

    setTranslateY(newTranslateY);
  };

  const handleEnd = () => {
    setIsDragging(false);
    setIsAnimating(true);

    if (translateY > DRAG_THRESHOLD || velocity.current > VELOCITY_THRESHOLD) {
      onClose();
    } else {
      setTranslateY(0);
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  if (!isOpen) return null;

  const sheetStyle = {
    transform: `translateY(${translateY}px)`,
    transition: isDragging || isAnimating ? "none" : "transform 300ms ease-out",
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        onTouchStart={(e) => handleStart(e.touches[0].clientY)}
        onTouchMove={(e) => handleMove(e.touches[0].clientY)}
        onTouchEnd={handleEnd}
        onMouseDown={(e) => handleStart(e.clientY)}
        onMouseMove={(e) => isDragging && handleMove(e.clientY)}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
      />

      <div
        className="relative bg-card rounded-t-3xl max-h-[90vh] flex flex-col overflow-hidden"
        style={sheetStyle}
      >
        <div className="flex items-center justify-center pt-3 pb-2 px-4">
          <div className="w-10 h-1 bg-slate-300 rounded-full" />
        </div>

        <div className="flex items-center justify-between px-6 pb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 text-text-muted hover:text-foreground -mr-2"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6">{children}</div>
      </div>
    </div>
  );
}