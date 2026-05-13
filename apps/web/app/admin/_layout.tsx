import React, { useCallback } from "react";
import { Slot, useRouter, usePathname } from "expo-router";
import { AdminLayout } from "@/lib/ui/layouts/AdminLayout";
import { useAuthStore } from "../../src/stores/auth-store";

export default function AdminLayoutRoute() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuthStore();

  const handleLogout = useCallback(() => {
    logout();
    router.replace("/login" as any);
  }, [logout, router]);

  const handleNavigate = useCallback(
    (route: string) => {
      router.push(route as any);
    },
    [router],
  );

  const handleRedirectToLogin = useCallback(() => {
    router.replace("/login" as any);
  }, [router]);

  if (!isAuthenticated) {
    handleRedirectToLogin();
    return null;
  }

  return (
    <AdminLayout
      isAuthenticated={isAuthenticated}
      onLogout={handleLogout}
      onNavigate={handleNavigate}
      onRedirectToLogin={handleRedirectToLogin}
      currentRoute={pathname}
    >
      <Slot />
    </AdminLayout>
  );
}
