"use client";

import { TextHoverEffect, FooterBackgroundGradient } from "@/components/ui/text-hover-effect";
import { Mail, MapPin } from "lucide-react";

const NAV_LINKS = ["About", "Projects", "Contact"];
const SERVICE_LINKS = ["Web Design", "Development"];

export function FooterSection() {
  return (
    <footer className="relative bg-black border-t border-[#E1E0CC]/10 overflow-hidden">
      <FooterBackgroundGradient />

      {/* ── Top info grid ── */}
      <div className="relative z-10 grid grid-cols-1 gap-10 px-[4vw] py-16 md:grid-cols-4">

        {/* Col 1 — Identity */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-medium tracking-tight" style={{ color: "#E1E0CC" }}>
            Phasin Ploypicha
          </h3>
          <p className="text-sm leading-relaxed max-w-[220px]" style={{ color: "rgba(225,224,204,0.45)", lineHeight: 1.7 }}>
            Developer & Designer crafting products that are fast, intentional, and built to last.
          </p>
        </div>

        {/* Col 2 — Navigate */}
        <div className="flex flex-col gap-4">
          <h4 className="text-xs uppercase tracking-[0.3em]" style={{ color: "rgba(225,224,204,0.4)" }}>
            Navigate
          </h4>
          <ul className="flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <li key={link}>
                <a
                  href={`#${link.toLowerCase()}`}
                  className="text-sm transition-colors duration-200 cursor-pointer"
                  style={{ color: "rgba(225,224,204,0.55)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#E1E0CC")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(225,224,204,0.55)")}
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3 — Services */}
        <div className="flex flex-col gap-4">
          <h4 className="text-xs uppercase tracking-[0.3em]" style={{ color: "rgba(225,224,204,0.4)" }}>
            Services
          </h4>
          <ul className="flex flex-col gap-3">
            {SERVICE_LINKS.map((s) => (
              <li key={s} className="text-sm" style={{ color: "rgba(225,224,204,0.55)" }}>
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4 — Contact */}
        <div className="flex flex-col gap-4">
          <h4 className="text-xs uppercase tracking-[0.3em]" style={{ color: "rgba(225,224,204,0.4)" }}>
            Contact
          </h4>
          <ul className="flex flex-col gap-3">
            <li>
              <a
                href="mailto:phasin.plo@gmail.com"
                className="flex items-center gap-2 text-sm transition-colors duration-200 cursor-pointer"
                style={{ color: "rgba(225,224,204,0.55)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#E1E0CC")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(225,224,204,0.55)")}
              >
                <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                phasin.plo@gmail.com
              </a>
            </li>
            <li className="flex items-center gap-2 text-sm" style={{ color: "rgba(225,224,204,0.55)" }}>
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              Bangkok, Thailand
            </li>
          </ul>
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="relative z-10 border-t border-[#E1E0CC]/10" />

      {/* ── Bottom strip — big text bg + icons + copyright ── */}
      <div className="relative overflow-hidden w-full" style={{ minHeight: "200px" }}>

        {/* Big text fills the strip — hidden on mobile */}
        <div className="absolute inset-0 overflow-hidden hidden md:block">
          <TextHoverEffect text="Portfolio" duration={0.3} />
        </div>

        {/* Social links + copyright — stacks on mobile, side by side on md+ */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-[4vw] py-8 md:py-0 md:absolute md:bottom-5 md:left-0 md:right-0">
          <div className="flex flex-wrap items-center gap-4">
            {[
              { label: "Instagram", href: "https://www.instagram.com/a.aom__/" },
              { label: "Gmail", href: "mailto:phasin.plo@gmail.com" },
              { label: "GitHub", href: "https://github.com/PhasinAom" },
              { label: "Facebook", href: "https://www.facebook.com/aomsin.ployphicha?locale=th_TH" },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.href.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="text-xs uppercase tracking-widest transition-colors duration-200 cursor-pointer"
                style={{ color: "rgba(225,224,204,0.4)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#E1E0CC")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(225,224,204,0.4)")}
              >
                {s.label}
              </a>
            ))}
          </div>
          <p className="text-xs tracking-widest uppercase" style={{ color: "rgba(225,224,204,0.3)" }}>
            © {new Date().getFullYear()} — Built by Phasin Ploypicha — All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
