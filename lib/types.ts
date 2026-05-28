export type UserRole = "admin" | "superadmin";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

export interface SessionPayload {
  userId: string;
  role: UserRole;
  email: string;
  name: string;
}

export type FacingDirection = "Utara" | "Selatan" | "Timur" | "Barat";
export type PropertyType = "Ruko" | "Villa";
export type PropertyStatus = "in_stock" | "sold_out";
export type PropertyReadiness =
  | "siap_huni"
  | "siap_kosong"
  | "siap_huni_renovasi";

export interface Property {
  id: string;
  name: string;
  group: string | null;
  width: number;
  length: number;
  facing: FacingDirection[];
  type: PropertyType;
  floors: number;
  price: number;
  carport: boolean;
  status: PropertyStatus;
  readiness: PropertyReadiness;
  mapsUrl: string | null;
  area: string[];
  unit: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  deletedAt: string | null;
}

export interface PropertyFilters {
  search?: string;
  area?: string[];
  minWidth?: number;
  facing?: FacingDirection[];
  maxPrice?: number;
  type?: PropertyType | "all";
  status?: PropertyStatus | "all";
  readiness?: PropertyReadiness[];
  carport?: boolean | "all";
  page?: number;
  perPage?: number;
  sortBy?: "name" | "price_asc" | "price_desc" | "created_at" | "status";
}

export interface PaginatedProperties {
  items: Property[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface AuditLog {
  id: string;
  userId: string;
  entityType: string;
  entityId: string;
  action: "create" | "update" | "delete";
  changes: Record<string, unknown>;
  createdAt: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export type ActionResult<T = void> =
  | { success: true; data?: T; fieldErrors?: never }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };
