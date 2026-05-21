'use client';

import { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
  GlobalSearchIcon,
  AiCloudIcon,
  DashboardSquare01Icon,
  MagicWandIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

gsap.registerPlugin(ScrollTrigger);

const PRODUCTS = [
  {
    id: 'portfolio',
    label: 'Custom Websites',
    icon: GlobalSearchIcon,
    image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=1200',
    description: 'Clean, fast custom websites crafted with modern design and attention to detail.',
  },
  {
    id: 'carrental',
    label: 'Car Rental System',
    icon: DashboardSquare01Icon,
    image: 'https://images.unsplash.com/photo-1485291571150-772bcfc10da5?q=80&w=1200',
    description: 'End-to-end car rental platform — 200+ cars, booking management, real-time availability.',
  },
  {
    id: 'linecrm',
    label: 'Line Automation CRM',
    icon: AiCloudIcon,
    image: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?q=80&w=1200',
    description: 'Automated CRM built on LINE — managing leads, messages, and customer journeys at scale.',
  },
  {
    id: 'hotel',
    label: 'Hotel Website',
    icon: MagicWandIcon,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200',
    description: 'A premium hotel website with room browsing, booking flow, and a polished guest experience.',
    inProgress: true,
  },
];

const N = PRODUCTS.length;

// Ease helpers (no deps)
function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}
function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}
function remap(v: number, inMin: number, inMax: number) {
  return clamp01((v - inMin) / (inMax - inMin));
}

