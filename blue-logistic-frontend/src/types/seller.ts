export interface Seller {
  id: string;
  userId: string;
  name: string;
  email: string;
  companyName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSellerRequest {
  name: string;
  email: string;
  password: string;
  companyName: string;
}

export interface UpdateSellerStatusRequest {
  isActive: boolean;
}
