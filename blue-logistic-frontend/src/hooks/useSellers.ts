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
