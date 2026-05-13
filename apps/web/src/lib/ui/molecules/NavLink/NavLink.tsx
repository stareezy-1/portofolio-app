import React from "react";
import { Pressable, Text } from "react-native";
import styles from "./NavLink.style";

export interface NavLinkProps {
  label: string;
  href: string;
  active?: boolean;
  isDark?: boolean;
  onPress?: () => void;
}

export function NavLink({
  label,
  active = false,
  isDark = true,
  onPress,
}: NavLinkProps) {
  return (
    <Pressable
      style={[
        styles.container,
        active && (isDark ? styles.active : styles.activeDark),
      ]}
      onPress={onPress}
      accessibilityRole="link"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
    >
      <Text
        style={[
          styles.label,
          !isDark && styles.labelDark,
          active && styles.activeLabel,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}
