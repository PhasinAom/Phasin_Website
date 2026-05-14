"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const PHOTOS = ["/IMG_7706.jpeg", "/IMG_7969.JPG"];
const PHOTO_INTERVAL_MS = 4000;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
});

function TiltCard({ className, style, children }: {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>(0);
  const [transform, setTransform] = useState("rotateX(0deg) rotateY(0deg) scale(1)");
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      const rect = ref.current!.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rotX = (0.5 - y) * 14;
      const rotY = (x - 0.5) * 14;
      setTransform(`rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`);
      setGlare({ x: x * 100, y: y * 100, opacity: 0.12 });
    });
  };

  const onMouseLeave = () => {
    cancelAnimationFrame(frameRef.current);
    setTransform("rotateX(0deg) rotateY(0deg) scale(1)");
    setGlare((g) => ({ ...g, opacity: 0 }));
  };

  return (
    <div style={{ perspective: "900px" }}>
      <div
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className={className}
        style={{
          ...style,
          transform,
          transition: "transform 0.15s ease-out",
          willChange: "transform",
        }}
      >
        {children}
        {/* Glare overlay */}
        <div
          className="pointer-events-none absolute inset-0 rounded-3xl"
          style={{
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(225,224,204,${glare.opacity}), transparent 65%)`,
            transition: "opacity 0.3s ease",
          }}
        />
      </div>
    </div>
  );
}

export function AboutSection() {
  const [activePhoto, setActivePhoto] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActivePhoto((prev) => (prev + 1) % PHOTOS.length);
    }, PHOTO_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-black px-[4vw] py-24">
      <motion.p
        {...fadeUp(0)}
        className="text-xs uppercase tracking-[0.3em] mb-10"
        style={{ color: "rgba(225,224,204,0.4)" }}
      >
        About me
      </motion.p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

        {/* Photo card */}
        <motion.div {...fadeUp(0.1)} className="md:row-span-2">
          <TiltCard
            className="relative overflow-hidden rounded-3xl bg-[#111] h-full"
            style={{ minHeight: "420px" }}
          >
            {PHOTOS.map((src, i) => (
              <img
                key={src}
                src={src}
                alt="Photo"
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
                style={{ opacity: i === activePhoto ? 1 : 0 }}
              />
            ))}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-xs uppercase tracking-[0.3em] mb-1" style={{ color: "rgba(225,224,204,0.5)" }}>
                Developer & Designer
              </p>
              <p className="font-medium text-2xl leading-tight tracking-tight" style={{ color: "#E1E0CC" }}>
                Phasin Ploypicha
              </p>
            </div>
          </TiltCard>
        </motion.div>

        {/* Fun fact card */}
        <motion.div {...fadeUp(0.2)} className="md:col-span-2">
          <TiltCard
            className="relative rounded-3xl bg-[#111] p-8 flex flex-col justify-between"
            style={{ minHeight: "200px" }}
          >
            <p className="text-xs uppercase tracking-[0.3em]" style={{ color: "rgba(225,224,204,0.4)" }}>
              Fun fact
            </p>
            <p
              className="text-xl md:text-2xl font-medium leading-relaxed tracking-tight mt-4"
              style={{ color: "rgba(225,224,204,0.85)", lineHeight: 1.7 }}
            >
              "I debug code by day and cook from scratch by night. Somewhere between a solo trip and a home-cooked meal is where I do my best thinking."
            </p>
          </TiltCard>
        </motion.div>

        {/* Bio card */}
        <motion.div {...fadeUp(0.3)} className="md:col-span-2">
          <TiltCard
            className="relative rounded-3xl bg-[#111] p-8 flex flex-col justify-between"
            style={{ minHeight: "200px" }}
          >
            <p className="text-xs uppercase tracking-[0.3em]" style={{ color: "rgba(225,224,204,0.4)" }}>
              Who I am
            </p>
            <p
              className="text-xl md:text-2xl font-medium leading-relaxed tracking-tight mt-4"
              style={{ color: "rgba(225,224,204,0.85)", lineHeight: 1.7 }}
            >
              Freelancer. Builder. Someone who genuinely loves the craft. I work independently on products that solve real problems for real people — and I care enough about the details to get them right.
            </p>
          </TiltCard>
        </motion.div>

      </div>
    </section>
  );
}
