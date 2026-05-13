import React from "react";
import { View } from "react-native";
import styles from "./Icon.style";

export interface IconProps {
  name: string;
  size?: number;
  color?: string;
}

export function Icon({ name, size = 24 }: IconProps) {
  return (
    <View
      style={[styles.container, { width: size, height: size }]}
      accessibilityRole="image"
      accessibilityLabel={name}
    />
  );
}
