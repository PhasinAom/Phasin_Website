"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Loader2, Trash2, ArrowUp } from "lucide-react";
import { useChatContext } from "@/context/chat-context";

const SUGGESTIONS = [
  "What projects have you built?",
  "Are you available for freelance work?",
  "How can I contact you?",
];

export function ChatWidget() {
  const { messages, loading, send, reset } = useChatContext();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const handleSend = (text: string) => {
    setInput("");
    send(text);
  };

  return (
    <>
      {/* Scroll to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-24 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full cursor-pointer transition-all duration-300 group"
        style={{
          background: "#111",
          border: "1.5px solid rgba(225,224,204,0.2)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
          opacity: scrolled ? 1 : 0,
          transform: scrolled ? "translateY(0) scale(1)" : "translateY(8px) scale(0.9)",
          pointerEvents: scrolled ? "auto" : "none",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#222";
          e.currentTarget.style.border = "1.5px solid rgba(225,224,204,0.5)";
          e.currentTarget.style.boxShadow = "0 6px 24px rgba(225,224,204,0.15)";
          e.currentTarget.style.transform = "translateY(-2px) scale(1.08)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#111";
          e.currentTarget.style.border = "1.5px solid rgba(225,224,204,0.2)";
          e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.4)";
          e.currentTarget.style.transform = "translateY(0) scale(1)";
        }}
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-5 w-5" style={{ color: "#E1E0CC" }} />
      </button>

      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-300 cursor-pointer"
        style={{
          background: open ? "#E1E0CC" : "#000",
          border: "1.5px solid rgba(225,224,204,0.25)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.08) translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 8px 28px rgba(225,224,204,0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1) translateY(0)";
          e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.4)";
        }}
        aria-label="Chat with Phasin's AI"
      >
        {open ? (
          <X className="h-5 w-5 text-black" />
        ) : (
          <MessageCircle className="h-5 w-5 text-[#E1E0CC]" />
        )}
      </button>

      {/* Chat window */}
      <div
        className={`fixed bottom-24 right-6 z-50 flex w-[340px] flex-col overflow-hidden rounded-2xl border transition-all duration-300 ${
          open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        style={{
          height: "480px",
          background: "#0a0a0a",
          borderColor: "rgba(225,224,204,0.12)",
          boxShadow: "0 8px 40px rgba(0,0,0,0.6)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3 border-b"
          style={{ borderColor: "rgba(225,224,204,0.08)" }}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E1E0CC]">
              <span className="text-[10px] font-bold text-black">P</span>
            </div>
            <div>
              <p className="text-xs font-medium" style={{ color: "#E1E0CC" }}>Phasin's Assistant</p>
              <div className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <p className="text-[10px]" style={{ color: "rgba(225,224,204,0.4)" }}>Online</p>
              </div>
            </div>
          </div>
          {messages.length > 1 && (
            <button
              onClick={reset}
              className="flex items-center gap-1 text-[10px] uppercase tracking-widest cursor-pointer transition-colors"
              style={{ color: "rgba(225,224,204,0.3)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(225,224,204,0.7)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(225,224,204,0.3)")}
            >
              <Trash2 className="h-3 w-3" />
              Clear
            </button>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className="max-w-[80%] rounded-2xl px-3 py-2 text-xs leading-relaxed"
                style={
                  msg.role === "user"
                    ? { background: "#E1E0CC", color: "#000" }
                    : { background: "rgba(225,224,204,0.06)", color: "rgba(225,224,204,0.85)", border: "1px solid rgba(225,224,204,0.08)" }
                }
              >
                {msg.content || <Loader2 className="h-3 w-3 animate-spin" style={{ color: "rgba(225,224,204,0.4)" }} />}
              </div>
            </div>
          ))}

          {messages.length === 1 && (
            <div className="flex flex-col gap-2 pt-1">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="text-left rounded-xl px-3 py-2 text-[11px] transition-colors cursor-pointer"
                  style={{ background: "rgba(225,224,204,0.05)", color: "rgba(225,224,204,0.6)", border: "1px solid rgba(225,224,204,0.1)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(225,224,204,0.1)"; e.currentTarget.style.color = "rgba(225,224,204,0.9)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(225,224,204,0.05)"; e.currentTarget.style.color = "rgba(225,224,204,0.6)"; }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-3 pb-3">
          <div
            className="flex items-center gap-2 rounded-xl px-3 py-2"
            style={{ background: "rgba(225,224,204,0.06)", border: "1px solid rgba(225,224,204,0.1)" }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { handleSend(input); } }}
              placeholder="Ask anything..."
              className="flex-1 bg-transparent text-xs outline-none"
              style={{ color: "rgba(225,224,204,0.85)" }}
            />
            <button
              onClick={() => handleSend(input)}
              disabled={!input.trim() || loading}
              className="flex h-6 w-6 items-center justify-center rounded-lg transition-all cursor-pointer disabled:opacity-30"
              style={{ background: "#E1E0CC" }}
            >
              <Send className="h-3 w-3 text-black" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
