import React from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Linking,
  AccessibilityInfo,
} from "react-native";
import { NavLink } from "../../molecules/NavLink";
import { useContent } from "../../../hooks/useContent";
import styles from "./PublicLayout.style";

export interface PublicLayoutProps {
  children: React.ReactNode;
  isDark?: boolean;
  onThemeToggle?: () => void;
  onNavigate?: (route: string) => void;
  currentRoute?: string;
}

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Resume", href: "/resume" },
];

const PROJECTS = [
  { label: "Aurora PDF", url: "https://aurora.stareezy.tech" },
  { label: "Stareezy UI", url: "https://ui.stareezy.tech" },
  { label: "Portfolio", url: "https://stareezy.tech" },
];

export function PublicLayout({
  children,
  isDark = false,
  onNavigate,
  currentRoute = "/",
}: PublicLayoutProps) {
  const scrollRef = React.useRef<ScrollView>(null);
  const { data: contentData } = useContent();
  const socialLinks = contentData?.data?.socialLinks ?? [
    { platform: "GitHub", url: "https://github.com/stareezy-1" },
    {
      platform: "LinkedIn",
      url: "https://id.linkedin.com/in/muhammad-bintang-al-akbar-72302812a",
    },
    { platform: "Instagram", url: "https://www.instagram.com/stareezy/" },
  ];

  const handleSkipToContent = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
    AccessibilityInfo.announceForAccessibility("Skipped to main content");
  };

  return (
    <View style={[styles.container, !isDark && styles.containerLight]}>
      {/* Skip link */}
      <Pressable
        onPress={handleSkipToContent}
        accessibilityRole="link"
        accessibilityLabel="Skip to main content"
        style={{ position: "absolute", top: -100, left: 0, zIndex: 999 }}
      >
        <Text>Skip to main content</Text>
      </Pressable>

      {/* Header */}
      <View
        style={[styles.header, !isDark && styles.headerLight]}
        accessibilityRole="header"
        accessibilityLabel="Site header"
      >
        <Pressable
          style={styles.logoRow}
          onPress={() => onNavigate?.("/")}
          accessibilityRole="link"
          accessibilityLabel="Go to home"
        >
          <View style={styles.logoDot} />
          <Text style={[styles.logo, isDark && styles.logoDark]}>
            Portfolio
          </Text>
        </Pressable>
        <View
          style={styles.nav}
          accessibilityRole="menu"
          accessibilityLabel="Main navigation"
        >
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.href}
              label={link.label}
              href={link.href}
              active={currentRoute === link.href}
              isDark={isDark}
              onPress={() => onNavigate?.(link.href)}
            />
          ))}
        </View>
      </View>

      {/* Main scroll area — footer lives inside so it scrolls with content */}
      <ScrollView
        ref={scrollRef}
        style={styles.main}
        contentContainerStyle={styles.mainContent}
      >
        {children}

        {/* Footer */}
        <View
          style={[styles.footer, !isDark && styles.footerLight]}
          accessibilityRole="none"
          accessibilityLabel="Site footer"
        >
          {/* Columns */}
          <View style={styles.footerInner}>
            {/* Brand */}
            <View style={styles.footerBrand}>
              <View style={styles.footerLogoRow}>
                <View style={styles.footerLogoDot} />
                <Text
                  style={[
                    styles.footerLogoText,
                    !isDark && styles.footerLogoTextLight,
                  ]}
                >
                  stareezy
                </Text>
              </View>
              <Text
                style={[
                  styles.footerBrandDesc,
                  !isDark && styles.footerBrandDescLight,
                ]}
              >
                Front-end developer building modern web and mobile experiences
                with React & React Native.
              </Text>
              <View style={styles.footerSocials}>
                {socialLinks.map((link) => (
                  <Pressable
                    key={link.platform}
                    onPress={() => Linking.openURL(link.url)}
                    accessibilityRole="link"
                    accessibilityLabel={`Visit ${link.platform}`}
                    style={[
                      styles.socialChip,
                      !isDark && styles.socialChipLight,
                    ]}
                  >
                    <Text style={styles.socialChipText}>{link.platform}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Navigate */}
            <View style={styles.footerCol}>
              <Text
                style={[
                  styles.footerColHeading,
                  !isDark && styles.footerColHeadingLight,
                ]}
              >
                Navigate
              </Text>
              {NAV_LINKS.map((link) => (
                <Pressable
                  key={link.href}
                  onPress={() => onNavigate?.(link.href)}
                  accessibilityRole="link"
                  accessibilityLabel={link.label}
                >
                  <Text
                    style={[
                      styles.footerColLink,
                      !isDark && styles.footerColLinkLight,
                    ]}
                  >
                    {link.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Projects */}
            <View style={styles.footerCol}>
              <Text
                style={[
                  styles.footerColHeading,
                  !isDark && styles.footerColHeadingLight,
                ]}
              >
                Projects
              </Text>
              {PROJECTS.map((p) => (
                <Pressable
                  key={p.label}
                  onPress={() => Linking.openURL(p.url)}
                  accessibilityRole="link"
                  accessibilityLabel={`Open ${p.label}`}
                >
                  <Text
                    style={[
                      styles.footerColLink,
                      !isDark && styles.footerColLinkLight,
                    ]}
                  >
                    {p.label} ↗
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Bottom bar */}
          <View
            style={[styles.footerBottom, !isDark && styles.footerBottomLight]}
          >
            <Text
              style={[styles.footerCopy, !isDark && styles.footerCopyLight]}
            >
              © {new Date().getFullYear()} Muhammad Bintang Al Akbar. All rights
              reserved.
            </Text>
            <Text style={styles.footerBuiltWith}>
              Built with Expo · Go · Supabase
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
