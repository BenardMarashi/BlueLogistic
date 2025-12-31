import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export const createPackageSchema = z.object({
  description: z.string().min(1, "Description is required").max(500, "Description too long"),
  weight: z.number({ invalid_type_error: "Weight must be a number" }).positive("Weight must be positive").max(1000, "Weight cannot exceed 1000 kg"),
  customerName: z.string().min(2, "Customer name must be at least 2 characters").max(100, "Customer name too long"),
  customerEmail: z.string().min(1, "Customer email is required").email("Invalid email format"),
  customerPhone: z.string().min(8, "Phone must be at least 8 characters").regex(/^\+?[0-9\s\-]+$/, "Invalid phone format"),
  deliveryAddress: z.string().min(5, "Address must be at least 5 characters").max(500, "Address too long"),
});

export const createSellerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name too long"),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  companyName: z.string().min(2, "Company name must be at least 2 characters").max(100, "Company name too long"),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type CreatePackageFormData = z.infer<typeof createPackageSchema>;
export type CreateSellerFormData = z.infer<typeof createSellerSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
