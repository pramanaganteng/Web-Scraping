"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { Icon } from "@iconify/react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Allow access to login page
    if (pathname === "/login") return;

    // Redirect to login if not authenticated
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router, pathname]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[#132440] dark:via-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">
            <Icon icon="mdi:chart-box" />
          </div>
          <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // Don't render protected content if not authenticated (unless on login page)
  if (!user && pathname !== "/login") {
    return null;
  }

  return <>{children}</>;
}
