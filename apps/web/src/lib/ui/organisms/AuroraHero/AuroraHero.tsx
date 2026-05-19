import React from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { AuroraBadge } from "../../molecules/AuroraBadge";
import { TypewriterText } from "../../molecules/TypewriterText";
import { aurora } from "@/lib/constants/aurora";
import { styles } from "./AuroraHero.style";

export interface AuroraHeroProps {
  name: string;
  roles?: string[];
  tagline?: string;
  yearsOfExperience?: number;
  projectsBuilt?: number;
  happyClients?: number;
}

const DEFAULT_ROLES = [
  "Full-Stack Developer",
  "React Native Engineer",
  "Design Systems Architect",
  "Front-End Specialist",
];

export function AuroraHero({
  name,
  roles = DEFAULT_ROLES,
  tagline = "Building modern web and mobile applications with React & React Native.",
  yearsOfExperience = 3,
  projectsBuilt = 9,
  happyClients = 3,
}: AuroraHeroProps) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Ambient glow blobs (web only) */}
      {typeof window !== "undefined" && (
        <>
          <style>{`
            .aurora-hero-blob-1 {
              position: absolute; top: -80px; right: -80px;
              width: 400px; height: 400px; border-radius: 50%;
              background: radial-gradient(circle, ${aurora.auroraGreen.value}18 0%, transparent 70%);
              pointer-events: none;
            }
            .aurora-hero-blob-2 {
              position: absolute; bottom: -60px; left: -60px;
              width: 300px; height: 300px; border-radius: 50%;
              background: radial-gradient(circle, ${aurora.nebulaPurple.value}18 0%, transparent 70%);
              pointer-events: none;
            }
          `}</style>
          <div className="aurora-hero-blob-1" />
          <div className="aurora-hero-blob-2" />
        </>
      )}

      {/* Available badge */}
      <View style={styles.badge}>
        <AuroraBadge label="Available for hire" variant="green" pulse />
      </View>

      {/* Name */}
      <Text
        style={[
          styles.name,
          {
            // Gradient text on web
            ...(typeof window !== "undefined"
              ? {
                  background: `linear-gradient(135deg, ${aurora.starWhite.value} 0%, ${aurora.auroraGreen.value} 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }
              : {}),
          },
        ]}
      >
        {name}
      </Text>

      {/* Animated role */}
      <View style={styles.roleRow}>
        <Text style={styles.rolePrefix}>I&apos;m a </Text>
        <TypewriterText
          phrases={roles}
          style={{
            fontSize: 22,
            fontWeight: "700",
            color: aurora.auroraGreen.value,
          }}
        />
      </View>

      {/* Tagline */}
      <Text style={styles.tagline}>{tagline}</Text>

      {/* Stats */}
      <View style={styles.statsRow}>
        {[
          { value: `${yearsOfExperience}+`, label: "Years Exp." },
          { value: `${projectsBuilt}+`, label: "Projects" },
          { value: `${happyClients}+`, label: "Clients" },
        ].map((s) => (
          <View key={s.label} style={styles.stat}>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* CTAs */}
      <View style={styles.ctaRow}>
        <Pressable
          style={styles.primaryBtn}
          onPress={() => router.push("/hire" as any)}
          accessibilityRole="link"
          accessibilityLabel="Hire Me"
        >
          <Text style={styles.primaryBtnText}>Hire Me ✉</Text>
        </Pressable>
        <Pressable
          style={styles.secondaryBtn}
          onPress={() => router.push("/projects" as any)}
          accessibilityRole="link"
          accessibilityLabel="View Projects"
        >
          <Text style={styles.secondaryBtnText}>View Projects →</Text>
        </Pressable>
      </View>
    </View>
  );
}
