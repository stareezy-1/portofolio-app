import React from "react";
import { View, Text } from "react-native";
import { ITimelineItem } from "@/lib/types";
import styles from "./Timeline.style";

export interface TimelineProps {
  items: ITimelineItem[];
  variant?: "experience" | "education";
  isDark?: boolean;
}

export function Timeline({
  items,
  variant = "experience",
  isDark = true,
}: TimelineProps) {
  const isEducation = variant === "education";
  const cardBg = isDark ? "rgba(30,41,59,0.6)" : "#FFFFFF";
  const cardBorder = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)";
  const titleColor = isDark ? "#F1F5F9" : "#0F172A";
  const orgColor = isEducation ? "#8B5CF6" : "#3B82F6";
  const descColor = isDark ? "#94A3B8" : "#475569";
  const highlightColor = isDark ? "#64748B" : "#64748B";
  const locationColor = isDark ? "#475569" : "#94A3B8";

  return (
    <View
      style={styles.container}
      accessibilityRole="list"
      accessibilityLabel={`${variant} timeline`}
    >
      {items.map((item, index) => (
        <View key={item.id} style={styles.item}>
          <View style={styles.indicator}>
            <View
              style={[
                styles.dotWrapper,
                isEducation && styles.dotWrapperEducation,
              ]}
            >
              <View style={[styles.dot, isEducation && styles.dotEducation]} />
            </View>
            {index < items.length - 1 && <View style={styles.line} />}
          </View>
          <View
            style={[
              styles.card,
              { backgroundColor: cardBg, borderColor: cardBorder },
            ]}
          >
            <View style={styles.cardHeader}>
              <Text style={[styles.title, { color: titleColor }]}>
                {item.title}
              </Text>
              <View
                style={[
                  styles.dateBadge,
                  isEducation && styles.dateBadgeEducation,
                ]}
              >
                <Text
                  style={[styles.date, isEducation && styles.dateEducation]}
                >
                  {item.startDate} — {item.endDate || "Present"}
                </Text>
              </View>
            </View>
            <Text style={[styles.organization, { color: orgColor }]}>
              {item.organization}
            </Text>
            {item.location ? (
              <Text style={[styles.location, { color: locationColor }]}>
                📍 {item.location}
              </Text>
            ) : null}
            <Text style={[styles.description, { color: descColor }]}>
              {item.description}
            </Text>
            {item.highlights.length > 0 && (
              <View style={styles.highlights}>
                {item.highlights.map((highlight, i) => (
                  <View key={i} style={styles.highlight}>
                    <View
                      style={[
                        styles.highlightBullet,
                        isEducation && styles.highlightBulletEducation,
                      ]}
                    />
                    <Text
                      style={[styles.highlightText, { color: highlightColor }]}
                    >
                      {highlight}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      ))}
    </View>
  );
}
