import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number | string | null | undefined) {
  return `${Number(value ?? 0).toFixed(2)} kr`;
}

export function formatHours(value: number | string | null | undefined) {
  return Number(value ?? 0).toFixed(2);
}
