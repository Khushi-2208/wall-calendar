"use client";

import { useState, useCallback, useEffect } from "react";
import { DateRange, CalNote } from "@/components/Calendar/types";
import { toDateKey } from "@/components/Calendar/data";

export const NOTE_COLORS = [
  "#1a9de0", "#e07db0", "#4caf86",
  "#ff8c42", "#8b5cf6", "#e53935",
];

const STORAGE_KEY = "wall-cal-notes-v2";

export function useCalendar() {
  const now = new Date();

  const [month, setMonth] = useState(now.getMonth());
  const [year,  setYear]  = useState(now.getFullYear());

  const [range,   setRange]   = useState<DateRange>({ start: null, end: null });
  const [step,    setStep]    = useState<"start" | "end">("start");
  const [hovered, setHovered] = useState<Date | null>(null);

  const [notes,       setNotes]       = useState<CalNote[]>([]);
  const [activeColor, setActiveColor] = useState(NOTE_COLORS[0]);
  const [showInput,   setShowInput]   = useState(false);
  const [inputText,   setInputText]   = useState("");
  const [inputDate,   setInputDate]   = useState<Date | null>(null);

  /* ── persist notes ── */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setNotes(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(notes)); }
    catch { /* ignore */ }
  }, [notes]);

  /* ── navigation ── */
  const goMonth = useCallback((dir: 1 | -1) => {
    setMonth(prev => {
      const next = prev + dir;
      if (next > 11) { setYear(y => y + 1); return 0; }
      if (next < 0)  { setYear(y => y - 1); return 11; }
      return next;
    });
  }, []);

  /* ── day click ── */
  const handleDayClick = useCallback((date: Date, isCurrent: boolean) => {
    if (!isCurrent) return;

    if (step === "start") {
      setRange({ start: date, end: null });
      setStep("end");
    } else {
      setRange(r => ({ start: r.start, end: date }));
      setStep("start");
      setInputDate(date);
      setShowInput(true);
    }
  }, [step]);

  /* ── clear ── */
  const clearRange = useCallback(() => {
    setRange({ start: null, end: null });
    setStep("start");
    setShowInput(false);
    setInputText("");
  }, []);

  /* ── add / delete note ── */
  const addNote = useCallback((text: string) => {
    if (!text.trim()) return;
    const target = inputDate ?? new Date();
    const note: CalNote = {
      id:    crypto.randomUUID(),
      text:  text.trim(),
      date:  toDateKey(target),
      color: activeColor,
    };
    setNotes(prev => [note, ...prev]);
    setInputText("");
    setShowInput(false);
  }, [activeColor, inputDate]);

  const deleteNote = useCallback((id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  }, []);

  /* ── derived ── */
  const monthNotes = notes.filter(n => {
    const [y, m] = n.date.split("-").map(Number);
    return y === year && m - 1 === month;
  });

  return {
    month, year,
    range, step, hovered, setHovered,
    notes, monthNotes,
    activeColor, setActiveColor,
    showInput, setShowInput,
    inputText, setInputText,
    inputDate,
    goMonth, handleDayClick, clearRange, addNote, deleteNote,
  };
}