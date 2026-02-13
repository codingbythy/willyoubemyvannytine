"use client";

import { useState, useCallback, useEffect, useRef } from "react";

const HEART_EMOJIS = ["❤️", "💕", "💖", "💗", "💘", "💝", "💓", "💞", "🌹", "😍"];
const CONFETTI_COLORS = [
  "#dc2626", "#ef4444", "#f87171", "#fb7185", "#f43f5e",
  "#e11d48", "#be123c", "#ff6b6b", "#ee5a24", "#ff9ff3",
];

const NO_BUTTON_TEXTS = [
  "No",
  "Are you sure?",
  "Really sure?",
  "Think again!",
  "Last chance!",
  "Surely not?",
  "You might regret this!",
  "Give it another thought!",
  "Are you crazy?!",
  "I'm gonna cry...",
  "Please? 🥺",
  "Pretty please?",
  "Don't do this to me!",
  "I'll be sad 😢",
  "NOOOOO!",
];

interface FloatingHeart {
  id: number;
  emoji: string;
  left: number;
  duration: number;
  delay: number;
  size: number;
}

interface ConfettiPiece {
  id: number;
  left: number;
  color: string;
  duration: number;
  delay: number;
  size: number;
  shape: "square" | "circle" | "heart";
}

function FloatingHearts() {
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);

  useEffect(() => {
    const generated: FloatingHeart[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      emoji: HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)],
      left: Math.random() * 100,
      duration: 6 + Math.random() * 8,
      delay: Math.random() * 10,
      size: 16 + Math.random() * 24,
    }));
    setHearts(generated);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute animate-float-up"
          style={{
            left: `${heart.left}%`,
            fontSize: `${heart.size}px`,
            animationDuration: `${heart.duration}s`,
            animationDelay: `${heart.delay}s`,
          }}
        >
          {heart.emoji}
        </div>
      ))}
    </div>
  );
}

function Confetti() {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    const shapes: ConfettiPiece["shape"][] = ["square", "circle", "heart"];
    const generated: ConfettiPiece[] = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      duration: 2 + Math.random() * 3,
      delay: Math.random() * 2,
      size: 6 + Math.random() * 10,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
    }));
    setPieces(generated);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute animate-confetti-fall"
          style={{
            left: `${piece.left}%`,
            width: piece.shape === "heart" ? undefined : `${piece.size}px`,
            height: piece.shape === "heart" ? undefined : `${piece.size}px`,
            backgroundColor: piece.shape === "heart" ? undefined : piece.color,
            borderRadius: piece.shape === "circle" ? "50%" : "2px",
            animationDuration: `${piece.duration}s`,
            animationDelay: `${piece.delay}s`,
            fontSize: piece.shape === "heart" ? `${piece.size}px` : undefined,
          }}
        >
          {piece.shape === "heart" ? "❤️" : null}
        </div>
      ))}
    </div>
  );
}

function Sparkles({ around }: { around: React.RefObject<HTMLDivElement | null> }) {
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number; delay: number }[]>([]);

  useEffect(() => {
    if (!around.current) return;
    const rect = around.current.getBoundingClientRect();
    const generated = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: rect.left + Math.random() * rect.width,
      y: rect.top + Math.random() * rect.height,
      delay: Math.random() * 2,
    }));
    setSparkles(generated);
  }, [around]);

  return (
    <>
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="fixed animate-sparkle pointer-events-none z-40"
          style={{
            left: `${s.x}px`,
            top: `${s.y}px`,
            animationDelay: `${s.delay}s`,
            fontSize: "14px",
          }}
        >
          ✨
        </div>
      ))}
    </>
  );
}

