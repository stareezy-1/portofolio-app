"use client";
import React, { useEffect, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { usePathname, useRouter } from "expo-router";
import { aurora } from "@/lib/constants/aurora";
import { styles } from "./AuroraNavBar.style";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Resume", href: "/resume" },
];

/** Pure helpers — exported for property tests */
export function getNavBarStyle(scrollY: number): {
  backdropFilter: string;
  borderBottom: boolean;
} {
  return scrollY > 60
    ? { backdropFilter: "blur(20px)", borderBottom: true }
    : { backdropFilter: "blur(12px)", borderBottom: false };
}

export function isActiveLink(pathname: string, href: string): boolean {
  return pathname === href;
}

export function AuroraNavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrollY, setScrollY] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const navStyle = getNavBarStyle(scrollY);

  const webStyle = {
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 200,
    display: "flex",
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    paddingLeft: 24,
    paddingRight: 24,
    height: 60,
    backgroundColor: `${aurora.surfaceDark.value}e6`,
    backdropFilter: navStyle.backdropFilter,
    WebkitBackdropFilter: navStyle.backdropFilter,
    borderBottom: navStyle.borderBottom
      ? `1px solid ${aurora.borderSubtle.value}`
      : "1px solid transparent",
    transition: "backdrop-filter 0.2s, border-color 0.2s",
  };

  return (
    <>
      <View
        style={styles.nav}
        // @ts-ignore — web-only style
        nativeID="aurora-navbar"
        accessibilityRole="none"
        accessibilityLabel="Main navigation"
      >
        {/* Apply web styles via inline style on web */}
        {typeof window !== "undefined" && (
          <style>{`
            #aurora-navbar {
              position: fixed !important;
              top: 0; left: 0; right: 0;
              z-index: 200;
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: space-between;
              padding: 0 24px;
              height: 60px;
              background-color: ${aurora.surfaceDark.value}e6;
              backdrop-filter: ${navStyle.backdropFilter};
              -webkit-backdrop-filter: ${navStyle.backdropFilter};
              border-bottom: ${
                navStyle.borderBottom
                  ? `1px solid ${aurora.borderSubtle.value}`
                  : "1px solid transparent"
              };
              transition: backdrop-filter 0.2s, border-color 0.2s;
            }
          `}</style>
        )}

        {/* Logo */}
        <Pressable
          style={styles.logo}
          onPress={() => router.push("/" as any)}
          accessibilityRole="link"
          accessibilityLabel="Go to home"
        >
          <View style={styles.logoDot} />
          <Text style={styles.logoText}>stareezy</Text>
        </Pressable>

        {/* Desktop links */}
        {!isMobile && (
          <View style={styles.links}>
            {NAV_LINKS.map((link) => {
              const active = isActiveLink(pathname, link.href);
              return (
                <Pressable
                  key={link.href}
                  style={[
                    styles.link,
                    active && {
                      borderBottomWidth: 2,
                      borderBottomColor: aurora.auroraGreen.value,
                    },
                  ]}
                  onPress={() => router.push(link.href as any)}
                  accessibilityRole="link"
                  accessibilityLabel={link.label}
                  aria-current={active ? "page" : undefined}
                >
                  <Text style={[styles.linkText, active && styles.linkActive]}>
                    {link.label}
                  </Text>
                </Pressable>
              );
            })}
            <Pressable
              style={styles.hireBtn}
              onPress={() => router.push("/hire" as any)}
              accessibilityRole="link"
              accessibilityLabel="Hire Me"
            >
              <Text style={styles.hireBtnText}>Hire Me</Text>
            </Pressable>
          </View>
        )}

        {/* Mobile hamburger */}
        {isMobile && (
          <Pressable
            style={styles.hamburger}
            onPress={() => setDrawerOpen((v) => !v)}
            accessibilityRole="button"
            accessibilityLabel={drawerOpen ? "Close menu" : "Open menu"}
          >
            <Text style={styles.hamburgerText}>{drawerOpen ? "✕" : "☰"}</Text>
          </Pressable>
        )}
      </View>

      {/* Mobile drawer */}
      {isMobile && drawerOpen && (
        <View style={styles.drawerOverlay}>
          {NAV_LINKS.map((link) => {
            const active = isActiveLink(pathname, link.href);
            return (
              <Pressable
                key={link.href}
                style={styles.drawerLink}
                onPress={() => {
                  router.push(link.href as any);
                  setDrawerOpen(false);
                }}
                accessibilityRole="link"
              >
                <Text
                  style={[
                    styles.drawerLinkText,
                    active && styles.drawerLinkActive,
                  ]}
                >
                  {link.label}
                </Text>
              </Pressable>
            );
          })}
          <Pressable
            style={[styles.drawerLink, { marginTop: 8 }]}
            onPress={() => {
              router.push("/hire" as any);
              setDrawerOpen(false);
            }}
            accessibilityRole="link"
          >
            <Text
              style={[
                styles.drawerLinkText,
                { color: aurora.auroraGreen.value, fontWeight: "700" },
              ]}
            >
              Hire Me ✉
            </Text>
          </Pressable>
        </View>
      )}
    </>
  );
}
