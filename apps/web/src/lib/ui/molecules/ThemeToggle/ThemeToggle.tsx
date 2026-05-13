import React from "react";
import { Pressable, Text } from "react-native";
import styles from "./ThemeToggle.style";

export interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
  return (
    <Pressable
      style={[styles.container, isDark ? styles.dark : styles.light]}
      onPress={onToggle}
      accessibilityRole="switch"
      accessibilityLabel="Toggle dark mode"
      accessibilityState={{ checked: isDark }}
    >
      <Text style={styles.icon}>{isDark ? "🌙" : "☀️"}</Text>
    </Pressable>
  );
}
