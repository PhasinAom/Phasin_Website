"use client";

import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import LiquidEther from "@/components/ui/liquid-ether";

/* ---------------------------------------------------------------- WordsPullUp */
interface WordsPullUpProps {
  text: string;
  className?: string;
  showAsterisk?: boolean;
  style?: React.CSSProperties;
  ready?: boolean;
}

const WordsPullUp = ({ text, className = "", showAsterisk = false, style, ready = true }: WordsPullUpProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const shouldAnimate = ready && isInView;
  const words = text.split(" ");
  return (
    <div ref={ref} className={`inline-flex flex-wrap ${className}`} style={style}>
      {words.map((word, i) => {
        const isLast = i === words.length - 1;
        return (
          <motion.span
            key={i}
            initial={{ y: 20, opacity: 0 }}
            animate={shouldAnimate ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block relative"
            style={{ marginRight: isLast ? 0 : "0.25em" }}
          >
            {word}
            {showAsterisk && isLast && (
              <span className="absolute top-[0.65em] -right-[0.3em] text-[0.31em]">*</span>
            )}
          </motion.span>
        );
      })}
    </div>
  );
};

/* ---------------------------------------------------------------- useScramble */
const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function useScramble(text: string, startDelay = 300): string {
  const [display, setDisplay] = useState("");
  useEffect(() => {
    let rafId: number;
    const timer = setTimeout(() => {
      const DURATION = 1600;
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / DURATION, 1);
        const result = text.split("").map((ch, i) => {
          if (ch === " ") return " ";
          const threshold = (i / text.length) * 0.55 + 0.45;
          if (t >= threshold) return ch;
          return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        }).join("");
        setDisplay(result);
        if (t < 1) rafId = requestAnimationFrame(tick);
        else setDisplay(text);
      };
      rafId = requestAnimationFrame(tick);
    }, startDelay);
    return () => { clearTimeout(timer); cancelAnimationFrame(rafId); };
  }, [text, startDelay]);
  return display;
}

/* ---------------------------------------------------------------- HeroIntro */
const INTRO_TEXT = "Welcome to my website";
const INTRO_KEY  = "phasin-intro-shown";

