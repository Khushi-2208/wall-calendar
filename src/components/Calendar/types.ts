export interface DateRange {
  start: Date | null;
  end:   Date | null;
}

export interface CalNote {
  id:    string;
  text:  string;
  date:  string;  
  color: string;
}

export interface MonthData {
  month:    number;  
  year:     number;
  image:    string;
  imageAlt: string;
  accent:   string;
  season:   string;
}