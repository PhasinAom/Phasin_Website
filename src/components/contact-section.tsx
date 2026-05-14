"use client";

import { PlusIcon } from "lucide-react";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";
import AppIcons from "@/components/ui/app-icons";

export function ContactSection() {
  return (
    <section className="bg-black px-[4vw] py-32 flex items-center justify-center overflow-hidden">
      <div className="relative mx-auto flex w-full max-w-3xl flex-col justify-between gap-y-10 border-y border-[#E1E0CC]/15 bg-[radial-gradient(35%_80%_at_25%_0%,rgba(225,224,204,0.06),transparent)] px-4 pt-12 pb-16 overflow-hidden">

        {/* Corner plus markers */}
        <PlusIcon className="absolute top-[-12.5px] left-[-11.5px] z-10 size-6 text-[#E1E0CC]/40" strokeWidth={1} />
        <PlusIcon className="absolute top-[-12.5px] right-[-11.5px] z-10 size-6 text-[#E1E0CC]/40" strokeWidth={1} />
        <PlusIcon className="absolute bottom-[-12.5px] left-[-11.5px] z-10 size-6 text-[#E1E0CC]/40" strokeWidth={1} />
        <PlusIcon className="absolute right-[-11.5px] bottom-[-12.5px] z-10 size-6 text-[#E1E0CC]/40" strokeWidth={1} />

        {/* Side borders */}
        <div className="pointer-events-none absolute left-0 inset-y-0 w-px border-l border-[#E1E0CC]/15" />
        <div className="pointer-events-none absolute right-0 inset-y-0 w-px border-r border-[#E1E0CC]/15" />

        {/* Center dashed line */}
        <div className="absolute top-0 left-1/2 h-full border-l border-dashed border-[#E1E0CC]/10 -z-10" />

        {/* Text */}
        <div className="space-y-3">
          <h2
            className="text-center font-medium text-4xl md:text-5xl leading-tight tracking-[-0.04em]"
            style={{ color: "#E1E0CC" }}
          >
            Want something like this?
          </h2>
          <p className="text-center text-base md:text-lg" style={{ color: "rgba(225,224,204,0.5)" }}>
            I'm open to new projects, collabs, and good conversations.
          </p>
        </div>

        {/* Email button */}
        <div className="flex items-center justify-center">
          <LiquidMetalButton
            label="Send me an email"
            onClick={() => window.location.href = "mailto:phasin.plo@gmail.com"}
          />
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 border-t border-[#E1E0CC]/10" />
          <span className="text-[10px] uppercase tracking-[0.3em]" style={{ color: "rgba(225,224,204,0.3)" }}>
            Find me on
          </span>
          <div className="flex-1 border-t border-[#E1E0CC]/10" />
        </div>

        {/* Social icons */}
        <div className="flex justify-center">
          <AppIcons />
        </div>

      </div>
    </section>
  );
}
