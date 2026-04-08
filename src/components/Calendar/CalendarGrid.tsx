"use client";

import { motion, AnimatePresence } from "framer-motion";
import { getMonthDays, DAY_NAMES, toDateKey } from "./data";
import { DateRange, CalNote } from "./types";
import DayCell from "./DayCell";

interface Props {
  month:    number;
  year:     number;
  dir:      number;
  range:    DateRange;
  hovered:  Date | null;
  notes:    CalNote[];
  accent:   string;
  onDayClick:  (d: Date, isCurrent: boolean) => void;
  onDayEnter:  (d: Date) => void;
  onDayLeave:  () => void;
}

const gridVars = {
  enter: (d: number) => ({ x: d > 0 ? 36 : -36, opacity: 0 }),
  show:  { x: 0, opacity: 1, transition: { duration: 0.32, ease: "easeOut" } },
  exit:  (d: number) => ({ x: d > 0 ? -36 : 36, opacity: 0, transition: { duration: 0.22 } }),
};

export default function CalendarGrid({
  month, year, dir, range, hovered, notes, accent,
  onDayClick, onDayEnter, onDayLeave,
}: Props) {
  const days = getMonthDays(year, month);

  return (
    <div style={{ padding: "12px 16px 8px" }}>
      {/* ── Day-of-week headers ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: 4 }}>
        {DAY_NAMES.map((d, i) => (
          <div
            key={d}
            style={{
              textAlign: "center",
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              fontWeight: 500,
              letterSpacing: "0.12em",
              paddingBlock: 4,
              color: i >= 5 ? accent : "rgba(26,26,46,0.40)",
            }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* ── Divider ── */}
      <div style={{ height: 1, background: `${accent}1a`, marginBottom: 6 }} />

      {/* ── Day grid with slide animation ── */}
      <AnimatePresence custom={dir} mode="popLayout">
        <motion.div
          key={`${year}-${month}`}
          custom={dir}
          variants={gridVars}
          initial="enter"
          animate="show"
          exit="exit"
          style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", rowGap: 2 }}
        >
          {days.map((date, idx) => (
            <DayCell
              key={toDateKey(date)}
              date={date}
              curMonth={month}
              curYear={year}
              range={range}
              hovered={hovered}
              notes={notes}
              accent={accent}
              idx={idx}
              onEnter={onDayEnter}
              onLeave={onDayLeave}
              onClick={onDayClick}
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
