"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import * as XLSX from "xlsx";
import { Icon } from "@iconify/react";

type Client = {
  id: number;
  nama: string;
  no_telpon: string;
  no_hp: string;
  email: string;
};

type Scraping = {
  id: number;
  name: string | null;
  pages: number;
  created_at: string;
  total_data: number;
};

// Helper function untuk format tanggal Indonesia dengan timezone lokal
const formatTanggal = (dateString: string) => {
  // SQLite menyimpan dalam UTC tanpa 'Z', jadi kita tambahkan 'Z' untuk parsing yang benar
  const utcString = dateString.includes("Z") ? dateString : dateString + "Z";
  const date = new Date(utcString);

  // Format dengan timezone Asia/Makassar (WITA)
  const formatter = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Asia/Makassar", // WITA (UTC+8)
  });

  return formatter.format(date) + " WITA";
};

export default function ScrapingDetail() {
  const { id } = useParams();
  const [clients, setClients] = useState<Client[]>([]);
  const [scraping, setScraping] = useState<Scraping | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    // Fetch scraping info
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/scrapings`)
      .then((res) => res.json())
      .then((res) => {
        const currentScraping = res.data.find(
          (s: Scraping) => s.id === Number(id)
        );
        setScraping(currentScraping);
      });

    // Fetch clients data
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/scrapings/${id}`)
      .then((res) => res.json())
      .then((res) => setClients(res.data));
  }, [id]);

  // Filter clients
  const filteredClients = useMemo(() => {
    return clients.filter(
      (c) =>
        c.nama?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.no_telpon?.includes(searchQuery) ||
        c.no_hp?.includes(searchQuery)
    );
  }, [clients, searchQuery]);

  // Pagination
  const paginatedClients = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredClients.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredClients, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);

  const handleDownloadCSV = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/scrapings/${id}/download/csv`;
  };

  const handleDownloadExcel = () => {
    const exportData = filteredClients.map((c) => ({
      Nama: c.nama,
      "No Telp": c.no_telpon,
      "No HP": c.no_hp,
      Email: c.email,
    }));

    // Create worksheet from data
    const ws = XLSX.utils.json_to_sheet(exportData);

    // Set column widths
    ws["!cols"] = [
      { wch: 30 }, // Nama
      { wch: 15 }, // No Telp
      { wch: 15 }, // No HP
      { wch: 30 }, // Email
    ];

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data Kontak");

    // Generate Excel file and trigger download
    XLSX.writeFile(
      wb,
      `data-${scraping?.name || "scraping"}-${
        new Date().toISOString().split("T")[0]
      }.xlsx`
    );
  };

  const handlePrint = () => {
    const printWindow = window.open("", "", "height=600,width=800");
    if (!printWindow) return;

    printWindow.document.write("<html><head><title>Detail Data</title>");
    printWindow.document.write("<style>");
    printWindow.document.write(
      "body { font-family: Arial, sans-serif; margin: 20px; }"
    );
    printWindow.document.write("h1 { color: #132440; margin-bottom: 10px; }");
    printWindow.document.write(
      ".meta { color: #666; font-size: 14px; margin-bottom: 20px; }"
    );
    printWindow.document.write(
      "table { width: 100%; border-collapse: collapse; margin-top: 20px; }"
    );
    printWindow.document.write(
      "th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }"
    );
    printWindow.document.write(
      "th { background-color: #132440; color: white; font-weight: bold; }"
    );
    printWindow.document.write(
      "tr:nth-child(even) { background-color: #f2f2f2; }"
    );
    printWindow.document.write("</style></head><body>");
    printWindow.document.write(
      `<h1>Scraping: ${scraping?.name || `Scraping #${id}`}</h1>`
    );
    printWindow.document.write(
      `<div class="meta">Dicetak pada: ${formatTanggal(
        new Date().toISOString()
      )}</div>`
    );
    printWindow.document.write(
      `<div class="meta">Total Data: ${filteredClients.length}</div>`
    );
    printWindow.document.write("<table><thead><tr>");
    printWindow.document.write(
      "<th>Nama</th><th>No Telp</th><th>No HP</th><th>Email</th>"
    );
    printWindow.document.write("</tr></thead><tbody>");

    filteredClients.forEach((c) => {
      printWindow.document.write("<tr>");
      printWindow.document.write(`<td>${c.nama}</td>`);
      printWindow.document.write(`<td>${c.no_telpon}</td>`);
      printWindow.document.write(`<td>${c.no_hp}</td>`);
      printWindow.document.write(`<td>${c.email}</td>`);
      printWindow.document.write("</tr>");
    });

    printWindow.document.write("</tbody></table></body></html>");
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[#132440] dark:via-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-3">
            <Link
              href="/"
              className="text-[#3B9797] hover:text-[#16476A] font-bold text-lg transition"
            >
              ← Kembali
            </Link>
          </div>
          <h1 className="text-4xl font-bold mb-2 text-[#132440] dark:text-white flex items-center gap-3">
            <Icon icon="mdi:chart-box" />
            {scraping?.name || `Scraping #${id}`}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {clients.length} data yang berhasil dikumpulkan
          </p>
        </div>

        {/* SEARCH & ACTIONS BAR */}
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Icon icon="mdi:magnify" />
                Cari Data
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Cari nama, email, atau no telp..."
                className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B9797] bg-white dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Items per page */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Icon icon="mdi:file-document" />
                Data per halaman
              </label>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleDownloadCSV}
              className="px-4 py-2 bg-[#16476A] text-white font-semibold rounded-lg hover:bg-[#0f3550] hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Icon icon="mdi:download" />
              Download CSV
            </button>
            <button
              onClick={handleDownloadExcel}
              className="px-4 py-2 bg-[#3B9797] text-white font-semibold rounded-lg hover:bg-[#2d7575] hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Icon icon="mdi:file-excel" />
              Download Excel
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-[#BF092F] text-white font-semibold rounded-lg hover:bg-[#9a0726] hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Icon icon="mdi:printer" />
              Print
            </button>
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setCurrentPage(1);
                }}
                className="px-4 py-2 bg-gray-400 text-white font-semibold rounded-lg hover:bg-gray-500 hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Icon icon="mdi:refresh" />
                Reset Pencarian
              </button>
            )}
          </div>
        </div>

        {/* RESULTS INFO */}
        <div className="mb-4 text-gray-600 dark:text-gray-300">
          Menampilkan{" "}
          <span className="font-bold">{paginatedClients.length}</span> dari{" "}
          <span className="font-bold">{filteredClients.length}</span> data
          {searchQuery && <span> (hasil pencarian)</span>}
        </div>

        {/* TABLE */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#132440] to-[#16476A] text-white">
                <tr>
                  <th className="p-4 text-left font-bold flex items-center gap-1">
                    <Icon icon="mdi:account" />
                    Nama
                  </th>
                  <th className="p-4 text-left font-bold">
                    <div className="flex items-center gap-1">
                      <Icon icon="mdi:phone" />
                      No Telp
                    </div>
                  </th>
                  <th className="p-4 text-left font-bold">
                    <div className="flex items-center gap-1">
                      <Icon icon="mdi:cellphone" />
                      No HP
                    </div>
                  </th>
                  <th className="p-4 text-left font-bold">
                    <div className="flex items-center gap-1">
                      <Icon icon="mdi:email" />
                      Email
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedClients.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="p-8 text-center text-gray-500 dark:text-gray-400"
                    >
                      {searchQuery
                        ? "Tidak ada data yang sesuai dengan pencarian"
                        : "Tidak ada data"}
                    </td>
                  </tr>
                ) : (
                  paginatedClients.map((c) => (
                    <tr
                      key={c.id}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="p-4 font-semibold text-gray-800 dark:text-white">
                        {c.nama}
                      </td>
                      <td className="p-4 text-gray-600 dark:text-gray-300">
                        {c.no_telpon}
                      </td>
                      <td className="p-4 text-gray-600 dark:text-gray-300">
                        {c.no_hp}
                      </td>
                      <td className="p-4 text-gray-600 dark:text-gray-300">
                        {c.email}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center items-center gap-2">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className={`px-3 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700"
                  : "bg-[#3B9797] text-white hover:bg-[#2d7575] hover:shadow-lg"
              }`}
            >
              <Icon icon="mdi:page-first" />
              Awal
            </button>

            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700"
                  : "bg-[#3B9797] text-white hover:bg-[#2d7575] hover:shadow-lg"
              }`}
            >
              <Icon icon="mdi:chevron-left" />
              Prev
            </button>

            <div className="flex gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      currentPage === pageNum
                        ? "bg-[#132440] text-white shadow-lg"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className={`px-3 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700"
                  : "bg-[#3B9797] text-white hover:bg-[#2d7575] hover:shadow-lg"
              }`}
            >
              Next
              <Icon icon="mdi:chevron-right" />
            </button>

            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className={`px-3 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700"
                  : "bg-[#3B9797] text-white hover:bg-[#2d7575] hover:shadow-lg"
              }`}
            >
              Akhir
              <Icon icon="mdi:page-last" />
            </button>
          </div>
        )}

        {/* PAGINATION INFO */}
        {filteredClients.length > 0 && (
          <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
            Halaman <span className="font-bold">{currentPage}</span> dari{" "}
            <span className="font-bold">{totalPages}</span>
          </div>
        )}
      </div>
    </main>
  );
}
