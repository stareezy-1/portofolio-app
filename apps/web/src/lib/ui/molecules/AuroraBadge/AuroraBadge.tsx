"use client";
import React, { useEffect, useRef } from "react";
import { View, Text, Animated } from "react-native";
import { aurora } from "@/lib/constants/aurora";
import { styles } from "./AuroraBadge.style";

export type AuroraBadgeVariant =
  | "green"
  | "purple"
  | "amber"
  | "red"
  | "default";

export interface AuroraBadgeProps {
  label: string;
  variant?: AuroraBadgeVariant;
  pulse?: boolean;
}

const VARIANT_COLORS: Record<
  AuroraBadgeVariant,
  { dot: string; text: string }
> = {
  green: { dot: aurora.auroraGreen.value, text: aurora.auroraGreen.value },
  purple: { dot: aurora.nebulaPurple.value, text: aurora.nebulaPurple.value },
  amber: { dot: aurora.warningAmber.value, text: aurora.warningAmber.value },
  red: { dot: aurora.errorRed.value, text: aurora.errorRed.value },
  default: { dot: aurora.textMuted.value, text: aurora.textSecondary.value },
};

export function AuroraBadge({
  label,
  variant = "green",
  pulse = false,
}: AuroraBadgeProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const colors = VARIANT_COLORS[variant];

  useEffect(() => {
    if (!pulse) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse, pulseAnim]);

  return (
    <View style={[styles.container, styles[variant]]}>
      {pulse ? (
        <Animated.View
          style={[
            styles.dot,
            { backgroundColor: colors.dot, opacity: pulseAnim },
          ]}
        />
      ) : (
        <View style={[styles.dot, { backgroundColor: colors.dot }]} />
      )}
      <Text style={[styles.text, { color: colors.text }]}>{label}</Text>
    </View>
  );
}
