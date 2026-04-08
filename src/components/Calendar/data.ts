import { MonthData } from "./types";

/* ─── 12 months × unique Unsplash photo + accent colour ─── */
export const MONTHS: MonthData[] = [
  { month: 0,  year: 2025, image: "https://images.unsplash.com/photo-1551582045-6ec9c11d8697?w=800&q=80", imageAlt: "Climber ascending icy peak",          accent: "#1a9de0", season: "Winter" },
  { month: 1,  year: 2025, image: "https://images.unsplash.com/photo-1491555103944-7c647fd857e6?w=800&q=80", imageAlt: "Snow-laden pine forest",            accent: "#5b8dd9", season: "Winter" },
  { month: 2,  year: 2025, image: "https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=800&q=80", imageAlt: "Cherry blossoms in full bloom",      accent: "#e07db0", season: "Spring" },
  { month: 3,  year: 2025, image: "https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=800&q=80", imageAlt: "Lush meadow with wildflowers",       accent: "#4caf86", season: "Spring" },
  { month: 4,  year: 2025, image: "https://images.unsplash.com/photo-1431794062232-2a99a5431c6c?w=800&q=80", imageAlt: "Coastal cliffs and turquoise sea",   accent: "#00bcd4", season: "Spring" },
  { month: 5,  year: 2025, image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80", imageAlt: "Tropical beach at golden hour",      accent: "#ff8c42", season: "Summer" },
  { month: 6,  year: 2025, image: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80", imageAlt: "Sunflower field at sunset",          accent: "#f5c518", season: "Summer" },
  { month: 7,  year: 2025, image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80", imageAlt: "Kayaking on a glassy mountain lake", accent: "#26a69a", season: "Summer" },
  { month: 8,  year: 2025, image: "https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?w=800&q=80", imageAlt: "Forest path in early autumn",        accent: "#d4831a", season: "Autumn" },
  { month: 9,  year: 2025, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80", imageAlt: "Fiery maple canopy",                 accent: "#e53935", season: "Autumn" },
  { month: 10, year: 2025, image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80", imageAlt: "Misty late-autumn woodland",         accent: "#8d6e63", season: "Autumn" },
  { month: 11, year: 2025, image: "https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=800&q=80", imageAlt: "Snow-dusted village at Christmas",   accent: "#1a9de0", season: "Winter" },
];

export const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

export const DAY_NAMES = ["MON","TUE","WED","THU","FRI","SAT","SUN"];

export const HOLIDAYS: Record<string, string> = {
  "2025-01-01": "New Year's Day",
  "2025-02-14": "Valentine's Day",
  "2025-03-17": "St. Patrick's Day",
  "2025-04-18": "Good Friday",
  "2025-04-20": "Easter Sunday",
  "2025-05-26": "Memorial Day",
  "2025-06-19": "Juneteenth",
  "2025-07-04": "Independence Day",
  "2025-09-01": "Labor Day",
  "2025-10-31": "Halloween",
  "2025-11-27": "Thanksgiving",
  "2025-12-25": "Christmas Day",
  "2025-12-31": "New Year's Eve",
};

/* ─── helpers ─── */

/** Returns 42 Date objects (6 rows × 7 cols, Mon-first grid) */
export function getMonthDays(year: number, month: number): Date[] {
  const first = new Date(year, month, 1);
  const last  = new Date(year, month + 1, 0);

  let offset = first.getDay() - 1; // Mon = 0
  if (offset < 0) offset = 6;

  const days: Date[] = [];

  for (let i = 0; i < offset; i++)
    days.push(new Date(year, month, 1 - offset + i));

  for (let i = 1; i <= last.getDate(); i++)
    days.push(new Date(year, month, i));

  const fill = 42 - days.length;
  for (let i = 1; i <= fill; i++)
    days.push(new Date(year, month + 1, i));

  return days;
}

export function toDateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

export function sameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() &&
         a.getMonth()    === b.getMonth()    &&
         a.getDate()     === b.getDate();
}

export function inRange(date: Date, a: Date | null, b: Date | null): boolean {
  if (!a || !b) return false;
  const t = date.getTime();
  return t > Math.min(a.getTime(), b.getTime()) &&
         t < Math.max(a.getTime(), b.getTime());
}

export function isRangeStart(date: Date, a: Date | null, b: Date | null): boolean {
  if (!a) return false;
  const lo = b && a.getTime() > b.getTime() ? b : a;
  return sameDay(date, lo);
}

export function isRangeEnd(date: Date, a: Date | null, b: Date | null): boolean {
  if (!a || !b) return false;
  const hi = a.getTime() > b.getTime() ? a : b;
  return sameDay(date, hi);
}

/** Resolve the month data for any year/month, falling back gracefully */
export function resolveMonthData(month: number, year: number): MonthData {
  return (
    MONTHS.find(m => m.month === month && m.year === year) ??
    MONTHS.find(m => m.month === month) ??
    MONTHS[month % 12]
  );
}