"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GlobalSearchIcon,
  AiCloudIcon,
  DashboardSquare01Icon,
  MagicWandIcon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";

const PRODUCTS = [
  {
    id: "portfolio",
    label: "Custom Websites",
    icon: GlobalSearchIcon,
    image: "https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=1200",
    description: "Clean, fast custom websites crafted with modern design and attention to detail.",
  },
  {
    id: "carrental",
    label: "Car Rental System",
    icon: DashboardSquare01Icon,
    image: "https://images.unsplash.com/photo-1485291571150-772bcfc10da5?q=80&w=1200",
    description: "End-to-end car rental platform handling 200+ cars with booking management and real-time availability.",
  },
  {
    id: "linecrm",
    label: "Line Automation CRM",
    icon: AiCloudIcon,
    image: "https://images.unsplash.com/photo-1611746872915-64382b5c76da?q=80&w=1200",
    description: "Automated CRM built on LINE — managing leads, messages, and customer journeys at scale.",
  },
  {
    id: "hotel",
    label: "Hotel Website",
    icon: MagicWandIcon,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200",
    description: "A premium hotel website with room browsing, booking flow, and a polished guest experience.",
    inProgress: true,
  },
];

const AUTO_PLAY_INTERVAL = 3000;
const ITEM_HEIGHT = 65;

const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

