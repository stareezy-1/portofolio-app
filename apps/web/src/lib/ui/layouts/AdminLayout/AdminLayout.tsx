import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { NavLink } from "../../molecules/NavLink";
import styles from "./AdminLayout.style";

export interface AdminLayoutProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
  onLogout?: () => void;
  onNavigate?: (route: string) => void;
  onRedirectToLogin?: () => void;
  currentRoute?: string;
}

const SIDEBAR_LINKS = [
  { label: "Dashboard", href: "/admin" },
  { label: "Projects", href: "/admin/projects" },
  { label: "Resume", href: "/admin/resume" },
  { label: "Content", href: "/admin/content" },
];

export function AdminLayout({
  children,
  isAuthenticated,
  onLogout,
  onNavigate,
  onRedirectToLogin,
  currentRoute = "/admin/dashboard",
}: AdminLayoutProps) {
  React.useEffect(() => {
    if (!isAuthenticated) {
      onRedirectToLogin?.();
    }
  }, [isAuthenticated, onRedirectToLogin]);

  if (!isAuthenticated) return null;

  return (
    <View style={styles.container}>
      <View
        style={styles.sidebar}
        // accessibilityRole="navigation"
        accessibilityLabel="Admin navigation"
      >
        <View style={styles.sidebarLogoRow}>
          <View style={styles.sidebarLogoDot} />
          <Text style={styles.sidebarTitle}>Admin Panel</Text>
        </View>
        <View style={styles.sidebarLinks}>
          {SIDEBAR_LINKS.map((link) => (
            <NavLink
              key={link.href}
              label={link.label}
              href={link.href}
              active={
                currentRoute === link.href ||
                currentRoute.startsWith(link.href + "/")
              }
              isDark
              onPress={() => onNavigate?.(link.href)}
            />
          ))}
        </View>
        <Pressable
          style={styles.logoutButton}
          onPress={onLogout}
          accessibilityRole="button"
          accessibilityLabel="Log out"
        >
          <Text style={styles.logoutText}>Sign Out</Text>
        </Pressable>
      </View>

      <View style={styles.mainArea}>
        <View
          style={styles.header}
          // accessibilityRole="banner"
        >
          <Text style={styles.headerTitle}>Dashboard</Text>
          <View style={styles.headerBadge}>
            <View style={styles.headerBadgeDot} />
            <Text style={styles.headerBadgeText}>Admin</Text>
          </View>
        </View>
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentInner}
        >
          {children}
        </ScrollView>
      </View>
    </View>
  );
}
