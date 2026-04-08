export interface DateRange {
  start: Date | null;
  end:   Date | null;
}

export interface CalNote {
  id:    string;
  text:  string;
  date:  string;  // "YYYY-MM-DD"
  color: string;
}

export interface MonthData {
  month:    number;  // 0–11
  year:     number;
  image:    string;
  imageAlt: string;
  accent:   string;
  season:   string;
}