import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function normalizeEmailList(values: readonly string[] = []) {
  return Array.from(
    new Set(
      values
        .map(normalizeEmail)
        .filter((value) => value.length > 0),
    ),
  );
}
