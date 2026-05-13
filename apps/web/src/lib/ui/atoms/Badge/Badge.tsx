import React from "react";
import { View, Text } from "react-native";
import styles from "./Badge.style";

export interface BadgeProps {
  label: string;
  variant?: "tech" | "status";
}

export function Badge({ label, variant = "tech" }: BadgeProps) {
  return (
    <View style={[styles.container, styles[variant]]} accessibilityRole="text">
      <Text
        style={[
          styles.label,
          styles[`${variant}Label` as keyof typeof styles] as object,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}