export function FeatureCarousel() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const imgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useGSAP(
    () => {
      if (!wrapperRef.current || reducedMotion || isMobile) return;

      const scrollDist = N * window.innerHeight;
      const scrub = 1;

      // Initial state — all hidden; onUpdate reveals as user scrolls in
      imgRefs.current.forEach((el) => {
        if (!el) return;
        gsap.set(el, { clipPath: 'inset(0 100% 0 0 round 1rem)', opacity: 0 });
      });
      contentRefs.current.forEach((el) => {
        if (!el) return;
        gsap.set(el, { opacity: 0, y: 40 });
      });

      const st = ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: 'top top',
        end: `+=${scrollDist}`,
        pin: true,
        anticipatePin: 1,
        scrub,
        onUpdate(self) {
          const raw = self.progress * N;
          const idx = Math.min(Math.floor(raw), N - 1);
          const local = raw - idx; // 0→1 within this product's segment

          setActiveIdx(idx);

          if (counterRef.current) {
            counterRef.current.textContent = String(idx + 1).padStart(2, '0');
          }
          if (progressRef.current) {
            progressRef.current.style.transform = `scaleX(${self.progress})`;
          }

          // Update dot sizes
          dotRefs.current.forEach((dot, i) => {
            if (!dot) return;
            dot.style.height = i === idx ? '2rem' : '0.375rem';
            dot.style.opacity = i === idx ? '1' : '0.25';
          });

          PRODUCTS.forEach((_, i) => {
            const img = imgRefs.current[i];
            const content = contentRefs.current[i];
            if (!img || !content) return;

            if (i === idx) {
              // Reveal: clip from right → 0 over first 35% of segment
              const inT = easeInOut(remap(local, 0, 0.35));
              // Exit: clip from left → 100% over last 25%
              const outT = easeInOut(remap(local, 0.75, 1.0));

              const right = (1 - inT) * 100;
              const left = outT * 100;
              gsap.set(img, {
                clipPath: `inset(0 ${right}% 0 ${left}% round 1rem)`,
                opacity: 1 - outT * 0.4,
              });

              // Content: slides up on enter, fades on exit
              const contentIn = remap(local, 0, 0.4);
              const contentOut = remap(local, 0.75, 1.0);
              gsap.set(content, {
                opacity: contentIn * (1 - contentOut),
                y: (1 - contentIn) * 40 - contentOut * 20,
              });
            } else if (i < idx) {
              gsap.set(img, { clipPath: 'inset(0 0% 0 100% round 1rem)', opacity: 0 });
              gsap.set(content, { opacity: 0, y: -20 });
            } else {
              gsap.set(img, { clipPath: 'inset(0 100% 0 0 round 1rem)', opacity: 0 });
              gsap.set(content, { opacity: 0, y: 40 });
            }
          });
        },
      });

      const onResize = () => ScrollTrigger.refresh();
      window.addEventListener('resize', onResize);

      return () => {
        st.kill();
        window.removeEventListener('resize', onResize);
      };
    },
    { scope: wrapperRef, dependencies: [reducedMotion, isMobile] },
  );

  if (isMobile) {
    return (
      <div className="bg-black px-5 py-16">
        <span className="text-xs uppercase tracking-[0.3em] mb-10 block" style={{ color: 'rgba(225,224,204,0.35)' }}>
          Things That I Build
        </span>
        <div className="flex flex-col gap-10">
          {PRODUCTS.map((product) => (
            <div key={product.id} className="flex flex-col gap-4">
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden">
                <img src={product.image} alt={product.label} className="w-full h-full object-cover" draggable={false} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, transparent 60%)' }} />
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0"
                  style={{ background: 'rgba(225,224,204,0.06)', border: '1px solid rgba(225,224,204,0.1)' }}
                >
                  <HugeiconsIcon icon={product.icon} size={16} strokeWidth={1.5} color="rgba(225,224,204,0.7)" />
                </div>
                {product.inProgress && (
                  <span className="text-[10px] uppercase tracking-[0.3em] px-3 py-1 rounded-full" style={{ background: 'rgba(251,191,36,0.08)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.2)' }}>
                    In Progress
                  </span>
                )}
              </div>
              <h3 className="text-2xl font-bold tracking-tight leading-tight" style={{ color: '#E1E0CC' }}>
                {product.label}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(225,224,204,0.5)' }}>
                {product.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={wrapperRef}
      className="relative w-full overflow-hidden bg-black"
      style={{ height: '100svh' }}
    >
      {/* Section heading */}
      <div className="absolute top-8 left-[4vw] z-20 pointer-events-none">
        <span
          className="text-xs uppercase tracking-[0.3em]"
          style={{ color: 'rgba(225,224,204,0.35)' }}
        >
          Things That I Build
        </span>
      </div>

      {/* Giant background counter */}
      <div
        className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none select-none"
        aria-hidden
      >
        <span
          ref={counterRef}
          className="font-bold leading-none"
          style={{
            fontSize: 'clamp(12rem, 35vw, 28rem)',
            color: 'rgba(225,224,204,0.03)',
            letterSpacing: '-0.05em',
          }}
        >
          01
        </span>
      </div>

      {/* Main layout */}
      <div className="absolute inset-0 flex flex-col lg:flex-row items-center gap-4 lg:gap-16 px-[4vw] pt-24 pb-16">

        {/* Left: content stack */}
        <div className="relative w-full lg:w-[38%] flex-shrink-0 flex items-center h-[48%] lg:h-full">
          {PRODUCTS.map((product, i) => (
            <div
              key={product.id}
              ref={(el) => { contentRefs.current[i] = el; }}
              className="absolute inset-0 flex flex-col justify-center gap-4 lg:gap-6 will-change-transform"
              style={{ opacity: 0 }}
            >
              {/* Icon + status */}
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-xl"
                  style={{ background: 'rgba(225,224,204,0.06)', border: '1px solid rgba(225,224,204,0.1)' }}
                >
                  <HugeiconsIcon icon={product.icon} size={18} strokeWidth={1.5} color="rgba(225,224,204,0.7)" />
                </div>
                {product.inProgress && (
                  <span
                    className="text-[10px] uppercase tracking-[0.3em] px-3 py-1 rounded-full"
                    style={{ background: 'rgba(251,191,36,0.08)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.2)' }}
                  >
                    In Progress
                  </span>
                )}
              </div>

              {/* Title */}
              <h3
                className="font-bold leading-[0.9] tracking-[-0.04em]"
                style={{
                  fontSize: 'clamp(2rem, 5vw, 4.5rem)',
                  color: '#E1E0CC',
                }}
              >
                {product.label}
              </h3>

              {/* Description */}
              <p
                className="text-sm lg:text-lg leading-relaxed max-w-full lg:max-w-sm"
                style={{ color: 'rgba(225,224,204,0.5)' }}
              >
                {product.description}
              </p>

              {/* Index */}
              <span
                className="text-xs uppercase tracking-[0.3em]"
                style={{ color: 'rgba(225,224,204,0.2)' }}
              >
                {String(i + 1).padStart(2, '0')} — {String(N).padStart(2, '0')}
              </span>
            </div>
          ))}
        </div>

        {/* Right: image stack */}
        <div className="relative flex-1 min-h-0 w-full h-[48%] lg:h-full rounded-2xl overflow-visible">
          {PRODUCTS.map((product, i) => (
            <div
              key={product.id}
              ref={(el) => { imgRefs.current[i] = el; }}
              className="absolute inset-0 will-change-transform"
              style={{ borderRadius: '1rem', overflow: 'hidden', opacity: 0 }}
            >
              <img
                src={product.image}
                alt={product.label}
                className="w-full h-full object-cover"
                draggable={false}
              />
              {/* Overlay gradient */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, transparent 60%)',
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Side progress dots */}
      <div
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-2"
        aria-hidden
      >
        {PRODUCTS.map((_, i) => (
          <div
            key={i}
            ref={(el) => { dotRefs.current[i] = el; }}
            className="w-[3px] rounded-full transition-all duration-500"
            style={{
              height: i === activeIdx ? '2rem' : '0.375rem',
              opacity: i === activeIdx ? 1 : 0.25,
              background: '#E1E0CC',
            }}
          />
        ))}
      </div>

      {/* Bottom progress bar */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px z-20"
        style={{ background: 'rgba(225,224,204,0.08)' }}
      >
        <div
          ref={progressRef}
          className="h-full origin-left will-change-transform"
          style={{ background: '#E1E0CC', transform: 'scaleX(0)' }}
        />
      </div>

      {/* Scroll hint */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center gap-2"
        style={{ opacity: activeIdx === 0 ? 1 : 0, transition: 'opacity 0.5s' }}
      >
        <span
          className="text-[10px] uppercase tracking-[0.3em]"
          style={{ color: 'rgba(225,224,204,0.2)' }}
        >
          scroll
        </span>
      </div>
    </div>
  );
}

export default FeatureCarousel;
