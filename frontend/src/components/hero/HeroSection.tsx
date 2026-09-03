"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useHeroData } from "@/lib/hooks/useHeroData";
import { getTeamColors } from "@/lib/teamColors";
import { TrackMap } from "@/components/hero/TrackMap";
import { CarSpatialAnnotation } from "@/components/hero/CarSpatialAnnotation";
import { useSmoothScroll } from "@/components/providers/SmoothScrollProvider";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function HeroSection() {
  const { hero } = useHeroData();
  const { scrollTo } = useSmoothScroll();
  const winner = hero.winner;
  const teamColors = getTeamColors(winner?.team_name);

  // Mouse parallax values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const heroRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { innerWidth, innerHeight } = window;
    mouseX.set((e.clientX - innerWidth / 2) / 60);
    mouseY.set((e.clientY - innerHeight / 2) / 60);
  };

  // Scroll reveal for driver name
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  // Split driver name for editorial layout
  const nameParts = winner.full_name.split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  return (
    <section
      id="hero"
      ref={heroRef}
      onMouseMove={handleMouseMove}
      className="relative w-full min-h-screen overflow-hidden bg-bg"
      style={{ cursor: "default" }}
    >
      {/* ── LAYER 0: Engineering background grid ── */}
      <div className="absolute inset-0 bg-engineering-grid opacity-100 pointer-events-none" />

      {/* ── LAYER 0b: Subtle team color ambient — very faint ── */}
      <div
        className="absolute top-0 right-0 w-[60vw] h-[100vh] pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 80% 40%, ${teamColors.primary}08 0%, transparent 65%)`,
        }}
      />

      {/* ── LAYER 1: Circuit track map — positioned further to the right side in open space ── */}
      <div className="absolute inset-0 pointer-events-none z-[1] overflow-hidden">
        <TrackMap
          circuitName={hero.location || "Zandvoort"}
          className="absolute top-[20%] right-[-10%] w-[58%] h-[82%] max-w-none"
          opacity={0.85}
        />
      </div>

      {/* ── LAYER 2: Monumental driver name watermark — increased line weight ── */}
      <div className="absolute inset-0 flex items-center pointer-events-none z-[2] overflow-hidden">
        <div
          className="font-display font-black uppercase leading-none select-none"
          style={{
            fontSize: "clamp(5rem, 17vw, 18rem)",
            letterSpacing: "-0.04em",
            color: "transparent",
            WebkitTextStroke: "2px rgba(13,13,15,0.13)",
            whiteSpace: "nowrap",
            transform: "translateY(-5%)",
          }}
        >
          {lastName || winner.driver_code}
        </div>
      </div>

      {/* ── LAYER 4: Driver photo — left side, clickable to #drivers ── */}
      <motion.div
        className="absolute z-[4] pointer-events-none"
        style={{
          x: springX,
          y: springY,
          left: "0%",
          bottom: "0",
          width: "clamp(280px, 38vw, 600px)",
          height: "100%",
        }}
      >
        {/* Team color accent strip at left edge */}
        <div
          className="absolute left-0 top-[15%] bottom-0 w-[3px] z-10"
          style={{ backgroundColor: teamColors.primary }}
        />

        {/* Driver image — clickable hitbox strictly on the image itself */}
        <div className="absolute inset-0 flex items-end justify-start">
          <motion.div
            onClick={() => scrollTo("#drivers")}
            className="relative w-full cursor-pointer pointer-events-auto"
            style={{ height: "95%" }}
            whileHover={{ scale: 1.012 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            title="View Drivers' Championship"
          >
            <Image
              src="/assets/driver-winner.png"
              alt={winner.full_name}
              fill
              priority
              className="object-contain object-bottom"
              style={{ objectPosition: "left bottom" }}
            />
            {/* Bottom gradient fade */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-bg to-transparent pointer-events-none" />
          </motion.div>
        </div>
      </motion.div>

      {/* ── LAYER 5: Typography — lifted up so team line sits at previous name position ── */}
      <div
        className="absolute z-[6] pointer-events-none select-none"
        style={{
          left: "clamp(240px, 32vw, 500px)",
          top: "23%",
          transform: "translateY(-50%)",
        }}
      >
        {/* Race round micro label */}
        <div className="font-mono text-[9px] tracking-[0.22em] text-ink-light uppercase mb-2.5">
          RD {hero.round} / 24 &nbsp;·&nbsp; {hero.season} SEASON
        </div>

        {/* Foreground Name: LANDO NORRIS on ONE LINE */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="font-display font-black text-ink leading-none uppercase whitespace-nowrap"
          style={{ fontSize: "clamp(1.8rem, 3.8vw, 4.6rem)", letterSpacing: "-0.025em" }}
        >
          {winner.full_name}
        </motion.div>

        {/* Team + Winner position in gap between foreground and background NORRIS */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-3.5 flex items-center gap-3"
        >
          <div
            className="w-7 h-[2px]"
            style={{ backgroundColor: teamColors.primary }}
          />
          <span className="font-display font-bold text-xs tracking-[0.15em] uppercase text-ink-mid">
            {winner.team_name}
          </span>
          <div
            className="w-3 h-[2px]"
            style={{ backgroundColor: teamColors.primary }}
          />
          <span className="font-mono text-xs text-ink-light">
            P{winner.position} WINNER
          </span>
        </motion.div>
      </div>

      {/* ── LAYER 6: Race-winning car — right side, clickable to #constructors ── */}
      <div
        className="absolute z-[5] pointer-events-none"
        style={{
          right: "0",
          bottom: "0",
          width: "clamp(420px, 58vw, 900px)",
          height: "68vh",
        }}
      >
        {/* Car spatial annotation system — 4 clean technical callouts */}
        <CarSpatialAnnotation
          fastestLap="1:12.456"
          totalTime={winner.finish_gap || "1:30:45.519"}
          pitStops={2}
          circuit={hero.location}
        />

        {/* The car image — clickable hitbox strictly on the car visual */}
        <motion.div
          style={{ x: springX, y: springY }}
          className="absolute inset-0"
        >
          <motion.div
            onClick={() => scrollTo("#constructors")}
            className="absolute inset-0 cursor-pointer pointer-events-auto"
            style={{
              bottom: "-5%",
              right: "-3%",
            }}
            whileHover={{ scale: 1.015 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            title="View Constructors' Championship"
          >
            <Image
              src="/assets/car-aero.png"
              alt={`${winner.team_name} Formula 1 race car`}
              fill
              priority
              className="object-contain"
              style={{ objectPosition: "right bottom" }}
            />
            {/* Subtle ground plane shadow */}
            <div
              className="absolute bottom-[2%] left-[15%] right-[5%] h-8 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse, ${teamColors.primary}15 0%, transparent 70%)`,
                filter: "blur(12px)",
              }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* ── LAYER 7: Top HUD bar — latest race (left) & next race (right), clickable to Season Timeline ── */}
      <div className="absolute top-0 left-0 right-0 z-[7] pt-20 px-6 md:px-10 flex items-center justify-between pointer-events-none">
        {/* Left: Latest Race & Circuit — Click to smoothly scroll to Timeline */}
        <div
          onClick={() => scrollTo("#timeline-current")}
          className="flex items-center gap-6 pointer-events-auto cursor-pointer group"
          title="Click to view Season Timeline"
        >
          <div>
            <div className="font-mono text-[8px] tracking-[0.25em] text-ink-light uppercase group-hover:text-accent transition-colors flex items-center gap-1.5">
              <span>LATEST RACE</span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-accent">↓</span>
            </div>
            <div className="font-display font-bold text-sm text-ink group-hover:text-ink/80 uppercase tracking-tight mt-0.5 transition-colors">
              {hero.event_name}
            </div>
          </div>
          <div className="w-[1px] h-8 bg-ink-faint group-hover:bg-accent/40 transition-colors" />
          <div>
            <div className="font-mono text-[8px] tracking-[0.25em] text-ink-light uppercase group-hover:text-accent transition-colors">
              CIRCUIT
            </div>
            <div className="font-mono text-xs text-ink-mid group-hover:text-ink mt-0.5 uppercase tracking-wide transition-colors">
              {hero.location}
            </div>
          </div>
        </div>

        {/* Right: Next Race & Race Day — Click to smoothly scroll to Timeline */}
        <div
          onClick={() => scrollTo("#timeline")}
          className="flex items-center gap-6 text-right pointer-events-auto cursor-pointer group"
          title="Click to view Season Timeline"
        >
          <div>
            <div className="font-mono text-[8px] tracking-[0.25em] text-ink-light uppercase group-hover:text-accent transition-colors flex items-center justify-end gap-1.5">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-accent">↓</span>
              <span>NEXT RACE</span>
            </div>
            <div className="font-display font-bold text-sm text-ink group-hover:text-ink/80 uppercase tracking-tight mt-0.5 transition-colors">
              Italian Grand Prix
            </div>
          </div>
          <div className="w-[1px] h-8 bg-ink-faint group-hover:bg-accent/40 transition-colors" />
          <div>
            <div className="font-mono text-[8px] tracking-[0.25em] text-ink-light uppercase group-hover:text-accent transition-colors">
              RACE DAY
            </div>
            <div className="font-mono text-xs text-ink-mid group-hover:text-ink mt-0.5 uppercase tracking-wide transition-colors">
              SEP 06, 2026
            </div>
          </div>
        </div>
      </div>

      {/* ── LAYER 8: Scroll indicator ── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[8] flex flex-col items-center gap-2 pointer-events-none">
        <div className="w-[1px] h-14 bg-ink-faint scroll-line" />
        <div className="font-mono text-[8px] tracking-[0.3em] text-ink-light uppercase">
          SCROLL
        </div>
      </div>

      {/* ── LAYER 9: Clickable overlay for sections ── */}
      <div className="absolute bottom-8 right-6 md:right-10 z-[9] flex items-center gap-4">
        <button
          onClick={() => scrollTo("#drivers")}
          className="font-display font-bold text-[10px] tracking-[0.2em] uppercase text-ink-light hover:text-ink transition-colors duration-200 flex items-center gap-2"
        >
          <span>DRIVERS</span>
          <span className="text-accent">↓</span>
        </button>
      </div>
    </section>
  );
}
