import React from "react";
import { View, Text } from "react-native";
import { AuroraBadge } from "../AuroraBadge";
import { styles } from "./TimelineItem.style";

export interface TimelineItemData {
  id: string;
  title: string;
  organization: string;
  location?: string;
  startDate: string;
  endDate?: string;
  description: string;
  highlights?: string[];
}

export interface TimelineItemProps {
  item: TimelineItemData;
  isActive?: boolean;
  isLast?: boolean;
}

export function TimelineItem({
  item,
  isActive = false,
  isLast = false,
}: TimelineItemProps) {
  const dateRange = item.endDate
    ? `${item.startDate} – ${item.endDate}`
    : `${item.startDate} – Present`;

  return (
    <View style={styles.container} role="listitem" accessibilityRole="none">
      {/* Timeline line + dot */}
      <View style={styles.lineCol}>
        <View style={[styles.dot, !isActive && styles.dotInactive]} />
        {!isLast && (
          <View style={[styles.line, isActive && styles.lineActive]} />
        )}
      </View>

      {/* Card */}
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>{item.title}</Text>
          {isActive && <AuroraBadge label="Active" variant="green" pulse />}
        </View>
        <Text style={styles.org}>{item.organization}</Text>
        <Text style={styles.dates}>
          {dateRange}
          {item.location ? ` · ${item.location}` : ""}
        </Text>
        <Text style={styles.description}>{item.description}</Text>
        {item.highlights && item.highlights.length > 0 && (
          <View style={styles.highlights}>
            {item.highlights.map((h, i) => (
              <View key={i} style={styles.highlight}>
                <Text style={styles.bullet}>▸</Text>
                <Text style={styles.highlightText}>{h}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}
