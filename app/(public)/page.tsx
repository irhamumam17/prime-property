import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { getProperties } from "@/lib/db/properties";
import { StatusBadge } from "@/components/ui/badge";

export const metadata = {
  title: "Prime Property — Properti Premium Pilihan",
  description:
    "Temukan properti premium di kawasan strategis terbaik. Investasi cerdas, hunian impian Anda bersama Prime Property.",
};

const stats = [
  { value: "200+", label: "Properti Tersedia" },
  { value: "500+", label: "Klien Puas" },
  { value: "10+", label: "Tahun Pengalaman" },
  { value: "50+", label: "Kawasan Premium" },
];

const whyUs = [
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-7 h-7"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
        />
      </svg>
    ),
    title: "Lokasi Strategis",
    description:
      "Setiap properti kami dipilih secara cermat di kawasan premium dengan akses infrastruktur terbaik dan nilai investasi tertinggi.",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-7 h-7"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
        />
      </svg>
    ),
    title: "Transaksi Aman & Transparan",
    description:
      "Proses legal yang jelas, dokumen lengkap, dan tidak ada biaya tersembunyi. Kepercayaan Anda adalah prioritas utama kami.",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-7 h-7"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"
        />
      </svg>
    ),
    title: "Nilai Investasi Tinggi",
    description:
      "Properti kami berada di kawasan dengan pertumbuhan nilai aset yang konsisten — pilihan investasi jangka panjang yang menguntungkan.",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-7 h-7"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
        />
      </svg>
    ),
    title: "Konsultasi Personal",
    description:
      "Tim agen profesional kami mendampingi Anda dari pencarian hingga serah terima kunci — memastikan keputusan terbaik untuk Anda.",
  },
];

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

