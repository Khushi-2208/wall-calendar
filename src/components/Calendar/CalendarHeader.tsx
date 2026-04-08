"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MONTH_NAMES } from "./data";
import { MonthData } from "./types";

interface Props {
  data: MonthData;
  dir:  number;
  onPrev: () => void;
  onNext: () => void;
}

const imgVariants = {
  enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
  center: {
    x: 0, opacity: 1,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
  exit: (d: number) => ({
    x: d > 0 ? "-55%" : "55%",
    opacity: 0,
    scale: 0.96,
    transition: { duration: 0.38, ease: [0.55, 0, 1, 0.45] as const },
  }),
};

const labelVariants = {
  hidden: { opacity: 0, y: 10 },
  show:   { opacity: 1, y: 0, transition: { delay: 0.25, duration: 0.35 } },
};

export default function CalendarHeader({ data, dir, onPrev, onNext }: Props) {
  const key = `${data.year}-${data.month}`;

  return (
    <div className="relative overflow-hidden" style={{ height: 265, borderRadius: "16px 16px 0 0" }}>

      {/* ── Spiral binding strip ── */}
      <div
        className="absolute top-0 left-0 right-0 z-30 flex items-center justify-around px-3"
        style={{ height: 22, background: "rgba(248,244,238,0.97)" }}
      >
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="ring-hole" />
        ))}
      </div>

      {/* ── Coil wires ── */}
      <div
        className="absolute left-0 right-0 z-30 flex items-center justify-around px-5"
        style={{ top: 12 }}
      >
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            style={{
              width: 11, height: 20,
              background: "linear-gradient(180deg,#c8c8c8,#e8e8e8 45%,#b0b0b0)",
              borderRadius: 6,
              boxShadow: "0 1px 4px rgba(0,0,0,0.28)",
            }}
          />
        ))}
      </div>

      {/* ── Sliding hero image ── */}
      <AnimatePresence custom={dir} mode="popLayout">
        <motion.div
          key={key}
          custom={dir}
          variants={imgVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0"
        >
          <Image
            src={data.image}
            alt={data.imageAlt}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 640px) 100vw, 420px"
          />

          {/* dark vignette bottom */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, transparent 28%, rgba(15,15,30,0.08) 55%, rgba(15,15,30,0.72) 100%)",
            }}
          />

          {/* ── Mountain wave cutout ── */}
          <div className="absolute bottom-0 left-0 right-0" style={{ lineHeight: 0 }}>
            <svg
              viewBox="0 0 600 88"
              preserveAspectRatio="none"
              style={{ width: "100%", height: 88, display: "block" }}
            >
              {/* accent fill under the cream wave */}
              <path
                d="M0,88 L0,52 C70,18 125,62 205,42 C268,22 308,54 358,36
                   C408,18 462,48 600,24 L600,88 Z"
                fill={data.accent}
                opacity="0.9"
              />
              {/* cream paper wave */}
              <path
                d="M0,88 L0,64 C55,42 108,74 185,58 C248,44 285,68 355,52
                   C425,36 482,62 600,48 L600,88 Z"
                fill="#fafaf7"
              />
            </svg>
          </div>

          {/* ── Month / year label ── */}
          <motion.div
            key={key + "-label"}
            variants={labelVariants}
            initial="hidden"
            animate="show"
            className="absolute bottom-0 right-0 z-10 text-right"
            style={{ paddingBottom: 14, paddingRight: 20 }}
          >
            <span
              className="block text-sm font-medium tracking-[0.22em]"
              style={{ fontFamily: "var(--font-body)", color: data.accent }}
            >
              {data.year}
            </span>
            <span
              className="block font-bold leading-none"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 28,
                color: data.accent,
                letterSpacing: "0.04em",
              }}
            >
              {MONTH_NAMES[data.month].toUpperCase()}
            </span>
            <span
              className="block text-xs tracking-widest mt-0.5 opacity-55"
              style={{ fontFamily: "var(--font-body)", color: "#1a1a2e", fontSize: 10 }}
            >
              {data.season}
            </span>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* ── Nav buttons ── */}
      {(["prev","next"] as const).map(side => (
        <button
          key={side}
          onClick={side === "prev" ? onPrev : onNext}
          className="absolute z-40 flex items-center justify-center rounded-full transition-transform duration-150 hover:scale-110 active:scale-90"
          style={{
            width: 32, height: 32,
            top: "50%", transform: "translateY(-50%)",
            marginTop: 10,
            [side === "prev" ? "left" : "right"]: 10,
            background: "rgba(255,255,255,0.82)",
            boxShadow: "0 2px 10px rgba(0,0,0,0.18)",
            border: "none",
            cursor: "pointer",
          }}
          aria-label={side === "prev" ? "Previous month" : "Next month"}
        >
          {side === "prev"
            ? <ChevronLeft  size={15} color="#1a1a2e" />
            : <ChevronRight size={15} color="#1a1a2e" />
          }
        </button>
      ))}
    </div>
  );
}
