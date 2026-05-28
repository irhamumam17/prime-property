import "server-only";
import type {
  Property,
  PropertyFilters,
  PaginatedProperties,
  FacingDirection,
  PropertyType,
  PropertyStatus,
  PropertyReadiness,
} from "@/lib/types";
import { createServiceClient } from "@/lib/supabase";

interface DbProperty {
  id: string;
  nama_property: string;
  group_name: string;
  lebar: number;
  panjang: number;
  hadap: string[];
  tipe: string;
  tingkat: number;
  price: number;
  carport: boolean;
  status: string;
  siap: string;
  maps_link: string | null;
  kawasan: string[];
  unit: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

type DbPropertyUpdate = Record<string, string | number | boolean | string[] | null>;

export async function getProperties(
  filters: PropertyFilters = {}
): Promise<PaginatedProperties> {
  const client = createServiceClient();
  const {
    search,
    area,
    minWidth,
    facing,
    maxPrice,
    type,
    status,
    readiness,
    carport,
    page = 1,
    perPage = 50,
    sortBy = "name",
  } = filters;

  let query = client
    .from("properties")
    .select("*", { count: "exact" })
    .is("deleted_at", null);

  // Apply filters
  if (search) {
    const searchPattern = `%${search}%`;
    query = query.or(
      `nama_property.ilike.${searchPattern},group_name.ilike.${searchPattern}`
    );
  }

  if (area && area.length > 0) {
    query = query.contains("kawasan", area);
  }

  if (minWidth) {
    query = query.gte("lebar", minWidth);
  }

  if (facing && facing.length > 0) {
    for (const face of facing) {
      query = query.contains("hadap", [face]);
    }
  }

  if (maxPrice) {
    query = query.lte("price", maxPrice);
  }

  if (type && type !== "all") {
    query = query.eq("tipe", type);
  }

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  if (readiness && readiness.length > 0) {
    for (const r of readiness) {
      query = query.eq("siap", r);
    }
  }

  if (carport && carport !== "all") {
    query = query.eq("carport", carport);
  }

  // Apply sorting
  const sortOptions: Record<string, { column: string; ascending: boolean }> = {
    name: { column: "nama_property", ascending: true },
    price_asc: { column: "price", ascending: true },
    price_desc: { column: "price", ascending: false },
    created_at: { column: "created_at", ascending: false },
    status: { column: "status", ascending: true },
  };

  const sort = sortOptions[sortBy] || sortOptions.name;
  query = query.order(sort.column, { ascending: sort.ascending });

  // Apply pagination
  const offset = (page - 1) * perPage;
  query = query.range(offset, offset + perPage - 1);

  const { data, count, error } = await query;

  if (error) {
    console.error("Failed to fetch properties:", error);
    return {
      items: [],
      total: 0,
      page,
      perPage,
      totalPages: 0,
    };
  }

  const properties = data?.map(mapDbPropertyToProperty) || [];
  const total = count || 0;
  const totalPages = Math.ceil(total / perPage);

  return {
    items: properties,
    total,
    page,
    perPage,
    totalPages,
  };
}

export async function getPropertyById(id: string): Promise<Property | null> {
  const client = createServiceClient();
  const { data, error } = await client
    .from("properties")
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .single();

  if (error) {
    console.error("Failed to fetch property:", error);
    return null;
  }

  return data ? mapDbPropertyToProperty(data) : null;
}

export async function createProperty(
  data: Omit<Property, "id" | "createdAt" | "updatedAt" | "deletedAt" | "createdBy">,
  createdBy: string
): Promise<Property> {
  const client = createServiceClient();
  const dbData = mapPropertyToDbProperty(data, createdBy);

  const { data: created, error } = await client
    .from("properties")
    .insert([dbData])
    .select()
    .single();

  if (error) {
    console.error("Failed to create property:", error);
    throw new Error(`Failed to create property: ${error.message}`);
  }

  return mapDbPropertyToProperty(created);
}

export async function updateProperty(
  id: string,
  data: Partial<Omit<Property, "id" | "createdAt" | "updatedAt" | "createdBy" | "deletedAt">>
): Promise<Property> {
  const client = createServiceClient();
  const dbData = mapPropertyToDbPropertyPartial(data);

  const { data: updated, error } = await client
    .from("properties")
    .update({ ...dbData, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Failed to update property:", error);
    throw new Error(`Failed to update property: ${error.message}`);
  }

  return mapDbPropertyToProperty(updated);
}

export async function softDeleteProperty(id: string): Promise<void> {
  const client = createServiceClient();
  const { error } = await client
    .from("properties")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    console.error("Failed to delete property:", error);
    throw new Error(`Failed to delete property: ${error.message}`);
  }
}

function mapPropertyToDbProperty(
  property: Omit<Property, "id" | "createdAt" | "updatedAt" | "deletedAt" | "createdBy">,
  createdBy: string
): Omit<DbProperty, "id" | "deleted_at"> {
  return {
    nama_property: property.name,
    group_name: property.group ?? "",
    lebar: property.width,
    panjang: property.length,
    hadap: property.facing,
    tipe: property.type,
    tingkat: property.floors,
    price: property.price,
    carport: property.carport,
    status: property.status,
    siap: property.readiness,
    maps_link: property.mapsUrl,
    kawasan: property.area,
    unit: property.unit ?? "",
    created_by: createdBy,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

function mapPropertyToDbPropertyPartial(
  property: Partial<Omit<Property, "id" | "createdAt" | "updatedAt" | "createdBy" | "deletedAt">>
): DbPropertyUpdate {
  const result: DbPropertyUpdate = {};

  if (property.name !== undefined) result.nama_property = property.name;
  if (property.group !== undefined) result.group_name = property.group;
  if (property.width !== undefined) result.lebar = property.width;
  if (property.length !== undefined) result.panjang = property.length;
  if (property.facing !== undefined) result.hadap = property.facing;
  if (property.type !== undefined) result.tipe = property.type;
  if (property.floors !== undefined) result.tingkat = property.floors;
  if (property.price !== undefined) result.price = property.price;
  if (property.carport !== undefined) result.carport = property.carport;
  if (property.status !== undefined) result.status = property.status;
  if (property.readiness !== undefined) result.siap = property.readiness;
  if (property.mapsUrl !== undefined) result.maps_link = property.mapsUrl;
  if (property.area !== undefined) result.kawasan = property.area;
  if (property.unit !== undefined) result.unit = property.unit;

  return result;
}

function mapDbPropertyToProperty(dbProperty: DbProperty): Property {
  return {
    id: dbProperty.id,
    name: dbProperty.nama_property,
    group: dbProperty.group_name,
    width: dbProperty.lebar,
    length: dbProperty.panjang,
    facing: dbProperty.hadap as FacingDirection[],
    type: dbProperty.tipe as PropertyType,
    floors: dbProperty.tingkat,
    price: dbProperty.price,
    carport: dbProperty.carport,
    status: dbProperty.status as PropertyStatus,
    readiness: dbProperty.siap as PropertyReadiness,
    mapsUrl: dbProperty.maps_link,
    area: dbProperty.kawasan,
    unit: dbProperty.unit || null,
    createdAt: dbProperty.created_at,
    updatedAt: dbProperty.updated_at,
    createdBy: dbProperty.created_by,
    deletedAt: dbProperty.deleted_at,
  };
}
