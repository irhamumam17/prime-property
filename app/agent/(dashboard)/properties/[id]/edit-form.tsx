"use client";

import { useActionState } from "react";
import Link from "next/link";
import { updateProperty } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { ActionResult, Property } from "@/lib/types";

const FACING_OPTIONS = [
  { value: "Utara", label: "Utara" },
  { value: "Selatan", label: "Selatan" },
  { value: "Timur", label: "Timur" },
  { value: "Barat", label: "Barat" },
];

const AREA_OPTIONS = [
  { value: "A", label: "Area A" },
  { value: "B", label: "Area B" },
  { value: "C", label: "Area C" },
  { value: "D", label: "Area D" },
];

const TYPE_OPTIONS = [
  { value: "Ruko", label: "Ruko" },
  { value: "Villa", label: "Villa" },
];

const STATUS_OPTIONS = [
  { value: "in_stock", label: "In Stock" },
  { value: "sold_out", label: "Sold Out" },
];

const READINESS_OPTIONS = [
  { value: "siap_huni", label: "Siap Huni" },
  { value: "siap_kosong", label: "Siap Kosong" },
  { value: "siap_huni_renovasi", label: "Siap Huni Renovasi" },
];

export function EditPropertyForm({
  id,
  property,
}: {
  id: string;
  property: Property;
}) {
  

  const handleSubmit = (_prevState: ActionResult<Property>, formData: FormData) =>
    updateProperty(id, formData);

  const [state, formAction, isPending] = useActionState(handleSubmit, {
    success: false,
    error: "",
  });

  return (
    <div>
      <Link
        href={`/agent/properties/${id}`}
        className="text-gold hover:underline mb-6 inline-block"
      >
        ← Kembali ke Detail
      </Link>

      <div className="bg-white rounded-lg border border-gray-300 p-8 max-w-4xl">
        <h1 className="text-3xl font-bold text-primary mb-8">Edit Properti</h1>

        {state.success === false && state.error && (
          <div className="mb-6 p-4 bg-accent-red/10 border border-accent-red rounded-lg">
            <p className="text-accent-red font-medium">{state.error}</p>
          </div>
        )}

        <form action={formAction} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Input
              label="Nama Properti"
              name="name"
              type="text"
              placeholder="Nama properti"
              defaultValue={property.name}
              required
              error={state.fieldErrors?.name?.[0]}
              disabled={isPending}
            />
            <Input
              label="Grup (opsional)"
              name="group"
              type="text"
              placeholder="Nama grup"
              defaultValue={property.group || ""}
              error={state.fieldErrors?.group?.[0]}
              disabled={isPending}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Input
              label="Lebar (m)"
              name="width"
              type="number"
              step="0.01"
              placeholder="0.00"
              defaultValue={property.width}
              required
              error={state.fieldErrors?.width?.[0]}
              disabled={isPending}
            />
            <Input
              label="Panjang (m)"
              name="length"
              type="number"
              step="0.01"
              placeholder="0.00"
              defaultValue={property.length}
              required
              error={state.fieldErrors?.length?.[0]}
              disabled={isPending}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Select
              label="Hadapan (pilih minimal 1)"
              name="facing"
              multiple
              options={FACING_OPTIONS}
              defaultValue={property.facing}
              required
              error={state.fieldErrors?.facing?.[0]}
              disabled={isPending}
            />
            <fieldset className="border border-gray-300 rounded-lg p-4">
              <legend className="text-sm font-medium text-primary mb-3">
                Tipe
              </legend>
              <div className="space-y-2">
                {TYPE_OPTIONS.map((opt) => (
                  <label key={opt.value} className="flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value={opt.value}
                      defaultChecked={property.type === opt.value}
                      required
                      disabled={isPending}
                      className="mr-2 w-4 h-4 accent-gold"
                    />
                    <span className="text-sm text-primary">{opt.label}</span>
                  </label>
                ))}
              </div>
              {state.fieldErrors?.type?.[0] && (
                <p className="text-accent-red text-sm mt-2">
                  {state.fieldErrors.type[0]}
                </p>
              )}
            </fieldset>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Input
              label="Tingkat"
              name="floors"
              type="number"
              step="0.1"
              placeholder="1"
              defaultValue={property.floors}
              required
              error={state.fieldErrors?.floors?.[0]}
              disabled={isPending}
            />
            <Input
              label="Harga (Rp)"
              name="price"
              type="number"
              placeholder="0"
              defaultValue={property.price}
              required
              error={state.fieldErrors?.price?.[0]}
              disabled={isPending}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <label className="flex items-center border border-gray-300 rounded-lg p-4">
              <input
                type="checkbox"
                name="carport"
                defaultChecked={property.carport}
                disabled={isPending}
                className="w-4 h-4 accent-gold"
              />
              <span className="ml-2 text-sm text-primary font-medium">
                Ada Carport
              </span>
            </label>

            <Select
              label="Status"
              name="status"
              options={STATUS_OPTIONS}
              defaultValue={property.status}
              required
              error={state.fieldErrors?.status?.[0]}
              disabled={isPending}
            />

            <Select
              label="Siap"
              name="readiness"
              options={READINESS_OPTIONS}
              defaultValue={property.readiness}
              required
              error={state.fieldErrors?.readiness?.[0]}
              disabled={isPending}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Select
              label="Kawasan (pilih minimal 1)"
              name="area"
              multiple
              options={AREA_OPTIONS}
              defaultValue={property.area}
              required
              error={state.fieldErrors?.area?.[0]}
              disabled={isPending}
            />
            <Input
              label="Unit"
              name="unit"
              type="text"
              placeholder="Nomor unit"
              defaultValue={property.unit || ""}
              required
              error={state.fieldErrors?.unit?.[0]}
              disabled={isPending}
            />
          </div>

          <Input
            label="Maps Link"
            name="mapsUrl"
            type="url"
            placeholder="https://maps.google.com/..."
            defaultValue={property.mapsUrl || ""}
            required
            error={state.fieldErrors?.mapsUrl?.[0]}
            disabled={isPending}
          />

          <div className="flex gap-2 pt-4">
            <Button variant="ghost" onClick={() => window.history.back()}>
              Batal
            </Button>
            <Button variant="gold-filled" type="submit" disabled={isPending}>
              {isPending ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
