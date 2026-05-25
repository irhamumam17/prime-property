import { Suspense } from "react";
import Link from "next/link";
import { verifySession } from "@/lib/dal";
import { getProperties } from "@/lib/db/properties";
import { formatPrice } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/dashboard/pagination";
import { FilterPanel } from "@/components/dashboard/filter-panel";
import type { PropertyFilters } from "@/lib/types";

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

async function PropertyTable({ filters }: { filters: PropertyFilters }) {
  const result = await getProperties(filters);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-300">
              <th className="px-4 py-3 text-left text-sm font-semibold text-primary">
                Nama
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-primary">
                Grup
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-primary">
                Ukuran
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-primary">
                Hadap
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-primary">
                Tipe
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-primary">
                Tingkat
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-primary">
                Harga
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-primary">
                Carport
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-primary">
                Status
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-primary">
                Siap
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-primary">
                Kawasan
              </th>
            </tr>
          </thead>
          <tbody>
            {result.items.map((prop) => (
              <tr
                key={prop.id}
                className="border-b border-gray-300 hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/agent/properties/${prop.id}`}
                    className="text-primary hover:underline font-medium"
                  >
                    {prop.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-sm">{prop.group || "—"}</td>
                <td className="px-4 py-3 text-sm">
                  {prop.width} × {prop.length} m²
                </td>
                <td className="px-4 py-3 text-sm">
                  {prop.facing.join(", ")}
                </td>
                <td className="px-4 py-3 text-sm">{prop.type}</td>
                <td className="px-4 py-3 text-sm">{prop.floors}</td>
                <td className="px-4 py-3 text-sm font-semibold">
                  {formatPrice(prop.price)}
                </td>
                <td className="px-4 py-3 text-sm">
                  {prop.carport ? "Ya" : "Tidak"}
                </td>
                <td className="px-4 py-3">
                  <Badge
                    variant={prop.status === "in_stock" ? "in-stock" : "sold-out"}
                    label={prop.status === "in_stock" ? "In Stock" : "Sold Out"}
                  />
                </td>
                <td className="px-4 py-3">
                  <Badge
                    variant={
                      prop.readiness === "siap_huni"
                        ? "siap-huni"
                        : prop.readiness === "siap_kosong"
                          ? "siap-kosong"
                          : "siap-huni-renovasi"
                    }
                    label={prop.readiness.replace(/_/g, " ")}
                  />
                </td>
                <td className="px-4 py-3 text-sm">{prop.area.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {result.totalPages > 1 && (
        <Pagination
          currentPage={result.page}
          totalPages={result.totalPages}
          baseUrl="/agent/properties"
        />
      )}

      <div className="mt-4 text-sm text-gray-600">
        Menampilkan {result.items.length} dari {result.total} properti
      </div>
    </>
  );
}

export default async function PropertiesPage({ searchParams }: PageProps) {
  await verifySession();
  const params = await searchParams;

  const filters: PropertyFilters = {
    search: params.search ? String(params.search) : undefined,
    area: params.area ? String(params.area).split(",") : undefined,
    minWidth: params.minWidth ? Number(params.minWidth) : undefined,
    facing: params.facing ? String(params.facing).split(",") as any[] : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    type: (params.type ? String(params.type) : "all") as any,
    status: (params.status ? String(params.status) : "all") as any,
    readiness: params.readiness ? String(params.readiness).split(",") as any[] : undefined,
    carport: params.carport === "true" ? true : "all" as any,
    page: params.page ? Number(params.page) : 1,
    perPage: params.perPage ? Number(params.perPage) : 50,
    sortBy: (params.sortBy || "name") as any,
  };

  const allPropertiesForAreas = await getProperties({ perPage: 1000 });
  const uniqueAreas = Array.from(
    new Set(allPropertiesForAreas.items.flatMap((p) => p.area))
  ).sort();

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-6">Daftar Properti</h1>

      <FilterPanel areas={uniqueAreas} />

      <Suspense fallback={<div className="text-center py-8">Memuat...</div>}>
        <PropertyTable filters={filters} />
      </Suspense>
    </div>
  );
}
