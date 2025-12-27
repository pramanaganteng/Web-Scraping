"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();

  // Don't show navbar on login page
  if (pathname === "/login") {
    return null;
  }

  return (
    <nav className="bg-linear-to-r from-[#132440] to-[#16476A] text-white shadow-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold flex items-center gap-3 hover:opacity-90 transition"
        >
          <img
            src="/logo.jpeg"
            alt="Logo"
            width="32"
            height="32"
            className="rounded-full object-cover"
          />
          DataScraper
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="hover:text-[#3B9797] transition font-semibold"
          >
            Dashboard
          </Link>
          <Link
            href="/informasi"
            className="hover:text-[#3B9797] transition font-semibold"
          >
            Panduan
          </Link>

          {/* User Info & Logout */}
          {user && (
            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-white/30">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#3B9797] rounded-full flex items-center justify-center font-bold">
                  {user.username[0].toUpperCase()}
                </div>
                <span className="font-semibold">{user.username}</span>
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 bg-[#BF092F] rounded-lg hover:bg-[#9a0726] transition font-semibold flex items-center gap-2"
              >
                <Icon icon="mdi:logout" />
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex flex-col gap-1.5"
        >
          <span
            className={`w-6 h-0.5 bg-white transition-all ${
              isOpen ? "rotate-45 translate-y-2" : ""
            }`}
          ></span>
          <span
            className={`w-6 h-0.5 bg-white transition-all ${
              isOpen ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`w-6 h-0.5 bg-white transition-all ${
              isOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          ></span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#0f3550] px-6 py-4 space-y-3">
          <Link
            href="/"
            className="block hover:text-[#3B9797] transition font-semibold"
            onClick={() => setIsOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            href="/informasi"
            className="block hover:text-[#3B9797] transition font-semibold"
            onClick={() => setIsOpen(false)}
          >
            Panduan
          </Link>
        </div>
      )}
    </nav>
  );
}
