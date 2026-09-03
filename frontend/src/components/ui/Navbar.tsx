"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSmoothScroll } from "@/components/providers/SmoothScrollProvider";

const NAV_LINKS = [
  { id: "hero", label: "SPOTLIGHT" },
  { id: "drivers", label: "DRIVERS" },
  { id: "constructors", label: "CONSTRUCTORS" },
];

export function Navbar() {
  const { scrollTo } = useSmoothScroll();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("hero");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 80);
      const sections = ["hero", "drivers", "constructors"];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.45 && rect.bottom >= window.innerHeight * 0.45) {
            setActive(id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id: string) => {
    scrollTo(`#${id}`);
    setMobileOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 transition-all duration-500 ${
          scrolled
            ? "py-3 bg-[rgba(245,245,240,0.95)] backdrop-blur-md border-b border-[rgba(13,13,15,0.07)]"
            : "py-5 bg-transparent"
        }`}
      >
        {/* ── Wordmark ── */}
        <button
          onClick={() => go("hero")}
          className="flex flex-col items-start leading-none group focus:outline-none"
          aria-label="ApexGrid home"
        >
          <span className="font-display font-black text-xl md:text-2xl tracking-tight text-ink group-hover:text-ink transition-colors">
            APEX<span className="text-accent">GRID</span>
          </span>
          <span className="font-mono text-[9px] tracking-[0.22em] text-ink-light mt-0.5 uppercase">
            F1 · 2026 SEASON
          </span>
        </button>

        {/* ── Desktop nav ── */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => go(link.id)}
              className={`relative font-display text-[11px] font-bold tracking-[0.18em] uppercase transition-colors duration-200 pb-0.5 ${
                active === link.id
                  ? "text-ink"
                  : "text-ink-light hover:text-ink-mid"
              }`}
            >
              {link.label}
              {active === link.id && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-accent"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
            </button>
          ))}
        </nav>

        {/* ── Mobile toggle ── */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex flex-col gap-[5px] p-2 focus:outline-none"
          aria-label="Toggle menu"
        >
          <span
            className={`block w-5 h-[1.5px] bg-ink transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-[6.5px]" : ""}`}
          />
          <span
            className={`block w-5 h-[1.5px] bg-ink transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-5 h-[1.5px] bg-ink transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-[6.5px]" : ""}`}
          />
        </button>
      </header>

      {/* ── Mobile full-screen overlay ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-40 bg-[#F5F5F0] flex flex-col justify-center px-8"
          >
            {/* Close line */}
            <div className="absolute top-5 right-6">
              <button
                onClick={() => setMobileOpen(false)}
                className="font-mono text-[10px] tracking-widest text-ink-light uppercase"
              >
                CLOSE ✕
              </button>
            </div>

            <div className="flex flex-col gap-10">
              {NAV_LINKS.map((link, i) => (
                <motion.button
                  key={link.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  onClick={() => go(link.id)}
                  className="text-left font-display font-black text-5xl tracking-tight text-ink hover:text-accent transition-colors duration-200 uppercase"
                >
                  {link.label}
                </motion.button>
              ))}
            </div>

            <div className="absolute bottom-8 left-8 font-mono text-[10px] tracking-[0.2em] text-ink-light uppercase">
              APEXGRID · F1 2026
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
