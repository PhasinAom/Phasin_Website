"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Loader2, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "What kind of websites do you build?",
  "Are you available for new projects?",
  "What's your pricing like?",
  "How long does a project take?",
];

export function ChatSection() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm Phasin's assistant. Ask me anything about his work, services, or how to get started.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    setInput("");

    const userMessage: Message = { role: "user", content: text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setLoading(true);

    const assistantMessage: Message = { role: "assistant", content: "" };
    setMessages((prev) => [...prev, assistantMessage]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.body) throw new Error("No response body");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: updated[updated.length - 1].content + chunk,
          };
          return updated;
        });
      }
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "Something went wrong. You can reach Phasin directly at phasin.plo@gmail.com.",
        };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-black px-[4vw] py-24">
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-10 text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-xs uppercase tracking-[0.3em] mb-4"
          style={{ color: "rgba(225,224,204,0.4)" }}
        >
          Ask me anything
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-5xl font-medium leading-tight tracking-[-0.04em]"
          style={{ color: "#E1E0CC" }}
        >
          Curious about my work?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-3 text-base"
          style={{ color: "rgba(225,224,204,0.45)" }}
        >
          Ask about projects, pricing, availability — get an instant answer.
        </motion.p>
      </div>

      {/* Chat window */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="max-w-2xl mx-auto rounded-3xl overflow-hidden border flex flex-col"
        style={{
          borderColor: "rgba(225,224,204,0.1)",
          background: "#0a0a0a",
          height: "420px",
        }}
      >
        {/* Toolbar */}
        {messages.length > 1 && (
          <div className="flex justify-end px-4 pt-3">
            <button
              onClick={() => setMessages([{ role: "assistant", content: "Hi! I'm Phasin's assistant. Ask me anything about his work, services, or how to get started." }])}
              className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest cursor-pointer transition-colors"
              style={{ color: "rgba(225,224,204,0.3)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(225,224,204,0.7)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(225,224,204,0.3)")}
            >
              <Trash2 className="h-3 w-3" />
              Clear
            </button>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className="max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed"
                style={
                  msg.role === "user"
                    ? { background: "#E1E0CC", color: "#000" }
                    : {
                        background: "rgba(225,224,204,0.06)",
                        color: "rgba(225,224,204,0.85)",
                        border: "1px solid rgba(225,224,204,0.08)",
                      }
                }
              >
                {msg.content || (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" style={{ color: "rgba(225,224,204,0.4)" }} />
                )}
              </div>
            </div>
          ))}

          {/* Suggestion chips — only on first load */}
          {messages.length === 1 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full px-4 py-1.5 text-xs transition-all cursor-pointer"
                  style={{
                    background: "rgba(225,224,204,0.05)",
                    color: "rgba(225,224,204,0.55)",
                    border: "1px solid rgba(225,224,204,0.1)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(225,224,204,0.1)";
                    e.currentTarget.style.color = "rgba(225,224,204,0.9)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(225,224,204,0.05)";
                    e.currentTarget.style.color = "rgba(225,224,204,0.55)";
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div
          className="px-4 py-3 border-t"
          style={{ borderColor: "rgba(225,224,204,0.08)" }}
        >
          <div
            className="flex items-center gap-3 rounded-2xl px-4 py-2.5"
            style={{
              background: "rgba(225,224,204,0.05)",
              border: "1px solid rgba(225,224,204,0.1)",
            }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send(input)}
              placeholder="Type your question..."
              className="flex-1 bg-transparent text-sm outline-none"
              style={{ color: "rgba(225,224,204,0.85)" }}
            />
            <button
              onClick={() => send(input)}
              disabled={!input.trim() || loading}
              className="flex h-8 w-8 items-center justify-center rounded-xl transition-all cursor-pointer disabled:opacity-30"
              style={{ background: "#E1E0CC" }}
            >
              <Send className="h-3.5 w-3.5 text-black" />
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
