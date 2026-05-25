import { ContactForm } from "@/components/public/contact-form";

export const metadata = {
  title: "Hubungi Prime Property",
  description: "Hubungi tim kami untuk konsultasi properti",
};

export default function ContactPage() {
  return (
    <div className="w-full">
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 text-center">
            Hubungi Kami
          </h1>
          <p className="text-gray-700 text-center mb-12">
            Kami siap membantu Anda menemukan properti impian. Hubungi kami melalui
            formulir di bawah atau kontak langsung.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-bold text-primary mb-2">
                  Alamat
                </h3>
                <p className="text-gray-700">
                  Jl. Contoh No. 123
                  <br />
                  Jakarta, Indonesia
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-primary mb-2">
                  Telepon
                </h3>
                <a
                  href="tel:+6212345678"
                  className="text-gold hover:text-gold-dark font-medium"
                >
                  +62 123 4567 8
                </a>
              </div>

              <div>
                <h3 className="text-lg font-bold text-primary mb-2">
                  WhatsApp
                </h3>
                <a
                  href="https://wa.me/6212345678"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold hover:text-gold-dark font-medium inline-block"
                >
                  Chat dengan WhatsApp
                </a>
              </div>

              <div>
                <h3 className="text-lg font-bold text-primary mb-2">
                  Email
                </h3>
                <a
                  href="mailto:info@primeproperty.id"
                  className="text-gold hover:text-gold-dark font-medium"
                >
                  info@primeproperty.id
                </a>
              </div>

              <div className="bg-soft-gray p-6 rounded-lg">
                <h3 className="text-lg font-bold text-primary mb-2">
                  Jam Operasional
                </h3>
                <p className="text-gray-700">
                  Senin - Jumat: 09:00 - 17:00 WIB
                  <br />
                  Sabtu: 10:00 - 16:00 WIB
                  <br />
                  Minggu: Tutup
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
