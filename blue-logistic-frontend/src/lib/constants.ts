import { PackageStatus } from "@/types";

export const APP_NAME = "BlueLogistic";
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const AUTH_TOKEN_KEY = "bluelogistic_token";
export const AUTH_USER_KEY = "bluelogistic_user";

export const PAGINATION_DEFAULT_SIZE = 20;
export const DEBOUNCE_DELAY = 300;
export const TOAST_DURATION = 5000;

export const STATUS_LABELS: Record<PackageStatus, string> = {
  CREATED: "Created",
  IN_STORAGE: "In Storage",
  DISPATCHED: "Dispatched",
};

export const STATUS_COLORS: Record<PackageStatus, string> = {
  CREATED: "bg-slate-100 text-slate-700 border-slate-200",
  IN_STORAGE: "bg-blue-100 text-blue-700 border-blue-200",
  DISPATCHED: "bg-green-100 text-green-700 border-green-200",
};

export const STATUS_NEXT: Record<PackageStatus, PackageStatus | null> = {
  CREATED: "IN_STORAGE",
  IN_STORAGE: "DISPATCHED",
  DISPATCHED: null,
};