export default async function LandingPage() {
  const properties = await getProperties({
    status: "in_stock",
    perPage: 6,
    page: 1,
  });

  return (
    <div className="w-full">
      {/* ─── HERO ─── */}
      <section className="relative bg-primary text-white overflow-hidden">
        {/* Decorative blobs */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-0 w-96 h-96 rounded-full bg-gold opacity-5 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-gold opacity-5 translate-x-1/4 translate-y-1/4 pointer-events-none"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 lg:py-40">
          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 text-gold text-sm font-medium px-4 py-2 rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-gold" />
            Dipercaya lebih dari 500 klien sejak 2015
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6 max-w-3xl">
            Investasi Cerdas,{" "}
            <span className="text-gold">Hunian Impian</span> Anda
          </h1>

          <p className="text-lg sm:text-xl text-gray-300 mb-10 max-w-xl leading-relaxed">
            Properti premium di kawasan strategis terbaik — dari rumah tapak
            hingga kavling siap bangun, dengan legalitas terjamin dan harga
            transparan.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-gold text-primary font-semibold px-8 py-4 rounded-lg hover:bg-gold/90 transition-all text-base"
            >
              Konsultasi Gratis
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
            <a
              href="https://wa.me/6212345678"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-white/20 text-white font-semibold px-8 py-4 rounded-lg hover:bg-white/10 transition-all text-base"
            >
              <WhatsAppIcon />
              Chat WhatsApp
            </a>
          </div>
        </div>

        {/* Stats bar */}
        <div className="relative border-t border-white/10 bg-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <dl className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <dt className="text-2xl sm:text-3xl font-bold text-gold">
                    {stat.value}
                  </dt>
                  <dd className="text-sm text-gray-400 mt-1">{stat.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ─── FEATURED PROPERTIES ─── */}
      <section className="py-16 md:py-24 bg-soft-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-gold font-semibold text-sm uppercase tracking-wider">
              Properti Pilihan
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mt-2 mb-4">
              Temukan Properti Impian Anda
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Berikut sebagian dari koleksi properti premium kami yang tersedia
              saat ini. Hubungi kami untuk daftar lengkap.
            </p>
          </div>

          {properties.items.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.items.map((property) => (
                  <article
                    key={property.id}
                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                  >
                    {/* Card header */}
                    <div className="px-5 pt-5 pb-4 border-b border-gray-100 bg-primary/[.03]">
                      <div className="flex justify-between items-start gap-3">
                        <div className="min-w-0">
                          <h3 className="text-base font-bold text-primary truncate">
                            {property.name}
                          </h3>
                          {property.group && (
                            <p className="text-xs text-gray-500 mt-0.5">
                              {property.group}
                            </p>
                          )}
                        </div>
                        <StatusBadge
                          status={property.status}
                          readiness={property.readiness}
                        />
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="p-5">
                      <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm mb-4">
                        <div>
                          <dt className="text-gray-500 text-xs">Ukuran</dt>
                          <dd className="font-semibold text-primary">
                            {property.width} × {property.length} m²
                          </dd>
                        </div>
                        <div>
                          <dt className="text-gray-500 text-xs">Tipe</dt>
                          <dd className="font-semibold text-primary capitalize">
                            {property.type}
                          </dd>
                        </div>
                        {property.area.length > 0 && (
                          <div className="col-span-2">
                            <dt className="text-gray-500 text-xs">Kawasan</dt>
                            <dd className="font-medium text-primary">
                              {property.area.join(", ")}
                            </dd>
                          </div>
                        )}
                      </dl>

                      <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                        <div>
                          <span className="text-xs text-gray-500 block mb-0.5">
                            Harga
                          </span>
                          <span className="text-gold font-bold text-lg">
                            {formatPrice(property.price)}
                          </span>
                        </div>
                        {property.mapsUrl && (
                          <a
                            href={property.mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-gray-400 hover:text-gold transition-colors flex items-center gap-1"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-4 h-4"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                              />
                            </svg>
                            Lihat Peta
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div className="text-center mt-10">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 text-gold font-semibold hover:underline"
                >
                  Hubungi kami untuk daftar lengkap properti
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                    />
                  </svg>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
              <p className="text-gray-500">
                Tidak ada properti tersedia saat ini.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ─── WHY PRIME PROPERTY ─── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-gold font-semibold text-sm uppercase tracking-wider">
              Keunggulan Kami
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mt-2 mb-4">
              Mengapa Prime Property?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Lebih dari sekadar agen properti — kami adalah mitra investasi
              yang Anda butuhkan untuk keputusan terbaik.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyUs.map((item) => (
              <div
                key={item.title}
                className="group p-6 rounded-xl border border-gray-100 hover:border-gold/40 hover:shadow-md transition-all bg-white"
              >
                <div className="w-14 h-14 bg-gold/10 text-gold rounded-xl flex items-center justify-center mb-5 group-hover:bg-gold group-hover:text-primary transition-all">
                  {item.icon}
                </div>
                <h3 className="text-base font-bold text-primary mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-16 md:py-24 bg-soft-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-gold font-semibold text-sm uppercase tracking-wider">
              Proses Mudah
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mt-2 mb-4">
              Mulai dalam 3 Langkah
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Hubungi Kami",
                desc: "Ceritakan kebutuhan dan anggaran properti Anda melalui form kontak atau WhatsApp.",
              },
              {
                step: "02",
                title: "Konsultasi & Survei",
                desc: "Agen kami akan mencarikan pilihan terbaik dan mengatur jadwal kunjungan lokasi.",
              },
              {
                step: "03",
                title: "Wujudkan Impian",
                desc: "Kami dampingi proses negosiasi, dokumen, dan serah terima hingga tuntas.",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-5">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gold/10 border-2 border-gold text-gold font-bold text-sm flex items-center justify-center">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-bold text-primary mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="py-16 md:py-20 bg-primary">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Siap Menemukan Properti Ideal Anda?
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Konsultasikan kebutuhan properti Anda dengan tim agen kami. Gratis,
            tanpa komitmen apapun.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-gold text-primary font-semibold px-8 py-4 rounded-lg hover:bg-gold/90 transition-all"
            >
              Mulai Konsultasi Sekarang
            </Link>
            <a
              href="https://wa.me/6212345678"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-white/20 text-white font-semibold px-8 py-4 rounded-lg hover:bg-white/10 transition-all"
            >
              <WhatsAppIcon />
              Chat via WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
