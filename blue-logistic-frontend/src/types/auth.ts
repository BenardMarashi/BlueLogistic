export type UserRole = "ADMIN" | "SELLER";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userId: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
