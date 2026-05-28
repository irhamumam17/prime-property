import Link from "next/link";
import { notFound } from "next/navigation";
import { verifySuperadmin } from "@/lib/dal";
import { getPropertyById } from "@/lib/db/properties";
import { formatPrice } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { DeletePropertyButton } from "./delete-button";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { id } = await params;
  const property = await getPropertyById(id);

  if (!property) {
    notFound();
  }

  let isSuperadmin = false;
  try {
    const session = await verifySuperadmin();
    isSuperadmin = true;
  } catch {
    isSuperadmin = false;
  }

  return (
    <div>
      <Link
        href="/agent/properties"
        className="text-gold hover:underline mb-6 inline-block"
      >
        ← Kembali ke Daftar
      </Link>

      <div className="bg-white rounded-lg border border-gray-300 p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Column 1 */}
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">
              {property.name}
            </h1>
            <p className="text-gray-600 mb-6">{property.group}</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-primary mb-1">
                  Status
                </label>
                <Badge
                  variant={
                    property.status === "in_stock" ? "in-stock" : "sold-out"
                  }
                  label={property.status === "in_stock" ? "In Stock" : "Sold Out"}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-1">
                  Siap
                </label>
                <Badge
                  variant={
                    property.readiness === "siap_huni"
                      ? "siap-huni"
                      : property.readiness === "siap_kosong"
                        ? "siap-kosong"
                        : "siap-huni-renovasi"
                  }
                  label={property.readiness.replace(/_/g, " ")}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-1">
                  Harga
                </label>
                <p className="text-2xl font-bold text-gold">
                  {formatPrice(property.price)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-1">
                  Tipe
                </label>
                <p className="text-gray-700">{property.type}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-1">
                  Ukuran
                </label>
                <p className="text-gray-700">
                  {property.width} × {property.length} m²
                </p>
              </div>
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-primary mb-1">
                Hadap
              </label>
              <p className="text-gray-700">{property.facing.join(", ")}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-primary mb-1">
                Tingkat
              </label>
              <p className="text-gray-700">{property.floors}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-primary mb-1">
                Carport
              </label>
              <p className="text-gray-700">{property.carport ? "Ya" : "Tidak"}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-primary mb-1">
                Kawasan
              </label>
              <p className="text-gray-700">{property.area.join(", ")}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-primary mb-1">
                Unit
              </label>
              <p className="text-gray-700">{property.unit || "—"}</p>
            </div>

            {property.mapsUrl && (
              <div>
                <a
                  href={property.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 bg-gold text-primary rounded-lg hover:bg-yellow-600 transition font-semibold"
                >
                  Buka di Google Maps
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Superadmin Actions */}
        {isSuperadmin && (
          <div className="flex gap-4 pt-8 border-t border-gray-300">
            <Link
              href={`/agent/properties/${id}/edit`}
              className="px-4 py-2 bg-gold text-primary rounded-lg hover:bg-yellow-600 transition font-semibold"
            >
              Edit
            </Link>
            <DeletePropertyButton propertyId={id} propertyName={property.name} />
          </div>
        )}
      </div>
    </div>
  );
}
