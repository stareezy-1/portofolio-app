import React from "react";
import { View, Text } from "react-native";
import styles from "./TechStackSection.style";

export interface TechStackSectionProps {
  categories?: { category: string; icon: string; skills: string[] }[];
  isDark?: boolean;
}

const DEFAULT_CATEGORIES = [
  {
    category: "Frontend",
    icon: "🎨",
    skills: [
      "React",
      "React Native",
      "TypeScript",
      "JavaScript",
      "Next.js",
      "Expo",
    ],
  },
  {
    category: "State Management",
    icon: "⚙️",
    skills: ["Redux", "Redux Thunk", "MobX", "Zustand", "React Hook"],
  },
  {
    category: "Mobile",
    icon: "📱",
    skills: ["React Native", "Expo", "React Native Web", "PWA", "Firebase"],
  },
  {
    category: "Backend & Tools",
    icon: "🛠️",
    skills: ["Node.js", ".NET Core", "C#", "PHP", "MySQL", "CI/CD", "Golang"],
  },
  {
    category: "UI Libraries",
    icon: "🎯",
    skills: ["Chakra UI", "React Native Paper", "Tamagui", "Tailwind"],
  },
];

export function TechStackSection({
  categories = DEFAULT_CATEGORIES,
  isDark = true,
}: TechStackSectionProps) {
  const containerBg = isDark ? "rgba(30,41,59,0.5)" : "rgba(241,245,249,0.9)";
  const headingColor = isDark ? "#F8FAFC" : "#0F172A";
  const subColor = "#64748B";
  const cardBg = isDark ? "rgba(30,41,59,0.8)" : "#FFFFFF";
  const cardBorder = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)";
  const catTitleColor = isDark ? "#F1F5F9" : "#0F172A";

  return (
    <View
      style={[styles.container, { backgroundColor: containerBg }]}
      // accessibilityRole="region"
      accessibilityLabel="Tech stack"
    >
      <View style={styles.inner}>
        <Text style={styles.eyebrow}>What I Work With</Text>
        <Text style={[styles.heading, { color: headingColor }]}>
          Tech Stack
        </Text>
        <Text style={[styles.subheading, { color: subColor }]}>
          A curated set of tools and technologies I use to build modern,
          scalable products.
        </Text>
        <View style={styles.grid}>
          {categories.map((cat) => (
            <View
              key={cat.category}
              style={[
                styles.card,
                { backgroundColor: cardBg, borderColor: cardBorder },
              ]}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardIcon}>{cat.icon}</Text>
                <Text style={[styles.categoryTitle, { color: catTitleColor }]}>
                  {cat.category}
                </Text>
              </View>
              <View style={styles.skills}>
                {cat.skills.map((skill) => (
                  <View key={skill} style={styles.skillBadge}>
                    <Text style={styles.skillText}>{skill}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