const HeroIntro = ({ onComplete }: { onComplete: () => void }) => {
  const scrambled    = useScramble(INTRO_TEXT.toUpperCase(), 400);
  const overlayRef   = useRef<HTMLDivElement>(null);
  const completedRef = useRef(false);
  const targetRef    = useRef(0);
  const currentRef   = useRef(0);
  const rafRef       = useRef<number>(0);

  const progress       = useMotionValue(0);
  const contentOpacity = useTransform(progress, [0, 0.35], [1, 0]);
  const hintOpacity    = useTransform(progress, [0, 0.12], [1, 0]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const LERP = 0.10;

    const tick = () => {
      const diff = targetRef.current - currentRef.current;
      const done = Math.abs(diff) < 0.0008;
      currentRef.current = done ? targetRef.current : currentRef.current + diff * LERP;

      const p = currentRef.current;
      progress.set(p);
      if (overlayRef.current) {
        overlayRef.current.style.transform = `translateY(${p * -100}%)`;
      }

      if (!done) {
        rafRef.current = requestAnimationFrame(tick);
      } else if (p >= 1 && !completedRef.current) {
        completedRef.current = true;
        sessionStorage.setItem(INTRO_KEY, "1");
        setTimeout(onComplete, 200);
      }
    };

    const advance = (delta: number) => {
      if (completedRef.current) return;
      targetRef.current = Math.min(1, Math.max(0, targetRef.current + delta));
      // Auto-complete once past halfway — overlay flies away
      if (targetRef.current > 0.5) targetRef.current = 1;
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (completedRef.current) return;
      advance(e.deltaY / (window.innerHeight * 0.55));
    };
    let touchY = 0;
    const onTouchStart = (e: TouchEvent) => { touchY = e.touches[0].clientY; };
    const onTouchMove  = (e: TouchEvent) => {
      e.preventDefault();
      if (completedRef.current) return;
      const dy = touchY - e.touches[0].clientY;
      touchY   = e.touches[0].clientY;
      advance(dy / (window.innerHeight * 0.55));
    };
    window.addEventListener("wheel",      onWheel,      { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove",  onTouchMove,  { passive: false });
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("wheel",      onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove",  onTouchMove);
    };
  }, [progress, onComplete]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black will-change-transform"
    >
      {/* Fluid simulation background */}
      <div className="absolute inset-0 pointer-events-none">
        <LiquidEther
          colors={['#000000', '#111111', '#444444', '#E1E0CC']}
          autoDemo={true}
          autoSpeed={0.4}
          autoIntensity={2.5}
          resolution={0.4}
          mouseForce={25}
          cursorSize={120}
        />
      </div>

      {/* Film grain on top of fluid */}
      <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.35] mix-blend-overlay" />

      {/* Thin ivory line at the bottom edge — visible as curtain slides up */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: "rgba(225,224,204,0.25)" }}
      />

      {/* Scramble text */}
      <motion.div style={{ opacity: contentOpacity }} className="flex flex-col items-center gap-5 px-6 text-center">
        <p
          className="font-sans font-medium text-sm sm:text-base"
          style={{ letterSpacing: "0.35em", color: "rgba(225,224,204,0.6)", fontVariantNumeric: "tabular-nums" }}
        >
          {scrambled || " "}
        </p>
        <motion.div
          className="h-px origin-center"
          initial={{ width: 0 }}
          animate={{ width: "4rem" }}
          transition={{ delay: 1.2, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ background: "rgba(225,224,204,0.18)" }}
        />
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        style={{ opacity: hintOpacity }}
        className="absolute bottom-10 flex flex-col items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
      >
        <span className="text-[10px] uppercase tracking-[0.45em]" style={{ color: "rgba(225,224,204,0.22)" }}>
          scroll to enter
        </span>
        <motion.div
          className="w-px"
          style={{ background: "linear-gradient(to bottom, transparent, rgba(225,224,204,0.22))" }}
          animate={{ height: [14, 28, 14] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </div>
  );
};

/* ---------------------------------------------------------------- Hero */
const navItems = [
  { label: "About",    href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Contact",  href: "#contact" },
];

const VIDEOS = [
  "/a_a_mp_ (1).mp4",
  "/b_c_f_da_videomp_ (1).mp4",
];

const SWITCH_INTERVAL_MS = 5 * 60 * 1000;

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function smoothScrollTo(targetY: number, duration = 900) {
  const startY = window.scrollY;
  const diff   = targetY - startY;
  let startTime: number | null = null;
  function step(timestamp: number) {
    if (!startTime) startTime = timestamp;
    const elapsed  = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    window.scrollTo(0, startY + diff * easeInOutCubic(progress));
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

export const Hero = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrolled,    setScrolled]    = useState(false);
  const [showIntro,   setShowIntro]   = useState(false);
  const [heroReady,   setHeroReady]   = useState(false);

  useEffect(() => {
    const alreadySeen = sessionStorage.getItem(INTRO_KEY);
    if (alreadySeen) { setHeroReady(true); } else { setShowIntro(true); }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setActiveIndex((p) => (p + 1) % VIDEOS.length), SWITCH_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
    setHeroReady(true);
  }, []);

  return (
    <>
      {showIntro && <HeroIntro onComplete={handleIntroComplete} />}

      <section className="h-screen w-full">
        <div className="relative h-full w-full overflow-hidden rounded-2xl md:rounded-[2rem]">

          {/* Videos — start zoomed, pull back on reveal */}
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.08 }}
            animate={heroReady ? { scale: 1 } : { scale: 1.08 }}
            transition={{ duration: 2.0, ease: [0.16, 1, 0.3, 1] }}
          >
            {VIDEOS.map((src, i) => (
              <video
                key={src}
                autoPlay loop muted playsInline
                className="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000"
                style={{ opacity: i === activeIndex ? 1 : 0 }}
                src={src}
              />
            ))}
          </motion.div>

          <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.7] mix-blend-overlay" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

          {/* Navbar */}
          <nav className="fixed left-1/2 top-0 z-50 -translate-x-1/2">
            <div
              className="flex items-center gap-4 rounded-b-2xl px-5 py-2 sm:gap-6 md:gap-12 md:rounded-b-3xl md:px-8 lg:gap-14 transition-all duration-500"
              style={{
                backgroundColor: scrolled ? "rgba(0,0,0,0.85)" : "#000000",
                backdropFilter:  scrolled ? "blur(12px)" : "none",
                boxShadow:       scrolled ? "0 4px 24px rgba(0,0,0,0.4)" : "none",
              }}
            >
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-sm transition-colors md:text-base cursor-pointer"
                  style={{ color: "rgba(225, 224, 204, 0.8)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#E1E0CC")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(225, 224, 204, 0.8)")}
                  onClick={(e) => {
                    e.preventDefault();
                    const target = document.querySelector(item.href);
                    if (target) smoothScrollTo(target.getBoundingClientRect().top + window.scrollY, 900);
                  }}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </nav>

          {/* Hero content */}
          <div className="absolute bottom-0 left-0 right-0">
            <h1
              className="font-medium leading-[0.85] tracking-[-0.07em] text-[20vw] sm:text-[22vw] md:text-[22vw] lg:text-[20vw] xl:text-[19vw] 2xl:text-[20vw]"
              style={{ color: "#E1E0CC" }}
            >
              <WordsPullUp text="Welcome" showAsterisk ready={heroReady} />
            </h1>
            <div className="pb-5 pt-2 px-4 sm:px-6 md:pb-8 md:pt-3 md:px-10">
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={heroReady ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-xs text-xs sm:text-sm md:text-base font-medium"
                style={{ color: "rgba(225, 224, 204, 0.75)", lineHeight: 1.5 }}
              >
                Creative developer. I build things that look good and work even better.
              </motion.p>
            </div>
          </div>

        </div>
      </section>
    </>
  );
};
