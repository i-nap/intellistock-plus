export interface Supplier {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  contactPerson?: string;
  website?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSupplierRequest {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  contactPerson?: string;
  website?: string;
}

export type UpdateSupplierRequest = CreateSupplierRequest;
