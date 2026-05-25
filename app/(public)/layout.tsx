import { Header } from "@/components/public/header";
import { ToastProvider } from "@/components/ui/toast-provider";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow">{children}</main>
      <footer className="bg-primary text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-2">Prime Property</h3>
              <p className="text-gray-400 text-sm">
                Properti premium pilihan di kawasan strategis.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Navigasi</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="/" className="hover:text-gold transition-colors">
                    Beranda
                  </a>
                </li>
                <li>
                  <a href="/about" className="hover:text-gold transition-colors">
                    Tentang Kami
                  </a>
                </li>
                <li>
                  <a href="/contact" className="hover:text-gold transition-colors">
                    Kontak
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Kontak</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a
                    href="tel:+6212345678"
                    className="hover:text-gold transition-colors"
                  >
                    +62 123 4567 8
                  </a>
                </li>
                <li>
                  <a
                    href="https://wa.me/6212345678"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gold transition-colors"
                  >
                    WhatsApp
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:info@primeproperty.id"
                    className="hover:text-gold transition-colors"
                  >
                    info@primeproperty.id
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Informasi</h4>
              <p className="text-sm text-gray-400">
                Jl. Contoh No. 123, Jakarta, Indonesia
              </p>
              <p className="text-sm text-gray-400 mt-4">
                &copy; 2026 Prime Property. Semua hak dilindungi.
              </p>
            </div>
          </div>
        </div>
      </footer>
      <ToastProvider />
    </div>
  );
}
