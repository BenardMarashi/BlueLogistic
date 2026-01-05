import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { PackageStatus } from "@/types";
import { STATUS_LABELS, STATUS_COLORS } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getStatusLabel(status: PackageStatus): string {
  return STATUS_LABELS[status] || status;
}

export function getStatusColor(status: PackageStatus): string {
  return STATUS_COLORS[status] || "bg-gray-100 text-gray-700";
}

export function formatWeight(weight: number): string {
  return `${weight.toFixed(2)} kg`;
}

export function formatPrice(amount: number | undefined | null): string {
  if (amount == null) return '—';
  return `€${amount.toFixed(2)}`;
}

export const SUPPORTED_COUNTRIES: Record<string, string> = {
  AT: 'Austria',
  BA: 'Bosnia and Herzegovina',
  BE: 'Belgium',
  BG: 'Bulgaria',
  CH: 'Switzerland',
  CZ: 'Czechia',
  DE: 'Germany',
  DK: 'Denmark',
  EE: 'Estonia',
  ES: 'Spain',
  FI: 'Finland',
  FR: 'France',
  GR: 'Greece',
  HR: 'Croatia',
  HU: 'Hungary',
  IE: 'Ireland',
  IS: 'Iceland',
  IT: 'Italy',
  LT: 'Lithuania',
  LU: 'Luxembourg',
  LV: 'Latvia',
  NL: 'Netherlands',
  PL: 'Poland',
  PT: 'Portugal',
  RO: 'Romania',
  RS: 'Serbia',
  SE: 'Sweden',
  SI: 'Slovenia',
  SK: 'Slovakia',
};

export function getCountryName(code: string): string {
  return SUPPORTED_COUNTRIES[code?.toUpperCase()] || code;
}

export function getCountryOptions(): { value: string; label: string }[] {
  return Object.entries(SUPPORTED_COUNTRIES)
    .map(([value, label]) => ({ value, label }))
    .sort((a, b) => a.label.localeCompare(b.label));
}
