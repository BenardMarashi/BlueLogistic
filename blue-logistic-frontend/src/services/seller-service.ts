import api from "./api";
import { Seller, CreateSellerRequest, UpdateSellerStatusRequest, PaginatedResponse } from "@/types";

export const sellerService = {
  async getSellers(page = 0, size = 20): Promise<PaginatedResponse<Seller>> {
    const { data } = await api.get<PaginatedResponse<Seller>>("/api/sellers", { params: { page, size } });
    return data;
  },

  async getSellerById(id: string): Promise<Seller> {
    const { data } = await api.get<Seller>(`/api/sellers/${id}`);
    return data;
  },

  async createSeller(request: CreateSellerRequest): Promise<Seller> {
    const { data } = await api.post<Seller>("/api/sellers", request);
    return data;
  },

  async updateSellerStatus(id: string, request: UpdateSellerStatusRequest): Promise<Seller> {
    const { data } = await api.patch<Seller>(`/api/sellers/${id}/status`, request);
    return data;
  },
};
