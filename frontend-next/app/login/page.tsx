"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { Icon } from "@iconify/react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const success = await login(username, password);

    if (success) {
      router.push("/");
    } else {
      setError("Username atau password salah!");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#132440] via-[#16476A] to-[#3B9797] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4 flex justify-center">
            <Icon icon="mdi:chart-box" className="text-5xl" />
          </div>
          <h1 className="text-3xl font-bold text-[#132440] dark:text-white mb-2">
            Dashboard Scraping
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Login untuk melanjutkan
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-100 dark:bg-red-900 border-l-4 border-red-500 rounded-lg p-4">
              <p className="text-red-700 dark:text-red-200 font-semibold flex items-center gap-2">
                <Icon icon="mdi:close-circle" className="text-xl" /> {error}
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <Icon icon="mdi:account" className="text-xl" /> Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username"
              required
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B9797] bg-white dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <Icon icon="mdi:lock" className="text-xl" /> Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              required
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B9797] bg-white dark:bg-gray-700 dark:text-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-white font-bold rounded-lg transition-all duration-300 transform shadow-md ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#16476A] hover:bg-[#0f3550] hover:shadow-xl hover:scale-105 active:scale-95"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Icon icon="mdi:timer-sand" className="text-xl" /> Memproses...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Icon icon="mdi:rocket-launch" className="text-xl" /> Login
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
