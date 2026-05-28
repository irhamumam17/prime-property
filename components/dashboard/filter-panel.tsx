"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FilterPanelProps {
  areas: string[];
}

const FACING_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "Utara", label: "Utara" },
  { value: "Selatan", label: "Selatan" },
  { value: "Timur", label: "Timur" },
  { value: "Barat", label: "Barat" },
];

const TYPE_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "Ruko", label: "Ruko" },
  { value: "Villa", label: "Villa" },
];

const STATUS_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "in_stock", label: "In Stock" },
  { value: "sold_out", label: "Sold Out" },
];

const READINESS_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "siap_huni", label: "Siap Huni" },
  { value: "siap_kosong", label: "Siap Kosong" },
  { value: "siap_huni_renovasi", label: "Siap Huni Renovasi" },
];

export function FilterPanel({ areas }: FilterPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [minWidth, setMinWidth] = useState(
    searchParams.get("minWidth") || ""
  );
  const [maxPrice, setMaxPrice] = useState(
    searchParams.get("maxPrice") || ""
  );

  const debounceTimer = useRef<number | null>(null);

  const updateFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams);

    if (search) params.set("search", search);
    else params.delete("search");

    if (minWidth) params.set("minWidth", minWidth);
    else params.delete("minWidth");

    if (maxPrice) params.set("maxPrice", maxPrice);
    else params.delete("maxPrice");

    router.push(`?${params.toString()}`);
  }, [search, minWidth, maxPrice, searchParams, router]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = window.setTimeout(() => {
      setSearch(e.target.value);
    }, 300);
  };

  const handleMultiSelect = (key: string, values: string[]) => {
    const params = new URLSearchParams(searchParams);
    if (values.length > 0) {
      params.set(key, values.join(","));
    } else {
      params.delete(key);
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-300 p-6 mb-6">
      <h3 className="text-lg font-semibold text-primary mb-4">Filter Properti</h3>

      <div className="space-y-4">
        <Input
          label="Cari"
          placeholder="Nama, group, atau kawasan..."
          value={search}
          onChange={handleSearchChange}
          className="w-full"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            label="Lebar Min (m)"
            placeholder="Min"
            value={minWidth}
            onChange={(e) => setMinWidth(e.target.value)}
          />
          <Input
            label="Harga Max (Rp)"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />

          <select
            aria-label="Filter Hadapan"
            multiple
            onChange={(e) =>
              handleMultiSelect(
                "facing",
                Array.from(e.target.selectedOptions, (o) => o.value)
              )
            }
            defaultValue={
              searchParams.get("facing")?.split(",") || []
            }
            className="border border-gray-300 rounded-lg p-2 text-sm"
          >
            {FACING_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter Tipe"
            onChange={(e) =>
              e.target.value !== "all" && handleMultiSelect("type", [e.target.value])
            }
            defaultValue={searchParams.get("type") || "all"}
            className="border border-gray-300 rounded-lg p-2 text-sm"
          >
            <option value="all">Semua Tipe</option>
            {TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <select
            aria-label="Filter Status"
            onChange={(e) =>
              e.target.value !== "all" && handleMultiSelect("status", [e.target.value])
            }
            defaultValue={searchParams.get("status") || "all"}
            className="border border-gray-300 rounded-lg p-2 text-sm"
          >
            <option value="all">Semua Status</option>
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter Siap"
            multiple
            onChange={(e) =>
              handleMultiSelect(
                "readiness",
                Array.from(e.target.selectedOptions, (o) => o.value)
              )
            }
            defaultValue={
              searchParams.get("readiness")?.split(",") || []
            }
            className="border border-gray-300 rounded-lg p-2 text-sm"
          >
            {READINESS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <label className="flex items-center border border-gray-300 rounded-lg p-2">
            <input
              type="checkbox"
              onChange={(e) =>
                handleMultiSelect("carport", e.target.checked ? ["true"] : [])
              }
              defaultChecked={searchParams.get("carport") === "true"}
              className="w-4 h-4 accent-gold"
            />
            <span className="ml-2 text-sm text-primary font-medium">
              Ada Carport
            </span>
          </label>
        </div>

        <div className="flex gap-2 mt-4">
          <Button
            onClick={() => router.push("?")}
            variant="ghost"
            className="text-sm"
          >
            Reset Filter
          </Button>
          <Button
            onClick={updateFilters}
            variant="gold-filled"
            className="text-sm"
          >
            Terapkan Filter
          </Button>
        </div>
      </div>
    </div>
  );
}
