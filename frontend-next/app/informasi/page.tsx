"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";

export default function Informasi() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[#132440] dark:via-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-3 text-[#132440] dark:text-white flex items-center gap-3">
            <Icon icon="mdi:book-open-page-variant" className="text-5xl" />{" "}
            Panduan Penggunaan
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Pelajari cara menggunakan DataManager untuk mengelola data dengan
            mudah
          </p>
        </div>

        {/* CONTENT CARDS */}
        <div className="space-y-8">
          {/* Card 1 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border-l-4 border-[#3B9797]">
            <div className="flex items-start gap-4">
              <Icon icon="mdi:target" className="text-4xl mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-[#16476A] dark:text-[#3B9797] mb-2">
                  Langkah 1: Akses Dashboard
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Masuk ke halaman Dashboard utama dari menu navigasi. Di
                  halaman ini Anda dapat melihat semua data yang telah
                  dikumpulkan sebelumnya dan memulai proses pengumpulan data
                  baru.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border-l-4 border-[#16476A]">
            <div className="flex items-start gap-4">
              <Icon icon="mdi:cog" className="text-4xl mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-[#132440] dark:text-white mb-2">
                  Langkah 2: Konfigurasi Halaman
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Tentukan jumlah halaman yang ingin diproses. Mulai dari
                  minimal 1 halaman. Perhatikan bahwa semakin banyak halaman,
                  semakin lama waktu yang diperlukan. Disarankan: mulai dengan
                  1-5 halaman untuk percobaan.
                </p>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border-l-4 border-[#3B9797]">
            <div className="flex items-start gap-4">
              <Icon icon="mdi:play" className="text-4xl mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-[#16476A] dark:text-[#3B9797] mb-2">
                  Langkah 3: Mulai Proses
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Klik tombol &quot;Mulai Proses&quot;. Sistem akan mulai mengumpulkan
                  data dari sumber yang telah dikonfigurasi. Mohon tunggu hingga
                  proses selesai dan jangan menutup halaman.
                </p>
              </div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border-l-4 border-[#16476A]">
            <div className="flex items-start gap-4">
              <Icon icon="mdi:chart-box" className="text-4xl mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-[#132440] dark:text-white mb-2">
                  Langkah 4: Lihat Data
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Setelah proses selesai, data akan ditampilkan dalam tabel.
                  Klik tombol "Detail" untuk melihat informasi lengkap dari
                  setiap entri data termasuk nama, nomor telepon dan email.
                </p>
              </div>
            </div>
          </div>

          {/* Card 5 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border-l-4 border-[#BF092F]">
            <div className="flex items-start gap-4">
              <Icon icon="mdi:alert-circle" className="text-4xl mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-[#BF092F] dark:text-red-300 mb-2">
                  Tips & Catatan Penting
                </h2>
                <ul className="text-gray-600 dark:text-gray-300 space-y-2">
                  <li className="flex items-start gap-2">
                    <Icon icon="mdi:check-circle" className="text-2xl mt-1" />
                    <span>
                      Mulai dengan jumlah halaman kecil untuk pengujian
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon icon="mdi:check-circle" className="text-2xl mt-1" />
                    <span>
                      Pastikan koneksi internet stabil selama proses berjalan
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon icon="mdi:check-circle" className="text-2xl mt-1" />
                    <span>
                      Jangan menutup browser atau tab saat proses berlangsung
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon icon="mdi:check-circle" className="text-2xl mt-1" />
                    <span>
                      Data yang dikumpulkan akan tersimpan otomatis di database
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon icon="mdi:check-circle" className="text-2xl mt-1" />
                    <span>
                      Untuk halaman dalam jumlah besar, harap bersabar menunggu
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Card 6 */}
          <div className="bg-gradient-to-r from-[#16476A] to-[#132440] rounded-xl shadow-lg p-8 text-white">
            <div className="flex items-start gap-4">
              <Icon icon="mdi:help-circle" className="text-4xl mt-1" />
              <div>
                <h2 className="text-2xl font-bold mb-2">Tentang Sistem Ini</h2>
                <p className="mb-4">
                  Sistem ini mengotomatisasi proses pengumpulan data dari
                  berbagai sumber website. DataManager dirancang untuk
                  memudahkan Anda dalam mengelola dan mengorganisir data dengan
                  efisien.
                </p>
                <p>
                  Data yang dikumpulkan mencakup informasi kontak, detail
                  personal, dan informasi relevan lainnya sesuai dengan
                  konfigurasi sistem yang telah ditetapkan.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/"
            className="inline-block px-8 py-4 bg-gradient-to-r from-[#16476A] to-[#132440] text-white font-bold rounded-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            ← Kembali ke Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
