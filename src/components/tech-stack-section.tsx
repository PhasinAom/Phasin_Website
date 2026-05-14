"use client";

import { motion } from "framer-motion";

const STACK = [
  "Next.js", "React", "TypeScript", "Tailwind CSS", "Node.js",
  "Framer Motion", "GSAP", "LINE API", "Vercel", "shadcn/ui",
  "REST APIs", "PostgreSQL", "Prisma", "Git",
];

// Double the array so the marquee loops seamlessly
const ROW_1 = [...STACK, ...STACK];
const ROW_2 = [...STACK.slice(7), ...STACK.slice(0, 7), ...STACK.slice(7), ...STACK.slice(0, 7)];

function MarqueeRow({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  return (
    <div className="flex overflow-hidden">
      <motion.div
        className="flex gap-6 pr-6 flex-shrink-0"
        animate={{ x: reverse ? ["0%", "50%"] : ["0%", "-50%"] }}
        transition={{ duration: 25, ease: "linear", repeat: Infinity }}
      >
        {items.map((tech, i) => (
          <div
            key={i}
            className="flex items-center gap-3 flex-shrink-0"
          >
            <span
              className="text-sm font-medium tracking-tight whitespace-nowrap px-4 py-2 rounded-full border transition-colors duration-300 cursor-default"
              style={{
                color: "rgba(225,224,204,0.5)",
                borderColor: "rgba(225,224,204,0.08)",
                background: "rgba(225,224,204,0.03)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "#E1E0CC";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(225,224,204,0.25)";
                (e.currentTarget as HTMLElement).style.background = "rgba(225,224,204,0.07)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = "rgba(225,224,204,0.5)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(225,224,204,0.08)";
                (e.currentTarget as HTMLElement).style.background = "rgba(225,224,204,0.03)";
              }}
            >
              {tech}
            </span>
            <span style={{ color: "rgba(225,224,204,0.15)" }}>·</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function TechStackSection() {
  return (
    <section className="relative bg-black pt-4 pb-16 overflow-hidden">
      {/* Label */}
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center text-xs uppercase tracking-[0.3em] mb-10"
        style={{ color: "rgba(225,224,204,0.3)" }}
      >
        Built with
      </motion.p>

      {/* Marquee row */}
      <MarqueeRow items={ROW_1} />

      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent" />
    </section>
  );
}
