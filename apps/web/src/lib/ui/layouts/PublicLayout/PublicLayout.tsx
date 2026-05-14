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

export function PublicLayout({
  children,
  isDark = false,
  onThemeToggle,
  onNavigate,
  currentRoute = "/",
}: PublicLayoutProps) {
  const scrollRef = React.useRef<ScrollView>(null);
  const { data: contentData } = useContent();
  const socialLinks = contentData?.data?.socialLinks ?? [
    { platform: "GitHub", url: "https://github.com" },
    { platform: "LinkedIn", url: "https://linkedin.com" },
    { platform: "Twitter", url: "https://twitter.com" },
  ];

  const handleSkipToContent = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
    AccessibilityInfo.announceForAccessibility("Skipped to main content");
  };

  return (
    <View style={[styles.container, !isDark && styles.containerLight]}>
      <Pressable
        onPress={handleSkipToContent}
        accessibilityRole="link"
        accessibilityLabel="Skip to main content"
        style={{ position: "absolute", top: -100, left: 0, zIndex: 999 }}
      >
        <Text>Skip to main content</Text>
      </Pressable>

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

      <ScrollView
        ref={scrollRef}
        style={styles.main}
        contentContainerStyle={styles.mainContent}
      >
        {children}
      </ScrollView>

      <View
        style={[styles.footer, !isDark && styles.footerLight]}
        accessibilityRole="summary"
        accessibilityLabel="Site footer"
      >
        <View style={styles.footerInner}>
          <View style={styles.footerLeft}>
            <Text
              style={[styles.footerText, !isDark && styles.footerTextLight]}
            >
              © {new Date().getFullYear()} Portfolio. All rights reserved.
            </Text>
            <Text style={styles.footerTagline}>Built with Expo + Go</Text>
          </View>
          <View style={styles.footerRight}>
            {socialLinks.map((link) => (
              <Pressable
                key={link.platform}
                onPress={() => Linking.openURL(link.url)}
                accessibilityRole="link"
                accessibilityLabel={`Visit ${link.platform}`}
              >
                <Text style={styles.footerLink}>{link.platform}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}
