import {
  eachDayOfInterval,
  endOfISOWeek,
  format,
  getISOWeek,
  getISOWeekYear,
  isSameDay,
  parseISO,
  startOfISOWeek,
} from "date-fns";
import { lt } from "date-fns/locale";
import { z } from "zod";
import type { WorkEntry } from "@/lib/types";

export const entrySchema = z.object({
  date: z.string().min(1),
  object_number: z.string().trim().min(1).max(100),
  object_name: z.string().trim().min(1).max(200),
  customer_name: z.string().trim().min(1).max(200),
  work_description: z.string().trim().min(1).max(1500),
  hours: z.coerce.number().min(0).max(24),
  parking_cost: z.coerce.number().min(0).max(999999).default(0),
  travel_cost: z.coerce.number().min(0).max(999999).default(0),
  city_entry_fee: z.coerce.number().min(0).max(999999).default(0),
});

export type EntryValues = z.infer<typeof entrySchema>;

export function enrichEntryDate(date: string) {
  const parsed = parseISO(date);
  return {
    year: getISOWeekYear(parsed),
    week_number: getISOWeek(parsed),
  };
}

export function getWeekDays(year: number, weekNumber: number) {
  const anchor = parseISO(`${year}-01-04`);
  const monday = startOfISOWeek(new Date(anchor.getTime() + (weekNumber - 1) * 7 * 24 * 60 * 60 * 1000));
  const sunday = endOfISOWeek(monday);
  return eachDayOfInterval({ start: monday, end: sunday }).map((day) => ({
    dayLabel: format(day, "EEEE", { locale: lt }),
    dateLabel: format(day, "yyyy-MM-dd"),
    date: day,
  }));
}

export function groupEntriesByWeekObject(entries: WorkEntry[]) {
  const grouped = new Map<string, WorkEntry[]>();

  for (const entry of entries) {
    const key = [entry.user_id, entry.year, entry.week_number, entry.object_number].join("|");
    const list = grouped.get(key) ?? [];
    list.push(entry);
    grouped.set(key, list);
  }

  return Array.from(grouped.entries()).map(([key, list]) => ({
    key,
    entries: list.sort((a, b) => a.date.localeCompare(b.date)),
    meta: {
      user_id: list[0].user_id,
      employee_name: list[0].employee_name,
      employee_email: list[0].employee_email,
      year: list[0].year,
      week_number: list[0].week_number,
      object_number: list[0].object_number,
      object_name: list[0].object_name,
      customer_name: list[0].customer_name,
    },
  }));
}

export function buildWeekRows(entries: WorkEntry[], year: number, weekNumber: number) {
  return getWeekDays(year, weekNumber).map((day) => {
    const entry = entries.find((item) => isSameDay(parseISO(item.date), day.date));
    return {
      dayLabel: day.dayLabel,
      dateLabel: day.dateLabel,
      work_description: entry?.work_description ?? "",
      hours: Number(entry?.hours ?? 0),
      parking_cost: Number(entry?.parking_cost ?? 0),
      travel_cost: Number(entry?.travel_cost ?? 0),
      city_entry_fee: Number(entry?.city_entry_fee ?? 0),
    };
  });
}
