import Link from "next/link";
import { Icon } from "@iconify/react";

export default function Footer() {
  return (
    <footer className="bg-[#132440] text-white mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <img
                src="/logo.jpeg"
                alt="Logo"
                width="36"
                height="36"
                className="rounded-full object-cover"
              />
              DataScraper
            </h3>
            <p className="text-gray-300">
              Platform untuk scraping dan manajemen data client dengan mudah
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-[#3B9797]">Menu</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/" className="hover:text-[#BF092F] transition">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/informasi"
                  className="hover:text-[#BF092F] transition"
                >
                  Cara Scraping
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-[#3B9797]">Informasi</h4>
            <p className="text-gray-300 text-sm">
              Versi: 1.0.0
              <br />
              Backend: Python Flask
              <br />
              Frontend: Next.js + React
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#3B9797] pt-8 flex flex-col md:flex-row justify-between items-center text-gray-300 text-sm">
          <p>&copy; 2025 DataScraper. Semua hak dilindungi.</p>
          <p>
            Made with <Icon icon="mdi:heart" className="inline" /> for data
            management
          </p>
        </div>
      </div>
    </footer>
  );
}
