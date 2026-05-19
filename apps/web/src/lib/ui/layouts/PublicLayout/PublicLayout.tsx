import React from "react";
import { View, Text, ScrollView, Pressable, Linking } from "react-native";
import { AuroraNavBar } from "../../molecules/AuroraNavBar";
import { HireMeFAB } from "../../molecules/HireMeFAB";
import { useContent } from "../../../hooks/useContent";
import { aurora } from "@/lib/constants/aurora";
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

export function PublicLayout({ children, onNavigate }: PublicLayoutProps) {
  const scrollRef = React.useRef<ScrollView>(null);
  const { data: contentData } = useContent();
  const socialLinks = contentData?.socialLinks ?? [
    { platform: "GitHub", url: "https://github.com/stareezy-1" },
    {
      platform: "LinkedIn",
      url: "https://id.linkedin.com/in/muhammad-bintang-al-akbar-72302812a",
    },
    { platform: "Instagram", url: "https://www.instagram.com/stareezy/" },
  ];

  return (
    <View
      style={[styles.container, { backgroundColor: aurora.deepSpace.value }]}
    >
      {/* Aurora NavBar — sticky, scroll-aware */}
      <AuroraNavBar />

      {/* Main scroll area */}
      <ScrollView
        ref={scrollRef}
        style={styles.main}
        contentContainerStyle={[styles.mainContent, { paddingTop: 60 }]}
      >
        {children}

        {/* Footer */}
        <View
          style={[
            styles.footer,
            {
              backgroundColor: aurora.surfaceDark.value,
              borderTopColor: aurora.borderSubtle.value,
            },
          ]}
          accessibilityRole="none"
          accessibilityLabel="Site footer"
        >
          <View style={styles.footerInner}>
            {/* Brand */}
            <View style={styles.footerBrand}>
              <View style={styles.footerLogoRow}>
                <View
                  style={[
                    styles.footerLogoDot,
                    { backgroundColor: aurora.auroraGreen.value },
                  ]}
                />
                <Text
                  style={[
                    styles.footerLogoText,
                    { color: aurora.starWhite.value },
                  ]}
                >
                  stareezy
                </Text>
              </View>
              <Text
                style={[
                  styles.footerBrandDesc,
                  { color: aurora.textSecondary.value },
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
                      {
                        backgroundColor: `${aurora.borderSubtle.value}80`,
                        borderColor: aurora.borderSubtle.value,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.socialChipText,
                        { color: aurora.textSecondary.value },
                      ]}
                    >
                      {link.platform}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Navigate */}
            <View style={styles.footerCol}>
              <Text
                style={[
                  styles.footerColHeading,
                  { color: aurora.starWhite.value },
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
                      { color: aurora.textSecondary.value },
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
                  { color: aurora.starWhite.value },
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
                      { color: aurora.textSecondary.value },
                    ]}
                  >
                    {p.label} ↗
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View
            style={[
              styles.footerBottom,
              { borderTopColor: aurora.borderSubtle.value },
            ]}
          >
            <Text
              style={[styles.footerCopy, { color: aurora.textMuted.value }]}
            >
              © {new Date().getFullYear()} Muhammad Bintang Al Akbar. All rights
              reserved.
            </Text>
            <Text
              style={[
                styles.footerBuiltWith,
                { color: aurora.textMuted.value },
              ]}
            >
              Built with Expo · Go · Supabase
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Floating Hire Me button */}
      <HireMeFAB />
    </View>
  );
}
