export const metadata = {
  title: "Tentang Prime Property",
  description: "Pelajari lebih lanjut tentang Prime Property dan visi kami",
};

export default function AboutPage() {
  return (
    <div className="w-full">
      <section className="py-16 md:py-24 bg-soft-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-12 text-center">
            Tentang Prime Property
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Text Column */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-primary mb-4">
                  Tentang Kami
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Prime Property adalah perusahaan real estate terpercaya yang berdedikasi
                  untuk menyediakan properti premium berkualitas tinggi di lokasi strategis.
                  Dengan pengalaman lebih dari satu dekade, kami memahami kebutuhan pelanggan
                  dan berkomitmen memberikan layanan terbaik.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-primary mb-4">
                  Visi Kami
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Menjadi pilihan utama masyarakat dalam mencari properti impian dengan
                  standar kualitas internasional dan layanan pelanggan yang luar biasa.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-primary mb-4">
                  Misi Kami
                </h2>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-gold mr-3">✓</span>
                    <span>Menyediakan properti berkualitas premium di kawasan strategis</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold mr-3">✓</span>
                    <span>Memberikan transparansi penuh dalam setiap transaksi</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold mr-3">✓</span>
                    <span>Melayani dengan profesional dan integritas tinggi</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold mr-3">✓</span>
                    <span>Membangun kepercayaan jangka panjang dengan pelanggan</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Values Column */}
            <div>
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold text-primary mb-6">
                  Nilai-Nilai Kami
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-primary mb-2">
                      Integritas
                    </h3>
                    <p className="text-gray-700">
                      Kami menjunjung tinggi kejujuran dan transparansi dalam setiap interaksi
                      dengan pelanggan dan mitra bisnis.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-primary mb-2">
                      Kualitas
                    </h3>
                    <p className="text-gray-700">
                      Setiap properti yang kami tawarkan telah melalui standar kualitas ketat
                      untuk memastikan kepuasan pelanggan.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-primary mb-2">
                      Inovasi
                    </h3>
                    <p className="text-gray-700">
                      Kami terus berinovasi untuk memberikan solusi terbaik dan layanan modern
                      kepada semua pelanggan.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-primary mb-2">
                      Kepercayaan
                    </h3>
                    <p className="text-gray-700">
                      Kepercayaan pelanggan adalah aset paling berharga bagi kami dan kami
                      berkomitmen menjaganya.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
