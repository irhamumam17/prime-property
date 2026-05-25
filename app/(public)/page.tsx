import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { getProperties } from "@/lib/db/properties";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";

export const metadata = {
  title: "Prime Property — Properti Premium Pilihan",
  description: "Temukan properti premium di kawasan strategis terbaik",
};

export default async function LandingPage() {
  const properties = await getProperties({
    status: "in_stock",
    perPage: 6,
    page: 1,
  });

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-primary text-white py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Prime Property
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Properti premium pilihan di kawasan strategis untuk investasi dan hunian impian Anda.
          </p>
          <Button
            variant="gold-filled"
            className="text-lg px-8 py-4"
            onClick={() => {
              window.location.href = "/contact";
            }}
          >
            Hubungi Kami
          </Button>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-12 text-center">
            Properti Unggulan
          </h2>

          {properties.items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.items.map((property) => (
                <div
                  key={property.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white"
                >
                  <div className="bg-soft-gray p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-primary mb-1">
                          {property.name}
                        </h3>
                        {property.group && (
                          <p className="text-sm text-gray-600">
                            {property.group}
                          </p>
                        )}
                      </div>
                      <StatusBadge
                        status={property.status}
                        readiness={property.readiness}
                      />
                    </div>

                    <div className="space-y-2 text-sm text-gray-700 mb-4">
                      <p>
                        <span className="font-medium">Ukuran:</span>{" "}
                        {property.width} × {property.length} m²
                      </p>
                      <p>
                        <span className="font-medium">Tipe:</span> {property.type}
                      </p>
                      <p>
                        <span className="font-medium">Harga:</span>{" "}
                        <span className="text-gold font-bold">
                          {formatPrice(property.price)}
                        </span>
                      </p>
                      {property.area.length > 0 && (
                        <p>
                          <span className="font-medium">Kawasan:</span>{" "}
                          {property.area.join(", ")}
                        </p>
                      )}
                    </div>

                    {property.mapsUrl && (
                      <a
                        href={property.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gold hover:text-gold-dark text-sm font-medium inline-block"
                      >
                        Buka di Google Maps →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-soft-gray rounded-lg">
              <p className="text-gray-600">Tidak ada properti tersedia saat ini.</p>
            </div>
          )}
        </div>
      </section>

      {/* Why Prime Property Section */}
      <section className="py-16 md:py-24 bg-soft-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-12 text-center">
            Mengapa Prime Property?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Lokasi Strategis",
                description: "Properti kami berlokasi di kawasan-kawasan terbaik dengan akses mudah.",
              },
              {
                title: "Harga Kompetitif",
                description: "Kami menawarkan harga terbaik dengan kualitas premium.",
              },
              {
                title: "Transparansi Penuh",
                description: "Tidak ada biaya tersembunyi. Semua informasi diberikan dengan jelas.",
              },
              {
                title: "Dukungan Profesional",
                description: "Tim profesional kami siap membantu Anda menemukan properti ideal.",
              },
            ].map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-bold text-primary mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-700">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
