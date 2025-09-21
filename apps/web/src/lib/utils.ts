/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function sanitizeCell(v: any) {
  if (v === undefined || v === null) return null;
  if (typeof v === "string") {
    const t = v.trim();
    return t === "" ? null : t;       
  }
  return v;
}

export function sanitizeRow<T extends Record<string, any>>(row: T): T {
  const out: Record<string, any> = {};
  for (const k of Object.keys(row)) {
    out[k] = sanitizeCell(row[k]);
  }
  return out as T;
}
