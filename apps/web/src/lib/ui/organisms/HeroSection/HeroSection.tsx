import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  Animated,
  AccessibilityInfo,
  Image,
} from "react-native";
import styles from "./HeroSection.style";

export interface HeroSectionProps {
  title?: string;
  name?: string;
  subtitle?: string;
  description?: string;
  avatarUrl?: string;
  onViewWork?: () => void;
  onContact?: () => void;
}

export function HeroSection({
  title = "Hi, I'm",
  name = "Alex Johnson",
  subtitle = "Full Stack Engineer & Mobile Developer",
  description = "I craft high-performance web and mobile applications with modern technologies. Passionate about clean code, great UX, and scalable architecture.",
  avatarUrl,
  onViewWork,
  onContact,
}: HeroSectionProps) {
  const [reduceMotion, setReduceMotion] = React.useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const badgeAnim = useRef(new Animated.Value(0)).current;
  const statsAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      setReduceMotion(mq.matches);
    }
    AccessibilityInfo.isReduceMotionEnabled?.().then((enabled) => {
      if (enabled) setReduceMotion(true);
    });
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      fadeAnim.setValue(1);
      slideAnim.setValue(0);
      badgeAnim.setValue(1);
      statsAnim.setValue(1);
      return;
    }
    Animated.sequence([
      Animated.timing(badgeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(statsAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [reduceMotion]);

  return (
    <View
      style={styles.container}
      accessibilityRole="header"
      accessibilityLabel="Hero section"
    >
      <View style={styles.background} />
      <View style={styles.glow1} />
      <View style={styles.glow2} />
      <View style={styles.glow3} />

      <Animated.View style={[styles.badge, { opacity: badgeAnim }]}>
        <View style={styles.badgeDot} />
        <Text style={styles.badgeText}>Available for opportunities</Text>
      </Animated.View>

      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          alignItems: "center",
        }}
      >
        {avatarUrl ? (
          <Image
            source={{ uri: avatarUrl }}
            style={styles.avatar}
            accessibilityLabel={`${name} profile photo`}
          />
        ) : null}
        <Text style={styles.greeting}>{title}</Text>
        <Text style={styles.title}>
          <Text style={styles.titleAccent}>{name}</Text>
        </Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        <Text style={styles.description}>{description}</Text>
        <View style={styles.ctaRow}>
          <Pressable
            style={styles.ctaPrimary}
            onPress={onViewWork}
            accessibilityRole="button"
            accessibilityLabel="View my work"
          >
            <Text style={styles.ctaPrimaryText}>View My Work →</Text>
          </Pressable>
          <Pressable
            style={styles.ctaSecondary}
            onPress={onContact}
            accessibilityRole="button"
            accessibilityLabel="Get in touch"
          >
            <Text style={styles.ctaSecondaryText}>Get in Touch</Text>
          </Pressable>
        </View>
      </Animated.View>

      <Animated.View style={[styles.statsRow, { opacity: statsAnim }]}>
        {[
          { number: "5+", label: "Years Experience" },
          { number: "30+", label: "Projects Built" },
          { number: "10+", label: "Happy Clients" },
          { number: "∞", label: "Lines of Code" },
        ].map((stat) => (
          <View key={stat.label} style={styles.stat}>
            <Text style={styles.statNumber}>{stat.number}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </Animated.View>
    </View>
  );
}