export default function Home() {
  const [accepted, setAccepted] = useState(false);
  const [noCount, setNoCount] = useState(0);
  const [yesBtnSize, setYesBtnSize] = useState(1);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleYes = useCallback(() => {
    setAccepted(true);
  }, []);

  const handleNo = useCallback(() => {
    setNoCount((prev) => prev + 1);
    setYesBtnSize((prev) => prev + 0.2);
  }, []);

  const noButtonText = NO_BUTTON_TEXTS[Math.min(noCount, NO_BUTTON_TEXTS.length - 1)];

  if (accepted) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-red-primary via-pink-glow to-red-dark">
        <FloatingHearts />
        <Confetti />
        <div className="relative z-10 flex flex-col items-center gap-8 p-8 animate-scale-in">
          <div className="text-8xl sm:text-9xl animate-pulse-heart">
            💖
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold text-white text-center drop-shadow-lg leading-tight">
            Yaaaay!!
          </h1>
          <p className="text-xl sm:text-2xl text-pink-light text-center max-w-md leading-relaxed">
            I knew you&apos;d say yes! You just made my heart skip a beat!
          </p>
          <div className="flex gap-4 text-5xl animate-bounce-in" style={{ animationDelay: "0.3s" }}>
            <span>🥰</span>
            <span>💕</span>
            <span>🥰</span>
          </div>
          <div
            className="mt-4 rounded-2xl bg-white/20 backdrop-blur-sm px-8 py-4 text-white text-lg font-medium animate-bounce-in"
            style={{ animationDelay: "0.6s" }}
          >
            Happy Valentine&apos;s Day! 💝
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-light via-background to-red-light">
      <FloatingHearts />

      <div
        ref={cardRef}
        className="relative z-10 flex flex-col items-center gap-6 rounded-3xl bg-white/80 backdrop-blur-md p-8 sm:p-12 shadow-2xl border border-red-light max-w-md mx-4 animate-scale-in"
      >
        <Sparkles around={cardRef} />

        <div className="text-7xl sm:text-8xl animate-pulse-heart select-none">
          ❤️
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-red-dark text-center leading-snug">
          Will You Be My Valentine?
        </h1>

        <p className="text-base text-red-primary/70 text-center">
          I have a very important question for you...
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 w-full">
          <button
            onClick={handleYes}
            className="rounded-full bg-red-primary text-white font-bold shadow-lg hover:bg-red-dark active:scale-95 transition-all cursor-pointer"
            style={{
              fontSize: `${Math.min(16 + noCount * 2, 32)}px`,
              padding: `${12 * yesBtnSize}px ${32 * yesBtnSize}px`,
              transform: `scale(${Math.min(yesBtnSize, 2.2)})`,
            }}
          >
            Yes! 💖
          </button>

          <NoButton text={noButtonText} onClick={handleNo} shrink={noCount} />
        </div>

        {noCount > 0 && (
          <p className="text-sm text-red-primary/60 animate-wiggle text-center">
            {noCount >= 5
              ? "The Yes button is getting bigger... just saying 👀"
              : "Are you really going to break my heart? 💔"}
          </p>
        )}
      </div>
    </div>
  );
}

function NoButton({
  text,
  onClick,
  shrink,
}: {
  text: string;
  onClick: () => void;
  shrink: number;
}) {
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleMouseEnter = useCallback(() => {
    if (shrink < 3 || !btnRef.current) return;
    const btn = btnRef.current;
    const parent = btn.parentElement;
    if (!parent) return;
    const parentRect = parent.getBoundingClientRect();
    const maxX = parentRect.width - btn.offsetWidth;
    const maxY = parentRect.height - btn.offsetHeight;
    const newX = Math.random() * maxX;
    const newY = Math.random() * maxY;
    btn.style.position = "absolute";
    btn.style.left = `${newX}px`;
    btn.style.top = `${newY}px`;
  }, [shrink]);

  const scale = Math.max(1 - shrink * 0.08, 0.4);
  const fontSize = Math.max(16 - shrink, 10);

  return (
    <button
      ref={btnRef}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      className="rounded-full border-2 border-red-primary text-red-primary font-semibold hover:bg-red-light/50 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
      style={{
        fontSize: `${fontSize}px`,
        padding: `${12 * scale}px ${24 * scale}px`,
        transform: `scale(${scale})`,
      }}
    >
      {text}
    </button>
  );
}
