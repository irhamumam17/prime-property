"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
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

  const debounceTimer = useMemo(() => ({ id: 0 }), []);

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
    clearTimeout(debounceTimer.id);
    debounceTimer.id = window.setTimeout(() => {
      setSearch(e.target.value);
    }, 300) as unknown as number;
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

  const handleReset = () => {
    router.push("?");
    setSearch("");
    setMinWidth("");
    setMaxPrice("");
  };

  const selectedAreas = searchParams.get("area")?.split(",") || [];
  const selectedFacing = searchParams.get("facing")?.split(",") || [];
  const selectedReadiness = searchParams.get("readiness")?.split(",") || [];
  const selectedType = searchParams.get("type") || "all";
  const selectedStatus = searchParams.get("status") || "all";
  const selectedCarport = searchParams.get("carport") || "all";

  const areaOptions = areas.map((area) => ({
    value: area,
    label: area,
  }));

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-300 mb-6">
      <h3 className="text-lg font-semibold text-primary mb-4">Filter Properti</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {/* Search */}
        <Input
          type="text"
          placeholder="Cari nama/grup properti..."
          value={search}
          onChange={handleSearchChange}
        />

        {/* Kawasan (Multi-select) */}
        <div className="w-full">
          <label className="block text-sm font-medium text-primary mb-2">
            Kawasan
          </label>
          <select
            multiple
            value={selectedAreas}
            onChange={(e) =>
              handleMultiSelect(
                "area",
                Array.from(e.target.selectedOptions, (opt) => opt.value)
              )
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent outline-none h-12"
          >
            {areaOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Min Width */}
        <Input
          type="number"
          placeholder="Lebar min (m²)"
          value={minWidth}
          onChange={(e) => setMinWidth(e.target.value)}
          onBlur={updateFilters}
        />

        {/* Hadap (Multi-select) */}
        <div className="w-full">
          <label className="block text-sm font-medium text-primary mb-2">
            Hadap
          </label>
          <select
            multiple
            value={selectedFacing}
            onChange={(e) =>
              handleMultiSelect(
                "facing",
                Array.from(e.target.selectedOptions, (opt) => opt.value)
              )
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent outline-none h-12"
          >
            {FACING_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Max Price */}
        <Input
          type="number"
          placeholder="Harga max (Rp)"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          onBlur={updateFilters}
        />

        {/* Type (Radio) */}
        <div className="w-full">
          <label className="block text-sm font-medium text-primary mb-2">
            Tipe
          </label>
          <select
            value={selectedType}
            onChange={(e) => {
              const params = new URLSearchParams(searchParams);
              if (e.target.value !== "all") {
                params.set("type", e.target.value);
              } else {
                params.delete("type");
              }
              router.push(`?${params.toString()}`);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent outline-none"
          >
            <option value="all">Semua</option>
            {TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status (Radio) */}
        <div className="w-full">
          <label className="block text-sm font-medium text-primary mb-2">
            Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => {
              const params = new URLSearchParams(searchParams);
              if (e.target.value !== "all") {
                params.set("status", e.target.value);
              } else {
                params.delete("status");
              }
              router.push(`?${params.toString()}`);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent outline-none"
          >
            <option value="all">Semua</option>
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Siap (Multi-select) */}
        <div className="w-full">
          <label className="block text-sm font-medium text-primary mb-2">
            Siap
          </label>
          <select
            multiple
            value={selectedReadiness}
            onChange={(e) =>
              handleMultiSelect(
                "readiness",
                Array.from(e.target.selectedOptions, (opt) => opt.value)
              )
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent outline-none h-12"
          >
            {READINESS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Carport (Toggle) */}
        <div className="w-full flex items-end">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedCarport === "true"}
              onChange={(e) => {
                const params = new URLSearchParams(searchParams);
                if (e.target.checked) {
                  params.set("carport", "true");
                } else {
                  params.delete("carport");
                }
                router.push(`?${params.toString()}`);
              }}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium text-primary">Ada Carport</span>
          </label>
        </div>
      </div>

      {/* Reset Button */}
      <div className="flex gap-2">
        <Button onClick={handleReset} variant="ghost">
          Reset Filter
        </Button>
      </div>
    </div>
  );
}
