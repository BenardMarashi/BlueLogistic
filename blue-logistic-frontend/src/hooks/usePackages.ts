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
