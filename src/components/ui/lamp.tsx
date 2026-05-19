"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Loader2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChatContext } from "@/context/chat-context";

const SUGGESTIONS = [
  "What kind of websites do you build?",
  "Are you available for new projects?",
  "What's your pricing like?",
  "How long does a project take?",
];

const PRESETS = [
  { name: "Ivory",  color: "#E1E0CC" },
  { name: "Arctic", color: "#38BDF8" },
  { name: "Ember",  color: "#FB923C" },
  { name: "RGB",    color: "rgb" },
  { name: "Off",    color: "off" },
];

/* ── LampDemo ── */
export function LampDemo() {
  const { messages, loading, send, reset } = useChatContext();
  const [input, setInput] = useState("");
  const [preset, setPreset] = useState(0);
  const [hue, setHue] = useState(0);

  const isOff = preset === 4;

  useEffect(() => {
    if (preset !== 3) return;
    const interval = setInterval(() => setHue((h) => (h + 1.5) % 360), 30);
    return () => clearInterval(interval);
  }, [preset]);

  const color = preset === 3 ? `hsl(${hue}, 100%, 70%)` : isOff ? "#000000" : PRESETS[preset].color;

  return (
    <LampContainer color={color}>
      {/* Preset picker */}
      {!isOff && <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6, ease: "easeInOut" }}
        className="flex flex-wrap items-center justify-center gap-2 mb-8 px-4"
      >
        {PRESETS.map((p, i) => {
          const isRgb = p.color === "rgb";
          const isOffPreset = p.color === "off";
          const activeColor = isRgb ? `hsl(${hue}, 100%, 70%)` : isOffPreset ? "rgba(255,255,255,0.25)" : p.color;
          return (
            <button
              key={p.name}
              onClick={() => setPreset(i)}
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs transition-all duration-300 cursor-pointer"
              style={{
                background: preset === i ? (isOffPreset ? "rgba(255,255,255,0.04)" : `${isRgb ? activeColor : p.color}18`) : "rgba(255,255,255,0.04)",
                border: `1px solid ${preset === i ? `${activeColor}60` : "rgba(255,255,255,0.08)"}`,
                color: preset === i ? activeColor : "rgba(255,255,255,0.35)",
              }}
            >
              <span
                className="h-2 w-2 rounded-full flex-shrink-0"
                style={{
                  background: isRgb
                    ? "linear-gradient(135deg, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)"
                    : isOffPreset
                    ? "rgba(255,255,255,0.15)"
                    : p.color,
                  boxShadow: preset === i && !isOffPreset ? `0 0 8px ${activeColor}` : "none",
                  transition: "box-shadow 0.3s",
                }}
              />
              {p.name}
            </button>
          );
        })}
      </motion.div>}

      {/* Lights-off joke */}
      {isOff && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex flex-col items-center gap-5 mt-6"
        >
          <p className="text-center font-bold tracking-[0.15em] uppercase" style={{ color: "rgba(225,224,204,0.6)", fontSize: "clamp(1rem, 3vw, 1.5rem)" }}>
            I don&apos;t think you can see this
          </p>
          <p className="text-center text-xs tracking-widest uppercase" style={{ color: "rgba(225,224,204,0.35)" }}>
            seriously... turn the lights back on
          </p>
          <button
            onClick={() => setPreset(0)}
            className="mt-2 rounded-full px-5 py-2 text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.15)" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#E1E0CC"; e.currentTarget.style.borderColor = "rgba(225,224,204,0.4)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.15)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
          >
            💡 turn lights on
          </button>
        </motion.div>
      )}

      {/* Heading + Input bar — hidden when lights off */}
      {!isOff && (
        <>
      <motion.h1
        initial={{ opacity: 0.5, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
        className="text-center text-2xl font-medium leading-tight tracking-[-0.04em] sm:text-3xl md:text-5xl lg:text-6xl"
        style={{ color: "#E1E0CC" }}
      >
        Want your own website or system? <br /> Ask Phasin Bot
      </motion.h1>

      {/* Input bar */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.7, ease: "easeInOut" }}
        className="w-full max-w-2xl mt-10 flex flex-col gap-4"
      >
        {/* Wide pill input with glow border */}
        <div className="relative flex items-center justify-center group">
          {/* Glow layer 1 — outer rotating gradient */}
          <div className="absolute z-[-1] overflow-hidden h-full w-full rounded-2xl blur-[3px]
            before:absolute before:content-[''] before:z-[-2] before:w-[999px] before:h-[999px] before:bg-no-repeat
            before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-[60deg]
            before:bg-[conic-gradient(#000,#402fb5_5%,#000_38%,#000_50%,#cf30aa_60%,#000_87%)]
            before:transition-all before:duration-[2000ms]
            group-hover:before:rotate-[-120deg] group-focus-within:before:rotate-[420deg] group-focus-within:before:duration-[4000ms]"
          />
          {/* Glow layer 2 — soft inner glow */}
          <div className="absolute z-[-1] overflow-hidden h-full w-full rounded-2xl blur-[3px]
            before:absolute before:content-[''] before:z-[-2] before:w-[600px] before:h-[600px] before:bg-no-repeat
            before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-[82deg]
            before:bg-[conic-gradient(rgba(0,0,0,0),#18116a,rgba(0,0,0,0)_10%,rgba(0,0,0,0)_50%,#6e1b60,rgba(0,0,0,0)_60%)]
            before:transition-all before:duration-[2000ms]
            group-hover:before:rotate-[-98deg] group-focus-within:before:rotate-[442deg] group-focus-within:before:duration-[4000ms]"
          />
          {/* Glow layer 3 — highlight shimmer */}
          <div className="absolute z-[-1] overflow-hidden h-full w-full rounded-xl blur-[2px]
            before:absolute before:content-[''] before:z-[-2] before:w-[600px] before:h-[600px] before:bg-no-repeat
            before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-[83deg]
            before:bg-[conic-gradient(rgba(0,0,0,0)_0%,#a099d8,rgba(0,0,0,0)_8%,rgba(0,0,0,0)_50%,#dfa2da,rgba(0,0,0,0)_58%)]
            before:brightness-[1.4] before:transition-all before:duration-[2000ms]
            group-hover:before:rotate-[-97deg] group-focus-within:before:rotate-[443deg] group-focus-within:before:duration-[4000ms]"
          />
          {/* Glow layer 4 — dark base */}
          <div className="absolute z-[-1] overflow-hidden h-full w-full rounded-xl blur-[0.5px]
            before:absolute before:content-[''] before:z-[-2] before:w-[600px] before:h-[600px] before:bg-no-repeat
            before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-[70deg]
            before:bg-[conic-gradient(#1c191c,#402fb5_5%,#1c191c_14%,#1c191c_50%,#cf30aa_60%,#1c191c_64%)]
            before:brightness-[1.3] before:transition-all before:duration-[2000ms]
            group-hover:before:rotate-[-110deg] group-focus-within:before:rotate-[430deg] group-focus-within:before:duration-[4000ms]"
          />

        <div
          className="flex items-center gap-3 rounded-2xl px-4 py-3 sm:px-6 sm:py-5 w-full transition-all duration-500"
          style={{
            background: "#0a0a0a",
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { send(input); setInput(""); } }}
            placeholder="Ask anything..."
            className="flex-1 bg-transparent text-sm sm:text-base outline-none"
            style={{ color: "rgba(225,224,204,0.85)" }}
          />
          <button
            onClick={() => { send(input); setInput(""); }}
            disabled={!input.trim() || loading}
            className="flex h-9 w-9 items-center justify-center rounded-full transition-all cursor-pointer disabled:opacity-30 flex-shrink-0"
            style={{ background: color }}
          >
            {loading
              ? <Loader2 className="h-4 w-4 text-black animate-spin" />
              : <Send className="h-4 w-4 text-black" />
            }
          </button>
        </div>
        </div>{/* end glow wrapper */}

        {/* Clear chat */}
        {messages.length > 1 && (
          <div className="flex justify-end">
            <button
              onClick={reset}
              className="flex items-center gap-1.5 text-xs cursor-pointer transition-colors"
              style={{ color: "rgba(225,224,204,0.35)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(225,224,204,0.7)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(225,224,204,0.35)")}
            >
              <Trash2 className="h-3 w-3" />
              Clear chat
            </button>
          </div>
        )}

        {/* Suggestion chips */}
        {messages.length === 1 && (
          <div className="flex flex-wrap justify-center gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="rounded-full px-4 py-1.5 text-xs transition-all cursor-pointer"
                style={{ background: "rgba(225,224,204,0.05)", color: "rgba(225,224,204,0.5)", border: "1px solid rgba(225,224,204,0.1)" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(225,224,204,0.1)"; e.currentTarget.style.color = "rgba(225,224,204,0.85)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(225,224,204,0.05)"; e.currentTarget.style.color = "rgba(225,224,204,0.5)"; }}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Conversation history */}
        {messages.length > 1 && (
          <div className="flex flex-col gap-3 max-h-80 overflow-y-auto">
            {messages.slice(1).map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className="max-w-[80%] rounded-2xl px-5 py-3 text-sm leading-relaxed transition-all duration-500"
                  style={
                    msg.role === "user"
                      ? { background: color, color: "#000" }
                      : { background: "rgba(225,224,204,0.06)", color: "rgba(225,224,204,0.85)", border: "1px solid rgba(225,224,204,0.08)" }
                  }
                >
                  {msg.content || <Loader2 className="h-4 w-4 animate-spin" style={{ color: "rgba(225,224,204,0.4)" }} />}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
      </>
      )}
    </LampContainer>
  );
}

/* ── LampContainer ── */
export const LampContainer = ({
  children,
  className,
  color = "#E1E0CC",
}: {
  children: React.ReactNode;
  className?: string;
  color?: string;
}) => {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center overflow-hidden bg-black w-full z-0 pb-24 max-w-full",
        className
      )}
    >
      {/* Light effects */}
      <div
        className="relative flex w-full scale-y-125 items-center justify-center isolate z-0 overflow-hidden"
        style={{ height: "clamp(180px, 30vw, 340px)" }}
      >
        {/* Left cone */}
        <motion.div
          initial={{ opacity: 0.5, width: "8rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-auto right-1/2 h-56 overflow-visible max-w-[40vw]"
          style={{ backgroundImage: `conic-gradient(from 70deg at center top, ${color}, transparent, transparent)`, transition: "background-image 0.6s ease" }}
        >
          <div className="absolute w-[100%] left-0 bg-black h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
          <div className="absolute w-40 h-[100%] left-0 bg-black bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)]" />
        </motion.div>

        {/* Right cone */}
        <motion.div
          initial={{ opacity: 0.5, width: "8rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-auto left-1/2 h-56 max-w-[40vw]"
          style={{ backgroundImage: `conic-gradient(from 290deg at center top, transparent, transparent, ${color})`, transition: "background-image 0.6s ease" }}
        >
          <div className="absolute w-40 h-[100%] right-0 bg-black bottom-0 z-20 [mask-image:linear-gradient(to_left,white,transparent)]" />
          <div className="absolute w-[100%] right-0 bg-black h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
        </motion.div>

        <div className="absolute top-1/2 h-48 w-full translate-y-12 scale-x-150 bg-black blur-2xl" />
        <div className="absolute top-1/2 z-50 h-48 w-full bg-transparent opacity-10 lg:backdrop-blur-md" />

        {/* Center glow */}
        <div
          className="absolute inset-auto z-50 h-2 w-2 -translate-y-[5rem] rounded-full opacity-60 blur-3xl transition-colors duration-500"
          style={{ background: color }}
        />
        <motion.div
          initial={{ width: "2rem" }}
          whileInView={{ width: "6rem" }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-auto z-30 -translate-y-[6rem] rounded-full blur-2xl transition-colors duration-500"
          style={{ background: color, height: "3rem" }}
        />

        {/* Horizontal line */}
        <motion.div
          initial={{ width: "8rem" }}
          whileInView={{ width: "30rem" }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-auto z-50 h-0.5 -translate-y-[7rem] transition-colors duration-500 max-w-[40vw]"
          style={{ background: color }}
        />
        <div className="absolute inset-auto z-40 h-44 w-full -translate-y-[12.5rem] bg-black" />
      </div>

      {/* Content */}
      <div className="relative z-50 flex flex-col items-center w-full px-5 -mt-40">
        {children}
      </div>
    </div>
  );
};
