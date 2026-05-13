import React from "react";
import { View } from "react-native";
import styles from "./Skeleton.style";

export interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
}

export function Skeleton({
  width = "100%",
  height = 20,
  borderRadius = 4,
}: SkeletonProps) {
  return (
    <View
      style={[
        styles.container,
        { width: width as number, height: height as number, borderRadius },
      ]}
      accessibilityRole="none"
      accessibilityLabel="Loading"
    />
  );
}
