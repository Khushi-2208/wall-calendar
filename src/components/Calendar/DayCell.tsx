"use client";

import { motion } from "framer-motion";
import {
  toDateKey, sameDay, inRange, isRangeStart, isRangeEnd, HOLIDAYS,
} from "./data";
import { DateRange, CalNote } from "./types";

interface Props {
  date:         Date;
  curMonth:     number;
  curYear:      number;
  range:        DateRange;
  hovered:      Date | null;
  notes:        CalNote[];
  accent:       string;
  idx:          number;
  onEnter:      (d: Date) => void;
  onLeave:      () => void;
  onClick:      (d: Date, isCurrent: boolean) => void;
}

export default function DayCell({
  date, curMonth, curYear, range, hovered, notes, accent, idx,
  onEnter, onLeave, onClick,
}: Props) {
  const isCurrent = date.getMonth() === curMonth && date.getFullYear() === curYear;
  const isToday   = sameDay(date, new Date());
  const isWknd    = date.getDay() === 0 || date.getDay() === 6;
  const key       = toDateKey(date);
  const holiday   = HOLIDAYS[key];
  const dayNotes  = notes.filter(n => n.date === key);

  /* live preview while user picks end date */
  const effectiveEnd = range.start && !range.end ? hovered : range.end;
  const eff: DateRange = { start: range.start, end: effectiveEnd };

  const rStart  = isRangeStart(date, eff.start, eff.end);
  const rEnd    = isRangeEnd(date,   eff.start, eff.end);
  const rMiddle = inRange(date,      eff.start, eff.end);
  const rActive = rStart || rEnd || rMiddle;

  /* colours */
  const dotColor = isCurrent
    ? isWknd   ? accent
    : isToday  ? accent
    : "#1a1a2e"
    : "rgba(26,26,46,0.22)";

  const bubbleBg =
    (rStart || rEnd)        ? accent
    : (isToday && !rActive) ? `${accent}1a`
    : "transparent";

  const bubbleColor =
    (rStart || rEnd)        ? "#fff"
    : isCurrent             ? dotColor
    : "rgba(26,26,46,0.22)";

  return (
    <motion.div
      className="day-cell"
      initial={{ opacity: 0, scale: 0.75 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: idx * 0.010, duration: 0.22, ease: "easeOut" }}
    >
      {/* ── Range background strip ── */}
      {rMiddle && (
        <div
          className="range-strip-full"
          style={{ background: `${accent}1e` }}
        />
      )}
      {rStart && eff.end && (
        <div
          className="range-strip-start"
          style={{ background: `${accent}1e` }}
        />
      )}
      {rEnd && (
        <div
          className="range-strip-end"
          style={{ background: `${accent}1e` }}
        />
      )}

      {/* ── Day bubble ── */}
      <motion.button
        whileTap={{ scale: 0.84 }}
        whileHover={isCurrent ? { scale: 1.15 } : {}}
        onClick={() => onClick(date, isCurrent)}
        onMouseEnter={() => isCurrent && onEnter(date)}
        onMouseLeave={onLeave}
        style={{
          position: "relative",
          zIndex: 10,
          width: 32, height: 32,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-body)",
          fontSize: 12,
          fontWeight: isToday ? 700 : isWknd ? 600 : 400,
          cursor: isCurrent ? "pointer" : "default",
          background: bubbleBg,
          color: bubbleColor,
          border: "none",
          outline: "none",
          boxShadow: (rStart || rEnd) ? `0 3px 12px ${accent}55` : "none",
          transition: "background 0.15s, color 0.15s",
        }}
        aria-label={key}
        title={holiday ?? undefined}
      >
        {date.getDate()}

        {/* today ring */}
        {isToday && !rStart && !rEnd && (
          <span
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: `1.5px solid ${accent}`,
              opacity: 0.5,
              pointerEvents: "none",
            }}
          />
        )}
      </motion.button>

      {/* ── dots row (holiday + notes) ── */}
      {isCurrent && (holiday || dayNotes.length > 0) && (
        <div style={{ display: "flex", gap: 2, marginTop: 1 }}>
          {holiday && (
            <div
              title={holiday}
              style={{ width: 4, height: 4, borderRadius: "50%", background: accent, flexShrink: 0 }}
            />
          )}
          {dayNotes.slice(0, 2).map(n => (
            <div
              key={n.id}
              style={{ width: 4, height: 4, borderRadius: "50%", background: n.color, flexShrink: 0 }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
