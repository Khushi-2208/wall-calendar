"use client";

import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, X, PenLine } from "lucide-react";
import { CalNote } from "./types";
import { MONTH_NAMES } from "./data";

interface Props {
  notes:        CalNote[];
  month:        number;
  year:         number;
  accent:       string;
  noteColors:   string[];
  activeColor:  string;
  showInput:    boolean;
  inputText:    string;
  step:         "start" | "end";
  rangeStart:   Date | null;
  rangeEnd:     Date | null;
  onColorChange:  (c: string) => void;
  onInputChange:  (v: string) => void;
  onAddNote:      (text: string) => void;
  onDeleteNote:   (id: string) => void;
  onOpenInput:    () => void;
  onCloseInput:   () => void;
  onClearRange:   () => void;
}

const fmt = (d: Date) =>
  `${d.getDate()} ${MONTH_NAMES[d.getMonth()].slice(0, 3)}`;

export default function NotesSection({
  notes, month, accent, noteColors, activeColor,
  showInput, inputText, step, rangeStart, rangeEnd,
  onColorChange, onInputChange, onAddNote,
  onDeleteNote, onOpenInput, onCloseInput, onClearRange,
}: Props) {
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (showInput) taRef.current?.focus();
  }, [showInput]);

  const rangeLabel =
    rangeStart && rangeEnd ? `${fmt(rangeStart)} – ${fmt(rangeEnd)}`
    : rangeStart           ? `From ${fmt(rangeStart)}`
    : null;

  return (
    <div
      style={{
        padding: "12px 16px 18px",
        borderTop: `1px solid ${accent}18`,
      }}
    >
      {/* ── Header row ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <PenLine size={13} color={accent} />
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 9,
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(26,26,46,0.45)",
            }}
          >
            Notes
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Range badge */}
          <AnimatePresence>
            {rangeLabel && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85, x: 6 }}
                animate={{ opacity: 1, scale: 1,    x: 0 }}
                exit={{   opacity: 0, scale: 0.85, x: 6 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "2px 8px",
                  borderRadius: 999,
                  background: `${accent}14`,
                  color: accent,
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  whiteSpace: "nowrap",
                }}
              >
                {rangeLabel}
                <button
                  onClick={onClearRange}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 0, lineHeight: 1 }}
                >
                  <X size={9} color={accent} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Add / close button */}
          <motion.button
            whileTap={{ scale: 0.88 }}
            whileHover={{ scale: 1.12 }}
            onClick={showInput ? onCloseInput : onOpenInput}
            style={{
              width: 24, height: 24,
              borderRadius: "50%",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: accent,
              boxShadow: `0 2px 8px ${accent}44`,
            }}
            aria-label="Add note"
          >
            <motion.div
              animate={{ rotate: showInput ? 45 : 0 }}
              transition={{ duration: 0.22 }}
              style={{ display: "flex" }}
            >
              <Plus size={13} color="#fff" />
            </motion.div>
          </motion.button>
        </div>
      </div>

      {/* ── Selection hint ── */}
      <AnimatePresence>
        {step === "end" && rangeStart && !rangeEnd && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{   opacity: 0, height: 0 }}
            style={{ overflow: "hidden" }}
          >
            <div
              style={{
                marginBottom: 8,
                padding: "6px 10px",
                borderRadius: 8,
                background: `${accent}0f`,
                color: accent,
                fontFamily: "var(--font-body)",
                fontSize: 10,
                textAlign: "center",
              }}
            >
              Now click an end date to complete your range
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Note input panel ── */}
      <AnimatePresence>
        {showInput && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -6 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{   opacity: 0, height: 0, y: -6 }}
            transition={{ duration: 0.24 }}
            style={{ overflow: "hidden", marginBottom: 10 }}
          >
            {/* colour swatches */}
            <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
              {noteColors.map(c => (
                <button
                  key={c}
                  onClick={() => onColorChange(c)}
                  style={{
                    width: 18, height: 18,
                    borderRadius: "50%",
                    background: c,
                    border: "none",
                    cursor: "pointer",
                    transform: activeColor === c ? "scale(1.35)" : "scale(1)",
                    boxShadow: activeColor === c
                      ? `0 0 0 2px #fafaf7, 0 0 0 3.5px ${c}`
                      : "none",
                    transition: "transform 0.15s, box-shadow 0.15s",
                  }}
                />
              ))}
            </div>

            <textarea
              ref={taRef}
              value={inputText}
              onChange={e => onInputChange(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onAddNote(inputText); }
                if (e.key === "Escape") onCloseInput();
              }}
              placeholder="Write a note… (Enter to save, Shift+Enter for newline)"
              rows={2}
              style={{
                width: "100%",
                resize: "none",
                fontFamily: "var(--font-body)",
                fontSize: 11,
                lineHeight: 1.55,
                padding: "8px 10px",
                borderRadius: 8,
                border: `1.5px solid ${activeColor}40`,
                background: `${activeColor}0e`,
                color: "#1a1a2e",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 6, marginTop: 6 }}>
              <button
                onClick={onCloseInput}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 10,
                  padding: "4px 10px",
                  borderRadius: 6,
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  color: "rgba(26,26,46,0.38)",
                }}
              >
                Cancel
              </button>
              <motion.button
                whileTap={{ scale: 0.94 }}
                onClick={() => onAddNote(inputText)}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 10,
                  padding: "4px 12px",
                  borderRadius: 6,
                  border: "none",
                  background: activeColor,
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Save
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Notes list ── */}
      <div
        className="note-lines"
        style={{ maxHeight: 120, overflowY: "auto", paddingRight: 2 }}
      >
        <AnimatePresence mode="popLayout">
          {notes.length === 0 && !showInput && (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 10,
                fontStyle: "italic",
                color: "rgba(26,26,46,0.28)",
                paddingTop: 4,
                margin: 0,
              }}
            >
              No notes for {MONTH_NAMES[month]}. Tap + to add one.
            </motion.p>
          )}

          {notes.map(note => (
            <motion.div
              key={note.id}
              layout
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 6,
                marginBottom: 4,
                /* group hover handled via JS below */
              }}
              className="group"
            >
              <div
                style={{
                  width: 5, height: 5,
                  borderRadius: "50%",
                  background: note.color,
                  flexShrink: 0,
                  marginTop: 4,
                }}
              />
              <span
                style={{
                  flex: 1,
                  fontFamily: "var(--font-body)",
                  fontSize: 11,
                  color: "#1a1a2e",
                  lineHeight: 1.5,
                  wordBreak: "break-word",
                }}
              >
                {note.text}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  color: "rgba(26,26,46,0.28)",
                  flexShrink: 0,
                  paddingTop: 2,
                }}
              >
                {note.date.slice(8)}
              </span>
              <button
                onClick={() => onDeleteNote(note.id)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  flexShrink: 0,
                  paddingTop: 1,
                  opacity: 0.35,
                  lineHeight: 1,
                  transition: "opacity 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "0.35")}
                aria-label="Delete note"
              >
                <Trash2 size={11} color="rgba(26,26,46,0.6)" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
