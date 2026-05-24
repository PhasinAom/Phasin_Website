'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MobileCarouselProps {
  label: string;
  items: React.ReactNode[];
  reducedMotion?: boolean;
}

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? '-60%' : '60%', opacity: 0 }),
};

const fadeVariants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

export function MobileCarousel({ label, items, reducedMotion = false }: MobileCarouselProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [direction, setDirection] = useState(1);
  const count = items.length;

  const navigate = (newIdx: number) => {
    setDirection(newIdx > activeIdx ? 1 : -1);
    setActiveIdx(newIdx);
  };

  const handleDragEnd = (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
    const { offset, velocity } = info;
    if (offset.x < -50 || velocity.x < -500) {
      if (activeIdx < count - 1) navigate(activeIdx + 1);
    } else if (offset.x > 50 || velocity.x > 500) {
      if (activeIdx > 0) navigate(activeIdx - 1);
    }
  };

  const variants = reducedMotion ? fadeVariants : slideVariants;

  return (
    <div className="bg-black px-5 py-16">
      <div className="flex items-center justify-between mb-10">
        <span
          className="text-xs uppercase tracking-[0.3em]"
          style={{ color: 'rgba(225,224,204,0.35)' }}
        >
          {label}
        </span>
        <span className="text-xs tabular-nums" style={{ color: 'rgba(225,224,204,0.25)' }}>
          {String(activeIdx + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
        </span>
      </div>

      <div className="relative overflow-hidden">
        <AnimatePresence initial={false} mode="wait" custom={direction}>
          <motion.div
            key={activeIdx}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 320, damping: 36, mass: 0.85 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.12}
            onDragEnd={handleDragEnd}
            style={{ touchAction: 'pan-y' }}
            className="cursor-grab active:cursor-grabbing select-none"
          >
            {items[activeIdx]}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center items-center gap-1 mt-8" role="tablist" aria-label={label}>
        {items.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === activeIdx}
            aria-label={`Slide ${i + 1} of ${count}`}
            onClick={() => navigate(i)}
            className="flex items-center justify-center cursor-pointer"
            style={{ minWidth: 44, minHeight: 44 }}
          >
            <motion.div
              className="rounded-full"
              animate={{
                width: i === activeIdx ? 24 : 6,
                opacity: i === activeIdx ? 1 : 0.25,
              }}
              transition={{ duration: 0.25 }}
              style={{ height: 6, background: '#E1E0CC' }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