export function FeatureCarousel() {
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const currentIndex =
    ((step % PRODUCTS.length) + PRODUCTS.length) % PRODUCTS.length;

  const nextStep = useCallback(() => {
    setStep((prev) => prev + 1);
  }, []);

  const handleChipClick = (index: number) => {
    const diff = (index - currentIndex + PRODUCTS.length) % PRODUCTS.length;
    if (diff > 0) setStep((s) => s + diff);
  };

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextStep, AUTO_PLAY_INTERVAL);
    return () => clearInterval(interval);
  }, [nextStep, isPaused]);

  const getCardStatus = (index: number) => {
    const diff = index - currentIndex;
    const len = PRODUCTS.length;
    let normalizedDiff = diff;
    if (diff > len / 2) normalizedDiff -= len;
    if (diff < -len / 2) normalizedDiff += len;
    if (normalizedDiff === 0) return "active";
    if (normalizedDiff === -1) return "prev";
    if (normalizedDiff === 1) return "next";
    return "hidden";
  };

  return (
    <div className="w-full max-w-7xl mx-auto md:p-8">
      <div className="relative overflow-hidden rounded-[2.5rem] lg:rounded-[4rem] flex flex-col lg:flex-row min-h-[600px] lg:aspect-video border border-[#E1E0CC]/10">

        {/* Left sidebar — dark theme */}
        <div className="w-full lg:w-[40%] min-h-[350px] md:min-h-[450px] lg:h-full relative z-30 flex flex-col items-start justify-center overflow-hidden px-8 md:px-16 lg:pl-16 bg-black">
          <div className="absolute inset-x-0 top-0 h-12 md:h-20 lg:h-16 bg-gradient-to-b from-black via-black/80 to-transparent z-40" />
          <div className="absolute inset-x-0 bottom-0 h-12 md:h-20 lg:h-16 bg-gradient-to-t from-black via-black/80 to-transparent z-40" />

          <div className="relative w-full h-full flex items-center justify-center lg:justify-start z-20">
            {PRODUCTS.map((product, index) => {
              const isActive = index === currentIndex;
              const distance = index - currentIndex;
              const wrappedDistance = wrap(
                -(PRODUCTS.length / 2),
                PRODUCTS.length / 2,
                distance
              );

              return (
                <motion.div
                  key={product.id}
                  style={{ height: ITEM_HEIGHT, width: "fit-content" }}
                  animate={{
                    y: wrappedDistance * ITEM_HEIGHT,
                    opacity: 1 - Math.abs(wrappedDistance) * 0.25,
                  }}
                  transition={{ type: "spring", stiffness: 90, damping: 22, mass: 1 }}
                  className="absolute flex items-center justify-start"
                >
                  <button
                    onClick={() => handleChipClick(index)}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    className={cn(
                      "relative flex items-center gap-4 px-6 md:px-10 lg:px-8 py-3.5 md:py-5 lg:py-4 rounded-full transition-all duration-700 text-left group border cursor-pointer",
                      isActive
                        ? "bg-[#E1E0CC] text-black border-[#E1E0CC]"
                        : "bg-transparent text-[#E1E0CC]/50 border-[#E1E0CC]/20 hover:border-[#E1E0CC]/40 hover:text-[#E1E0CC]"
                    )}
                  >
                    <div className={cn(
                      "flex items-center justify-center transition-colors duration-500",
                      isActive ? "text-black" : "text-[#E1E0CC]/40"
                    )}>
                      <HugeiconsIcon icon={product.icon} size={18} strokeWidth={2} />
                    </div>
                    <span className="font-normal text-sm md:text-[15px] tracking-tight whitespace-nowrap uppercase">
                      {product.label}
                    </span>
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right — image cards */}
        <div className="flex-1 min-h-[500px] md:min-h-[600px] lg:h-full relative bg-black flex items-center justify-center py-16 md:py-24 lg:py-16 px-6 md:px-12 lg:px-10 overflow-hidden border-t lg:border-t-0 lg:border-l border-[#E1E0CC]/10">
          <div className="relative w-full max-w-[420px] aspect-[4/5] flex items-center justify-center">
            {PRODUCTS.map((product, index) => {
              const status = getCardStatus(index);
              const isActive = status === "active";
              const isPrev = status === "prev";
              const isNext = status === "next";

              return (
                <motion.div
                  key={product.id}
                  initial={false}
                  animate={{
                    x: isActive ? 0 : isPrev ? -100 : isNext ? 100 : 0,
                    scale: isActive ? 1 : isPrev || isNext ? 0.85 : 0.7,
                    opacity: isActive ? 1 : isPrev || isNext ? 0.4 : 0,
                    rotate: isPrev ? -3 : isNext ? 3 : 0,
                    zIndex: isActive ? 20 : isPrev || isNext ? 10 : 0,
                    pointerEvents: isActive ? "auto" : "none",
                  }}
                  transition={{ type: "spring", stiffness: 260, damping: 25, mass: 0.8 }}
                  className="absolute inset-0 rounded-[2rem] md:rounded-[2.8rem] overflow-hidden border-4 md:border-8 border-[#111] bg-[#111] origin-center"
                >
                  <img
                    src={product.image}
                    alt={product.label}
                    className={cn(
                      "w-full h-full object-cover transition-all duration-700",
                      isActive ? "grayscale-0 blur-0" : "grayscale blur-[2px] brightness-75"
                    )}
                  />

                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute inset-x-0 bottom-0 p-10 pt-32 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end pointer-events-none"
                      >
                        <div className="bg-[#E1E0CC] text-black px-4 py-1.5 rounded-full text-[11px] font-normal uppercase tracking-[0.2em] w-fit mb-3">
                          {index + 1} • {product.label}
                        </div>
                        <p className="text-[#E1E0CC] font-normal text-xl md:text-2xl leading-tight tracking-tight drop-shadow-md">
                          {product.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className={cn(
                    "absolute top-8 left-8 flex items-center gap-3 transition-opacity duration-300",
                    isActive ? "opacity-100" : "opacity-0"
                  )}>
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      product.inProgress
                        ? "bg-amber-400 shadow-[0_0_10px_theme(colors.amber.400)]"
                        : "bg-[#E1E0CC] shadow-[0_0_10px_#E1E0CC]"
                    )} />
                    <span className={cn(
                      "text-[11px] font-semibold uppercase tracking-[0.3em] font-mono",
                      product.inProgress ? "text-amber-400" : "text-white"
                    )}>
                      {product.inProgress ? "In Progress" : "Live Preview"}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

export default FeatureCarousel;
