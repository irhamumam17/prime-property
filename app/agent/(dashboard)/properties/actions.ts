"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { verifySuperadmin } from "@/lib/dal";
import {
  createProperty as dbCreateProperty,
  updateProperty as dbUpdateProperty,
  softDeleteProperty as dbSoftDeleteProperty,
  getPropertyById,
} from "@/lib/db/properties";
import { recordAudit } from "@/lib/db/audit";
import type { ActionResult, Property, FacingDirection } from "@/lib/types";

const propertySchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter").max(100),
  group: z.string().nullable().default(null),
  width: z.number().positive("Lebar harus > 0").multipleOf(0.01),
  length: z.number().positive("Panjang harus > 0").multipleOf(0.01),
  facing: z
    .array(z.enum(["Utara", "Selatan", "Timur", "Barat"] as const))
    .min(1, "Pilih minimal 1 hadapan"),
  type: z.enum(["Ruko", "Villa"] as const),
  floors: z.number().min(1, "Minimal 1 lantai").max(10).multipleOf(0.1),
  price: z.number().int("Harga harus angka bulat").positive("Harga harus > 0"),
  carport: z.boolean().default(false),
  status: z.enum(["in_stock", "sold_out"] as const),
  readiness: z.enum(["siap_huni", "siap_kosong", "siap_huni_renovasi"] as const),
  area: z.array(z.string()).min(1, "Pilih minimal 1 kawasan"),
  unit: z.string().nullable().default(null),
  mapsUrl: z
    .string()
    .nullable()
    .default(null)
    .refine(
      (val) => !val || val.includes("google.com/maps"),
      "Maps link harus dari google.com/maps"
    ),
});

type PropertyFormData = z.infer<typeof propertySchema>;

export async function createProperty(
  formData: FormData
): Promise<ActionResult<Property>> {
  try {
    const session = await verifySuperadmin();

    const parsed = Object.fromEntries(formData);
    const facing = (parsed.facing as string)?.split(",").filter(Boolean) as FacingDirection[];
    const area = (parsed.area as string)?.split(",").filter(Boolean) || [];

    const data: PropertyFormData = {
      name: parsed.name as string,
      group: (parsed.group as string) || null,
      width: parseFloat(parsed.width as string),
      length: parseFloat(parsed.length as string),
      facing,
      type: parsed.type as "Ruko" | "Villa",
      floors: parseFloat(parsed.floors as string),
      price: parseInt(parsed.price as string),
      carport: (parsed.carport as string) === "on",
      status: parsed.status as "in_stock" | "sold_out",
      readiness: parsed.readiness as "siap_huni" | "siap_kosong" | "siap_huni_renovasi",
      area,
      unit: (parsed.unit as string) || null,
      mapsUrl: (parsed.mapsUrl as string) || null,
    };

    const validation = propertySchema.safeParse(data);
    if (!validation.success) {
      const fieldErrors: Record<string, string[]> = {};
      validation.error.issues.forEach((err) => {
        const path = err.path.join(".");
        if (!fieldErrors[path]) fieldErrors[path] = [];
        fieldErrors[path].push(err.message);
      });
      return { success: false, error: "Validasi gagal", fieldErrors };
    }

    const created = await dbCreateProperty(validation.data, session.userId);

    await recordAudit({
      userId: session.userId,
      entityType: "property",
      entityId: created.id,
      action: "create",
      changes: validation.data,
    });

    redirect(`/agent/properties?highlight=${created.id}`);
  } catch (err) {
    if (err instanceof Error) {
      if (err.message.includes("Unauthorized")) {
        return { success: false, error: "Anda tidak memiliki akses" };
      }
      return { success: false, error: err.message };
    }
    return { success: false, error: "Terjadi kesalahan" };
  }
}

export async function updateProperty(
  id: string,
  formData: FormData
): Promise<ActionResult<Property>> {
  try {
    const session = await verifySuperadmin();

    const oldProperty = await getPropertyById(id);
    if (!oldProperty) {
      return { success: false, error: "Properti tidak ditemukan" };
    }

    const parsed = Object.fromEntries(formData);
    const facing = (parsed.facing as string)?.split(",").filter(Boolean) as FacingDirection[];
    const area = (parsed.area as string)?.split(",").filter(Boolean) || [];

    const data: PropertyFormData = {
      name: parsed.name as string,
      group: (parsed.group as string) || null,
      width: parseFloat(parsed.width as string),
      length: parseFloat(parsed.length as string),
      facing,
      type: parsed.type as "Ruko" | "Villa",
      floors: parseFloat(parsed.floors as string),
      price: parseInt(parsed.price as string),
      carport: (parsed.carport as string) === "on",
      status: parsed.status as "in_stock" | "sold_out",
      readiness: parsed.readiness as "siap_huni" | "siap_kosong" | "siap_huni_renovasi",
      area,
      unit: (parsed.unit as string) || null,
      mapsUrl: (parsed.mapsUrl as string) || null,
    };

    const validation = propertySchema.safeParse(data);
    if (!validation.success) {
      const fieldErrors: Record<string, string[]> = {};
      validation.error.issues.forEach((err) => {
        const path = err.path.join(".");
        if (!fieldErrors[path]) fieldErrors[path] = [];
        fieldErrors[path].push(err.message);
      });
      return { success: false, error: "Validasi gagal", fieldErrors };
    }

    const updated = await dbUpdateProperty(id, validation.data);

    const changes: Record<string, unknown> = {};
    Object.keys(validation.data).forEach((key) => {
      if (
        JSON.stringify(oldProperty[key as keyof Property]) !==
        JSON.stringify(validation.data[key as keyof PropertyFormData])
      ) {
        changes[key] = {
          old: oldProperty[key as keyof Property],
          new: validation.data[key as keyof PropertyFormData],
        };
      }
    });

    await recordAudit({
      userId: session.userId,
      entityType: "property",
      entityId: id,
      action: "update",
      changes,
    });

    redirect(`/agent/properties/${id}`);
  } catch (err) {
    if (err instanceof Error) {
      if (err.message.includes("Unauthorized")) {
        return { success: false, error: "Anda tidak memiliki akses" };
      }
      return { success: false, error: err.message };
    }
    return { success: false, error: "Terjadi kesalahan" };
  }
}

export async function deleteProperty(id: string): Promise<ActionResult> {
  try {
    const session = await verifySuperadmin();

    const property = await getPropertyById(id);
    if (!property) {
      return { success: false, error: "Properti tidak ditemukan" };
    }

    await dbSoftDeleteProperty(id);

    await recordAudit({
      userId: session.userId,
      entityType: "property",
      entityId: id,
      action: "delete",
      changes: { name: property.name },
    });

    redirect("/agent/properties");
  } catch (err) {
    if (err instanceof Error) {
      if (err.message.includes("Unauthorized")) {
        return { success: false, error: "Anda tidak memiliki akses" };
      }
      return { success: false, error: err.message };
    }
    return { success: false, error: "Terjadi kesalahan" };
  }
}
