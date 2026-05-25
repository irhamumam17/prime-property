import "server-only";
import type { Property, PropertyFilters, PaginatedProperties } from "@/lib/types";
import { createServiceClient } from "@/lib/supabase";

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

function mapDbPropertyToProperty(dbProperty: any): Property {
  return {
    id: dbProperty.id,
    name: dbProperty.nama_property,
    group: dbProperty.group_name,
    width: dbProperty.lebar,
    length: dbProperty.panjang,
    facing: dbProperty.hadap,
    type: dbProperty.tipe,
    floors: dbProperty.tingkat,
    price: dbProperty.price,
    carport: dbProperty.carport,
    status: dbProperty.status,
    readiness: dbProperty.siap,
    mapsUrl: dbProperty.maps_link,
    area: dbProperty.kawasan,
    unit: dbProperty.unit,
    createdAt: dbProperty.created_at,
    updatedAt: dbProperty.updated_at,
    createdBy: dbProperty.created_by,
    deletedAt: dbProperty.deleted_at,
  };
}
