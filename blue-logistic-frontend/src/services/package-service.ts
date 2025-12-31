import api from "./api";
import { Package, CreatePackageRequest, UpdateStatusRequest, UpdateTrackingRequest, PaginatedResponse } from "@/types";

export const packageService = {
  async getPackages(page = 0, size = 20): Promise<PaginatedResponse<Package>> {
    const { data } = await api.get<PaginatedResponse<Package>>("/api/packages", { params: { page, size } });
    return data;
  },

  async getPackageById(id: string): Promise<Package> {
    const { data } = await api.get<Package>(`/api/packages/${id}`);
    return data;
  },

  async createPackage(request: CreatePackageRequest): Promise<Package> {
    const { data } = await api.post<Package>("/api/packages", request);
    return data;
  },

  async updateStatus(id: string, request: UpdateStatusRequest): Promise<Package> {
    const { data } = await api.patch<Package>(`/api/packages/${id}/status`, request);
    return data;
  },

  async updateTracking(id: string, request: UpdateTrackingRequest): Promise<Package> {
    const { data } = await api.patch<Package>(`/api/packages/${id}/tracking`, request);
    return data;
  },

  async deletePackage(id: string): Promise<void> {
    await api.delete(`/api/packages/${id}`);
  },
};
