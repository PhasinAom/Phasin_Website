'use client';

import { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { projects } from '@/lib/projects';

gsap.registerPlugin(ScrollTrigger);

const N = projects.length;

function eio(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}
function remap(v: number, a: number, b: number) {
  return Math.max(0, Math.min(1, (v - a) / (b - a)));
}

export function ProjectCarousel() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  const imgRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const titleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const metaRefs  = useRef<(HTMLDivElement | null)[]>([]);
  const bgRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const counterRef  = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const dotRefs   = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const up = () => setReducedMotion(mq.matches);
    up();
    mq.addEventListener('change', up);
    return () => mq.removeEventListener('change', up);
  }, []);

  useGSAP(
    () => {
      if (!sectionRef.current || reducedMotion) return;

      const scrollDist = (N - 1) * window.innerHeight;

      // ── Initial state ────────────────────────────────────────────────────────
      imgRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.set(el, {
          clipPath: i === 0
            ? 'inset(0% 0% 0% 0% round 1.25rem)'
            : 'inset(100% 0% 0% 0% round 1.25rem)',
        });
      });
      titleRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.set(el, { opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 64 });
      });
      metaRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.set(el, { opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 24 });
      });
      bgRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.set(el, { opacity: i === 0 ? 1 : 0 });
      });

      // ── Main scrubbed trigger ────────────────────────────────────────────────
      const st = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: `+=${scrollDist}`,
        pin: true,
        scrub: 1.2,
        onUpdate(self) {
          const raw      = self.progress * (N - 1);
          const tIdx     = Math.min(Math.floor(raw), N - 2); // which transition (0 or 1)
          const local    = raw - tIdx;                        // 0→1 within this transition
          const from     = tIdx;
          const to       = tIdx + 1;
          const newActive = local > 0.5 ? to : from;

          setActiveIdx(newActive);

          if (counterRef.current) {
            counterRef.current.textContent = String(newActive + 1).padStart(2, '0');
          }
          if (progressRef.current) {
            progressRef.current.style.transform = `scaleX(${self.progress})`;
          }
          dotRefs.current.forEach((dot, i) => {
            if (!dot) return;
            dot.style.height  = i === newActive ? '2rem' : '0.375rem';
            dot.style.opacity = i === newActive ? '1'    : '0.25';
          });

          projects.forEach((_, i) => {
            const img   = imgRefs.current[i];
            const title = titleRefs.current[i];
            const meta  = metaRefs.current[i];
            const bg    = bgRefs.current[i];
            if (!img || !title || !meta) return;

            if (i === from) {
              // ── Outgoing: image wipes UP from bottom ──────────────────────
              const imgOut  = eio(remap(local, 0.25, 0.85));
              gsap.set(img, { clipPath: `inset(0% 0% ${imgOut * 100}% 0% round 1.25rem)` });

              const textOut = eio(remap(local, 0.05, 0.55));
              gsap.set(title, { opacity: 1 - textOut, y: -textOut * 48 });
              gsap.set(meta,  { opacity: 1 - eio(remap(local, 0.1, 0.5)), y: -(eio(remap(local, 0.1, 0.5))) * 20 });
              if (bg) gsap.set(bg, { opacity: 1 - eio(remap(local, 0.15, 0.65)) });

            } else if (i === to) {
              // ── Incoming: image drops DOWN from top ───────────────────────
              const imgIn   = eio(remap(local, 0.15, 0.75));
              gsap.set(img, { clipPath: `inset(${(1 - imgIn) * 100}% 0% 0% 0% round 1.25rem)` });

              const textIn  = eio(remap(local, 0.4, 0.95));
              gsap.set(title, { opacity: textIn, y: (1 - textIn) * 64 });
              const metaIn  = eio(remap(local, 0.55, 1.0));
              gsap.set(meta,  { opacity: metaIn, y: (1 - metaIn) * 24 });
              if (bg) gsap.set(bg, { opacity: eio(remap(local, 0.05, 0.55)) });

            } else if (i < from) {
              // Already visited
              gsap.set(img,   { clipPath: 'inset(0% 0% 100% 0% round 1.25rem)' });
              gsap.set(title, { opacity: 0, y: -48 });
              gsap.set(meta,  { opacity: 0, y: -20 });
              if (bg) gsap.set(bg, { opacity: 0 });
            } else {
              // Not yet reached
              gsap.set(img,   { clipPath: 'inset(100% 0% 0% 0% round 1.25rem)' });
              gsap.set(title, { opacity: 0, y: 64 });
              gsap.set(meta,  { opacity: 0, y: 24 });
              if (bg) gsap.set(bg, { opacity: 0 });
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
    { scope: sectionRef, dependencies: [reducedMotion] },
  );

  return (
    <section
      ref={sectionRef}
      aria-label="Selected Work"
      className="relative w-full overflow-hidden"
      style={{ height: '100svh', background: '#000' }}
    >
      {/* ── Background colour layers ─────────────────────────────────────── */}
      {projects.map((p, i) => (
        <div
          key={p.id}
          ref={el => { bgRefs.current[i] = el; }}
          className="absolute inset-0"
          style={{ background: p.bg }}
        />
      ))}

      {/* ── Section label ────────────────────────────────────────────────── */}
      <div className="absolute top-8 left-[4vw] z-30 pointer-events-none">
        <span className="text-xs uppercase tracking-[0.3em]" style={{ color: 'rgba(225,224,204,0.35)' }}>
          Selected Work
        </span>
      </div>

      {/* ── Counter top-right ────────────────────────────────────────────── */}
      <div className="absolute top-8 right-[4vw] z-30 pointer-events-none flex items-baseline gap-1">
        <span ref={counterRef} className="text-xs font-medium tabular-nums" style={{ color: 'rgba(225,224,204,0.55)' }}>
          01
        </span>
        <span className="text-xs" style={{ color: 'rgba(225,224,204,0.2)' }}>
          / {String(N).padStart(2, '0')}
        </span>
      </div>

      {/* ── Giant ghost number ───────────────────────────────────────────── */}
      <div
        className="absolute inset-0 flex items-center justify-start pl-[3vw] pointer-events-none select-none z-20"
        aria-hidden
      >
        <span
          className="font-bold leading-none transition-none"
          style={{
            fontSize: 'clamp(14rem, 38vw, 30rem)',
            color: 'rgba(225,224,204,0.03)',
            letterSpacing: '-0.06em',
          }}
        >
          {String(activeIdx + 1).padStart(2, '0')}
        </span>
      </div>

      {/* ── Main split layout ────────────────────────────────────────────── */}
      <div className="absolute inset-0 flex flex-col lg:flex-row gap-4 lg:gap-12 px-[4vw] pt-20 pb-14">

        {/* Left — editorial text */}
        <div className="relative w-full lg:w-[42%] flex-shrink-0 flex items-center z-10 h-[48%] lg:h-full">
          {projects.map((p, i) => (
            <div
              key={p.id}
              ref={el => { titleRefs.current[i] = el; }}
              className="absolute inset-0 flex flex-col justify-center gap-4 lg:gap-6 will-change-transform"
            >
              {/* Huge editorial title */}
              <h3
                className="font-bold leading-[0.85] tracking-[-0.05em]"
                style={{ fontSize: 'clamp(2.2rem, 7.5vw, 6.5rem)', color: p.accent }}
              >
                {p.title.split(' ').map((w, wi) => (
                  <span key={wi} className="block">{w}</span>
                ))}
              </h3>

              {/* Meta — fades slightly after title */}
              <div
                ref={el => { metaRefs.current[i] = el; }}
                className="flex flex-col gap-3 lg:gap-4 will-change-transform"
              >
                <p className="text-sm lg:text-lg leading-relaxed max-w-xs" style={{ color: `${p.accent}55` }}>
                  {p.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {p.role.map(r => (
                    <span
                      key={r}
                      className="text-[10px] uppercase tracking-[0.25em] px-3 py-1.5 rounded-full"
                      style={{
                        background: `${p.accent}07`,
                        border: `1px solid ${p.accent}1a`,
                        color: `${p.accent}45`,
                      }}
                    >
                      {r}
                    </span>
                  ))}

                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right — image curtain stack */}
        <div className="relative flex-1 min-h-0 z-10">
          {projects.map((p, i) => (
            <div
              key={p.id}
              ref={el => { imgRefs.current[i] = el; }}
              className="absolute inset-0 will-change-transform overflow-hidden"
              style={{ borderRadius: '1.25rem' }}
            >
              {p.image && (
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              )}
              <div
                className="absolute inset-0"
                style={{ background: `linear-gradient(160deg, ${p.bg}55 0%, transparent 55%)` }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Left-side progress dots ──────────────────────────────────────── */}
      <div
        className="absolute left-5 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-2"
        aria-hidden
      >
        {projects.map((_, i) => (
          <div
            key={i}
            ref={el => { dotRefs.current[i] = el; }}
            className="w-[3px] rounded-full transition-all duration-500"
            style={{
              height: i === activeIdx ? '2rem' : '0.375rem',
              opacity: i === activeIdx ? 1 : 0.25,
              background: '#E1E0CC',
            }}
          />
        ))}
      </div>

      {/* ── Bottom progress bar ──────────────────────────────────────────── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px z-30"
        style={{ background: 'rgba(225,224,204,0.07)' }}
      >
        <div
          ref={progressRef}
          className="h-full origin-left will-change-transform"
          style={{ background: 'rgba(225,224,204,0.6)', transform: 'scaleX(0)' }}
        />
      </div>

      {/* ── Scroll hint ──────────────────────────────────────────────────── */}
      <div
        className="absolute bottom-5 right-[4vw] z-30 pointer-events-none transition-opacity duration-700"
        style={{ opacity: activeIdx === 0 ? 1 : 0 }}
      >
        <span className="text-[10px] uppercase tracking-[0.3em]" style={{ color: 'rgba(225,224,204,0.18)' }}>
          scroll
        </span>
      </div>
    </section>
  );
}
