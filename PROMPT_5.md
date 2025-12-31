# PROMPT 5: React Query Hooks

Working directory: ~/BlueLogistic/blue-logistic-frontend/src/

## File 1: src/hooks/usePackages.ts

```typescript
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { packageService } from "@/services";
import { CreatePackageRequest, UpdateStatusRequest, UpdateTrackingRequest } from "@/types";
import { toast } from "sonner";

export function usePackages(page = 0, size = 20) {
  return useQuery({
    queryKey: ["packages", page, size],
    queryFn: () => packageService.getPackages(page, size),
  });
}

export function usePackage(id: string) {
  return useQuery({
    queryKey: ["package", id],
    queryFn: () => packageService.getPackageById(id),
    enabled: !!id,
  });
}

export function useCreatePackage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreatePackageRequest) => packageService.createPackage(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages"] });
      toast.success("Package created successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to create package");
    },
  });
}

export function useUpdateStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: string; request: UpdateStatusRequest }) =>
      packageService.updateStatus(id, request),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["packages"] });
      queryClient.invalidateQueries({ queryKey: ["package", data.id] });
      toast.success(`Status updated to ${data.status.replace("_", " ")}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to update status");
    },
  });
}

export function useUpdateTracking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: string; request: UpdateTrackingRequest }) =>
      packageService.updateTracking(id, request),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["packages"] });
      queryClient.invalidateQueries({ queryKey: ["package", data.id] });
      toast.success("Tracking number added");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to add tracking");
    },
  });
}

export function useDeletePackage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => packageService.deletePackage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages"] });
      toast.success("Package deleted");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to delete package");
    },
  });
}
```

## File 2: src/hooks/useSellers.ts

```typescript
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sellerService } from "@/services";
import { CreateSellerRequest, UpdateSellerStatusRequest } from "@/types";
import { toast } from "sonner";

export function useSellers(page = 0, size = 20) {
  return useQuery({
    queryKey: ["sellers", page, size],
    queryFn: () => sellerService.getSellers(page, size),
  });
}

export function useSeller(id: string) {
  return useQuery({
    queryKey: ["seller", id],
    queryFn: () => sellerService.getSellerById(id),
    enabled: !!id,
  });
}

export function useCreateSeller() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateSellerRequest) => sellerService.createSeller(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sellers"] });
      toast.success("Seller created successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to create seller");
    },
  });
}

export function useUpdateSellerStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: string; request: UpdateSellerStatusRequest }) =>
      sellerService.updateSellerStatus(id, request),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["sellers"] });
      queryClient.invalidateQueries({ queryKey: ["seller", data.id] });
      toast.success(`Seller is now ${data.isActive ? "active" : "inactive"}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to update seller status");
    },
  });
}
```

## File 3: src/hooks/useDebounce.ts

```typescript
import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
```

## File 4: src/hooks/index.ts

```typescript
export { useAuth } from "./useAuth";
export { usePackages, usePackage, useCreatePackage, useUpdateStatus, useUpdateTracking, useDeletePackage } from "./usePackages";
export { useSellers, useSeller, useCreateSeller, useUpdateSellerStatus } from "./useSellers";
export { useDebounce } from "./useDebounce";
```

---

After creating all files, verify no TypeScript errors with `npm run dev`.
