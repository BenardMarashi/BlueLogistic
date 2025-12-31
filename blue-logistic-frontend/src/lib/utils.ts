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
