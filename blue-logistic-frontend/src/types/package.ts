export type PackageStatus = "CREATED" | "IN_STORAGE" | "DISPATCHED";

export interface Package {
  id: string;
  sellerId: string;
  sellerName: string;
  trackingNumber: string | null;
  description: string;
  weight: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  status: PackageStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePackageRequest {
  description: string;
  weight: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
}

export interface UpdateStatusRequest {
  status: PackageStatus;
}

export interface UpdateTrackingRequest {
  trackingNumber: string;
}
