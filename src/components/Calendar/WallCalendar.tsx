"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useCalendar, NOTE_COLORS } from "@/hooks/useCalendar";
import { resolveMonthData } from "./data";
import CalendarHeader from "./CalendarHeader";
import CalendarGrid   from "./CalendarGrid";
import NotesSection   from "./NotesSection";

export default function WallCalendar() {
  const {
    month, year,
    range, step, hovered, setHovered,
    notes, monthNotes,
    activeColor, setActiveColor,
    showInput, setShowInput,
    inputText, setInputText,
    goMonth, handleDayClick, clearRange, addNote, deleteNote,
  } = useCalendar();

  const [dir, setDir] = useState(0);

  const prev = () => { setDir(-1); goMonth(-1); };
  const next = () => { setDir( 1); goMonth( 1); };

  const mdata  = resolveMonthData(month, year);
  const accent = mdata.accent;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.95 }}
      animate={{ opacity: 1, y:  0, scale: 1    }}
      transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ width: "100%", maxWidth: 380 }}
    >
      <div
        style={{
          position: "relative",
          filter:
            "drop-shadow(0 28px 55px rgba(0,0,0,0.18)) drop-shadow(0 6px 18px rgba(0,0,0,0.10))",
        }}
      >
        {/* ── Calendar card ── */}
        <div
          className="paper-texture"
          style={{
            background: "#fafaf7",
            borderRadius: 16,
            overflow: "hidden",
            position: "relative",
            zIndex: 1,
          }}
        >

          <CalendarHeader data={mdata} dir={dir} onPrev={prev} onNext={next} />


          <CalendarGrid
            month={month}
            year={year}
            dir={dir}
            range={range}
            hovered={hovered}
            notes={notes}
            accent={accent}
            onDayClick={handleDayClick}
            onDayEnter={setHovered}
            onDayLeave={() => setHovered(null)}
          />

          {/* notes panel */}
          <NotesSection
            notes={monthNotes}
            month={month}
            year={year}
            accent={accent}
            noteColors={NOTE_COLORS}
            activeColor={activeColor}
            showInput={showInput}
            inputText={inputText}
            step={step}
            rangeStart={range.start}
            rangeEnd={range.end}
            onColorChange={setActiveColor}
            onInputChange={setInputText}
            onAddNote={addNote}
            onDeleteNote={deleteNote}
            onOpenInput={() => setShowInput(true)}
            onCloseInput={() => { setShowInput(false); setInputText(""); }}
            onClearRange={clearRange}
          />

          <motion.div
            key={accent}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{
              height: 3,
              background: `linear-gradient(90deg, ${accent} 0%, ${accent}60 100%)`,
              transformOrigin: "left",
            }}
          />
        </div>

        {/* stacked page illusion */}
        <div
          style={{
            position: "absolute",
            bottom: -6, left: 10, right: 10,
            height: 14, borderRadius: "0 0 16px 16px",
            background: "rgba(0,0,0,0.055)",
            filter: "blur(5px)",
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -12, left: 20, right: 20,
            height: 14, borderRadius: "0 0 16px 16px",
            background: "rgba(0,0,0,0.035)",
            filter: "blur(8px)",
            zIndex: -1,
          }}
        />
      </div>

      {/* ── Hint text ── */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        style={{
          textAlign: "center",
          marginTop: 20,
          fontFamily: "var(--font-body)",
          fontSize: 10,
          color: "rgba(26,26,46,0.35)",
          letterSpacing: "0.04em",
        }}
      >
        Click a start date · click an end date · notes are saved automatically
      </motion.p>
    </motion.div>
  );
}
