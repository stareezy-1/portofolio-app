import React from "react";
import { View } from "react-native";
import { Skeleton } from "../../atoms/Skeleton";
import styles from "./SkeletonCard.style";

export function SkeletonCard() {
  return (
    <View style={styles.container} accessibilityLabel="Loading project card">
      <Skeleton width="100%" height={160} borderRadius={0} />
      <View style={styles.content}>
        <Skeleton width="70%" height={18} borderRadius={4} />
        <Skeleton width="100%" height={14} borderRadius={4} />
        <Skeleton width="90%" height={14} borderRadius={4} />
        <View style={styles.tags}>
          <Skeleton width={60} height={22} borderRadius={12} />
          <Skeleton width={50} height={22} borderRadius={12} />
          <Skeleton width={70} height={22} borderRadius={12} />
        </View>
      </View>
    </View>
  );
}
