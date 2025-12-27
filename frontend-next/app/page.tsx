"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import * as XLSX from "xlsx";
import ProtectedRoute from "./components/ProtectedRoute";
import { Icon } from "@iconify/react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

type Scraping = {
  id: number;
  name: string | null;
  pages: number;
  created_at: string;
  total_data?: number;
};

type SortField = "name" | "pages" | "total_data" | "created_at";
type SortOrder = "asc" | "desc";

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

export default function Home() {
  const [scrapings, setScrapings] = useState<Scraping[]>([]);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");

  // PWA Install
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [dateFilter, setDateFilter] = useState({ start: "", end: "" });

  const fetchScrapings = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/scrapings`);
    const json = await res.json();
    setScrapings(json.data);
  };

  useEffect(() => {
    fetchScrapings();

    // PWA Install Prompt
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt as EventListener
    );

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt as EventListener
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setShowInstallButton(false);
    }

    setDeferredPrompt(null);
  };

  const startScraping = async () => {
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/scrape`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pages }),
      });

      if (!res.ok) throw new Error("Scraping gagal");

      // 🔥 tunggu scraping selesai, baru refresh list
      await fetchScrapings();
    } catch (err) {
      console.error(err);
      setError("Gagal scraping, coba halaman lebih kecil");
    } finally {
      setLoading(false);
    }
  };

  const handleEditName = async (scraping: Scraping) => {
    setEditingId(scraping.id);
    setEditName(scraping.name || `Scraping #${scraping.id}`);
  };

  const handleSaveName = async (scraping_id: number) => {
    if (!editName.trim()) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/scrapings/${scraping_id}/rename`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: editName }),
        }
      );

      if (res.ok) {
        setEditingId(null);
        await fetchScrapings();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (scraping_id: number) => {
    if (!window.confirm("Yakin ingin menghapus scraping ini?")) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/scrapings/${scraping_id}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        await fetchScrapings();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ==================== DOWNLOAD HANDLER ====================
  const handleDownloadList = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/scrapings/download/csv`;
  };

  const handleDownloadExcel = () => {
    // Convert to Excel format using xlsx library
    const exportData = filteredAndSortedData.map((s) => ({
      Nama: s.name || `Data #${s.id}`,
      Halaman: s.pages,
      "Total Data": s.total_data || 0,
      Tanggal: formatTanggal(s.created_at),
    }));

    // Create worksheet from data
    const ws = XLSX.utils.json_to_sheet(exportData);

    // Set column widths
    ws["!cols"] = [
      { wch: 30 }, // Nama
      { wch: 10 }, // Halaman
      { wch: 12 }, // Total Data
      { wch: 25 }, // Tanggal
    ];

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data Scraping");

    // Generate Excel file and trigger download
    XLSX.writeFile(
      wb,
      `data-scraping-${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  const handlePrint = () => {
    const printWindow = window.open("", "", "height=600,width=800");
    if (!printWindow) return;

    printWindow.document.write("<html><head><title>Data Scraping</title>");
    printWindow.document.write("<style>");
    printWindow.document.write(
      "body { font-family: Arial, sans-serif; margin: 20px; }"
    );
    printWindow.document.write("h1 { color: #132440; margin-bottom: 20px; }");
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
    printWindow.document.write(
      ".meta { color: #666; font-size: 14px; margin-bottom: 10px; }"
    );
    printWindow.document.write("</style></head><body>");
    printWindow.document.write("<h1>Dashboard Manajemen Data</h1>");
    printWindow.document.write(
      `<div class="meta">Dicetak pada: ${formatTanggal(
        new Date().toISOString()
      )}</div>`
    );
    printWindow.document.write(
      `<div class="meta">Total Data: ${filteredAndSortedData.length}</div>`
    );
    printWindow.document.write("<table><thead><tr>");
    printWindow.document.write(
      "<th>Nama</th><th>Halaman</th><th>Total Data</th><th>Tanggal</th>"
    );
    printWindow.document.write("</tr></thead><tbody>");

    filteredAndSortedData.forEach((s) => {
      printWindow.document.write("<tr>");
      printWindow.document.write(`<td>${s.name || `Data #${s.id}`}</td>`);
      printWindow.document.write(`<td>${s.pages}</td>`);
      printWindow.document.write(`<td>${s.total_data || 0}</td>`);
      printWindow.document.write(`<td>${formatTanggal(s.created_at)}</td>`);
      printWindow.document.write("</tr>");
    });

    printWindow.document.write("</tbody></table></body></html>");
    printWindow.document.close();
    printWindow.print();
  };

  // Filtering, sorting, and pagination logic
  const filteredAndSortedData = useMemo(() => {
    const filtered = scrapings.filter((s) => {
      const matchesSearch = (s.name || `Data #${s.id}`)
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const date = new Date(s.created_at);
      const matchesDateStart =
        !dateFilter.start || date >= new Date(dateFilter.start);
      const matchesDateEnd =
        !dateFilter.end || date <= new Date(dateFilter.end + "T23:59:59");

      return matchesSearch && matchesDateStart && matchesDateEnd;
    });

    // Sort data
    filtered.sort((a, b) => {
      let aVal: string | number = a[sortField] as string | number;
      let bVal: string | number = b[sortField] as string | number;

      if (sortField === "name") {
        aVal = (a.name || `Data #${a.id}`).toLowerCase();
        bVal = (b.name || `Data #${b.id}`).toLowerCase();
      } else if (sortField === "created_at") {
        aVal = new Date(a.created_at).getTime();
        bVal = new Date(b.created_at).getTime();
      }

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [scrapings, searchQuery, dateFilter, sortField, sortOrder]);

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Statistics
  const stats = useMemo(() => {
    const totalData = scrapings.reduce(
      (sum, s) => sum + (s.total_data || 0),
      0
    );
    const totalPages = scrapings.reduce((sum, s) => sum + s.pages, 0);
    return {
      totalScrapings: scrapings.length,
      totalData,
      totalPages,
      avgDataPerScraping:
        scrapings.length > 0 ? Math.round(totalData / scrapings.length) : 0,
    };
  }, [scrapings]);

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[#132440] dark:via-gray-900 dark:to-gray-800 p-8">
        <div className="max-w-6xl mx-auto">
          {/* HEADER */}
          <div className="mb-12">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-5xl font-bold mb-3 text-[#132440] dark:text-white flex items-center gap-3">
                  <Icon icon="mdi:chart-box" className="text-5xl" />
                  Dashboard Manajemen Data
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  Kelola dan monitor proses pengumpulan data secara efisien
                </p>
              </div>
              {showInstallButton && (
                <button
                  onClick={handleInstallClick}
                  className="px-4 py-2 bg-gradient-to-r from-[#3B9797] to-[#2d7575] text-white font-semibold rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Icon icon="mdi:cellphone" />
                  Install Aplikasi
                </button>
              )}
            </div>
          </div>

          {/* STATISTICS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <div className="bg-gradient-to-br from-[#3B9797] to-[#2d7575] rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-1">Total Scraping</p>
                  <p className="text-3xl font-bold">{stats.totalScrapings}</p>
                </div>
                <Icon
                  icon="mdi:clipboard-list"
                  className="text-4xl opacity-80"
                />
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#16476A] to-[#0f3550] rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-1">Total Data</p>
                  <p className="text-3xl font-bold">{stats.totalData}</p>
                </div>
                <Icon icon="mdi:chart-box" className="text-4xl opacity-80" />
              </div>
            </div>

            <div className="bg-[#BF092F] rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-1">Total Halaman</p>
                  <p className="text-3xl font-bold">{stats.totalPages}</p>
                </div>
                <Icon
                  icon="mdi:file-document"
                  className="text-4xl opacity-80"
                />
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#132440] to-[#16476A] rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-1">Rata-rata Data</p>
                  <p className="text-3xl font-bold">
                    {stats.avgDataPerScraping}
                  </p>
                </div>
                <Icon
                  icon="mdi:chart-line-variant"
                  className="text-4xl opacity-80"
                />
              </div>
            </div>
          </div>

          {/* FORM SCRAPE */}
          <div className="mb-10 bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 border-l-4 border-[#3B9797]">
            <h2 className="text-2xl font-bold mb-6 text-[#132440] dark:text-white flex items-center gap-2">
              <Icon icon="mdi:pencil" />
              Proses Data Baru
            </h2>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center gap-3">
                <label className="font-semibold text-gray-700 dark:text-gray-300">
                  Jumlah Halaman:
                </label>
                <input
                  type="number"
                  min={1}
                  value={pages}
                  onChange={(e) => setPages(Number(e.target.value))}
                  className="border-2 border-[#16476A] rounded-lg p-3 w-32 font-semibold text-center focus:outline-none focus:ring-2 focus:ring-[#3B9797] bg-white dark:bg-gray-700 dark:text-white dark:border-[#3B9797]"
                />
              </div>

              <button
                onClick={startScraping}
                disabled={loading}
                className={`px-8 py-3 flex items-center gap-2 text-white font-bold rounded-lg transition-all duration-300 transform shadow-md ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#BF092F] hover:bg-[#9a0726] hover:shadow-xl hover:scale-105 active:scale-95"
                }`}
              >
                {loading ? (
                  <>
                    <Icon icon="mdi:timer-sand" className="animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <Icon icon="mdi:play" />
                    Mulai Proses
                  </>
                )}
              </button>

              {loading && (
                <span className="text-sm text-[#BF092F] font-semibold animate-pulse flex items-center gap-1">
                  <Icon icon="mdi:timer-sand" className="animate-spin" />
                  Proses sedang berjalan...
                </span>
              )}
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 border-l-4 border-red-500 rounded-lg">
              <p className="text-red-700 dark:text-red-200 font-semibold flex items-center gap-2">
                <Icon icon="mdi:close-circle" />
                {error}
              </p>
            </div>
          )}

          {/* SEARCH, FILTER & ACTIONS BAR */}
          <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                  <Icon icon="mdi:magnify" />
                  Cari Nama
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Ketik nama scraping..."
                  className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B9797] bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Date From */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                  <Icon icon="mdi:calendar" />
                  Dari Tanggal
                </label>
                <input
                  type="date"
                  value={dateFilter.start}
                  onChange={(e) => {
                    setDateFilter({ ...dateFilter, start: e.target.value });
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B9797] bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Date To */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                  <Icon icon="mdi:calendar" />
                  Sampai Tanggal
                </label>
                <input
                  type="date"
                  value={dateFilter.end}
                  onChange={(e) => {
                    setDateFilter({ ...dateFilter, end: e.target.value });
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B9797] bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleDownloadExcel}
                className="px-4 py-2 bg-[#16476A] text-white font-semibold rounded-lg hover:bg-[#0f3550] hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Icon icon="mdi:file-excel" />
                Download Excel
              </button>
              <button
                onClick={handleDownloadList}
                className="px-4 py-2 bg-[#3B9797] text-white font-semibold rounded-lg hover:bg-[#2d7575] hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Icon icon="mdi:download" />
                Download CSV
              </button>
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-[#BF092F] text-white font-semibold rounded-lg hover:bg-[#9a0726] hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Icon icon="mdi:printer" />
                Print
              </button>
              {(searchQuery || dateFilter.start || dateFilter.end) && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setDateFilter({ start: "", end: "" });
                    setCurrentPage(1);
                  }}
                  className="px-4 py-2 bg-gray-400 text-white font-semibold rounded-lg hover:bg-gray-500 hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Icon icon="mdi:refresh" />
                  Reset Filter
                </button>
              )}
            </div>
          </div>

          {/* RESULTS INFO */}
          <div className="mb-4 flex justify-between items-center">
            <p className="text-gray-600 dark:text-gray-300">
              Menampilkan{" "}
              <span className="font-bold">{paginatedData.length}</span> dari{" "}
              <span className="font-bold">{filteredAndSortedData.length}</span>{" "}
              data
            </p>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 dark:text-gray-300">
                Per halaman:
              </label>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-3 py-1 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          {/* TABLE */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-[#132440] to-[#16476A] text-white">
                  <tr>
                    <th
                      className="p-4 text-left font-bold cursor-pointer hover:bg-opacity-80 transition-all"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center gap-2">
                        <Icon icon="mdi:clipboard-list" />
                        Nama
                        {sortField === "name" && (
                          <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                        )}
                      </div>
                    </th>
                    <th
                      className="p-4 text-left font-bold cursor-pointer hover:bg-opacity-80 transition-all"
                      onClick={() => handleSort("pages")}
                    >
                      <div className="flex items-center gap-2">
                        <Icon icon="mdi:file-document" />
                        Halaman
                        {sortField === "pages" && (
                          <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                        )}
                      </div>
                    </th>
                    <th
                      className="p-4 text-left font-bold cursor-pointer hover:bg-opacity-80 transition-all"
                      onClick={() => handleSort("total_data")}
                    >
                      <div className="flex items-center gap-2">
                        <Icon icon="mdi:chart-box" />
                        Data
                        {sortField === "total_data" && (
                          <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                        )}
                      </div>
                    </th>
                    <th
                      className="p-4 text-left font-bold cursor-pointer hover:bg-opacity-80 transition-all"
                      onClick={() => handleSort("created_at")}
                    >
                      <div className="flex items-center gap-2">
                        <Icon icon="mdi:calendar" />
                        Tanggal
                        {sortField === "created_at" && (
                          <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                        )}
                      </div>
                    </th>
                    <th className="p-4 text-left font-bold flex items-center gap-1">
                      <Icon icon="mdi:cog" />
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="p-8 text-center text-gray-500 dark:text-gray-400 flex justify-center items-center gap-2"
                      >
                        {searchQuery || dateFilter.start || dateFilter.end ? (
                          <>
                            <Icon icon="mdi:close-circle" />
                            Tidak ada data yang sesuai dengan filter
                          </>
                        ) : (
                          <>
                            <Icon icon="mdi:inbox" />
                            Belum ada data scraping
                          </>
                        )}
                      </td>
                    </tr>
                  ) : (
                    paginatedData.map((s) => (
                      <tr
                        key={s.id}
                        className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <td className="p-4 font-semibold text-gray-800 dark:text-white">
                          {editingId === s.id ? (
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="w-full px-2 py-1 border border-[#3B9797] rounded focus:outline-none focus:ring-2 focus:ring-[#3B9797]"
                              autoFocus
                            />
                          ) : (
                            s.name || `Data #${s.id}`
                          )}
                        </td>
                        <td className="p-4 text-gray-600 dark:text-gray-300">
                          <span className="bg-[#16476A] bg-opacity-10 text-[#ffff] dark:bg-[#16476A] dark:text-white px-3 py-1 rounded-full font-semibold text-sm">
                            {s.pages}
                          </span>
                        </td>
                        <td className="p-4 text-gray-600 dark:text-gray-300">
                          <span className="bg-[#3B9797] bg-opacity-10 text-[#ffff] dark:bg-[#3B9797] dark:text-white px-3 py-1 rounded-full font-semibold text-sm">
                            {s.total_data || 0}
                          </span>
                        </td>
                        <td className="p-4 text-gray-600 dark:text-gray-300 text-sm">
                          {formatTanggal(s.created_at)}
                        </td>
                        <td className="p-4 space-x-2 flex flex-wrap gap-2">
                          {editingId === s.id ? (
                            <>
                              <button
                                onClick={() => handleSaveName(s.id)}
                                className="px-3 py-1 bg-[#3B9797] text-white font-semibold rounded hover:bg-[#2d7575] hover:shadow-lg transition-all text-sm flex items-center gap-1"
                              >
                                <Icon icon="mdi:check" />
                                Simpan
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="px-3 py-1 bg-gray-400 text-white font-semibold rounded hover:bg-gray-500 hover:shadow-lg transition-all text-sm flex items-center gap-1"
                              >
                                <Icon icon="mdi:close" />
                                Batal
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEditName(s)}
                                className="px-3 py-1 bg-[#16476A] text-white font-semibold rounded hover:bg-[#0f3550] hover:shadow-lg transition-all text-sm flex items-center gap-1"
                              >
                                <Icon icon="mdi:pencil" />
                                Edit
                              </button>
                              <Link
                                href={`/scraping/${s.id}`}
                                className="px-3 py-1 bg-[#3B9797] text-white font-semibold rounded hover:bg-[#2d7575] hover:shadow-lg transition-all text-sm inline-flex items-center gap-1"
                              >
                                <Icon icon="mdi:eye" />
                                Detail
                              </Link>
                              <button
                                onClick={() => handleDelete(s.id)}
                                className="px-3 py-1 bg-[#BF092F] text-white font-semibold rounded hover:bg-[#9a0726] hover:shadow-lg transition-all text-sm flex items-center gap-1"
                              >
                                <Icon icon="mdi:delete" />
                                Hapus
                              </button>
                            </>
                          )}
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
                className={`px-3 py-2 rounded-lg font-semibold transition-all flex items-center gap-1 ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700"
                    : "bg-[#3B9797] text-white hover:bg-[#2d7575] hover:shadow-lg"
                }`}
              >
                <Icon icon="mdi:skip-backward" />
                Awal
              </button>

              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`px-3 py-2 rounded-lg font-semibold transition-all flex items-center gap-1 ${
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
                className={`px-3 py-2 rounded-lg font-semibold transition-all flex items-center gap-1 ${
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
                className={`px-3 py-2 rounded-lg font-semibold transition-all flex items-center gap-1 ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700"
                    : "bg-[#3B9797] text-white hover:bg-[#2d7575] hover:shadow-lg"
                }`}
              >
                Akhir
                <Icon icon="mdi:skip-forward" />
              </button>
            </div>
          )}

          {/* PAGINATION INFO */}
          {filteredAndSortedData.length > 0 && (
            <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
              Halaman <span className="font-bold">{currentPage}</span> dari{" "}
              <span className="font-bold">{totalPages}</span>
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}
