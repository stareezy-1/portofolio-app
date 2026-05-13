import React from "react";
import { Pressable, Text, ActivityIndicator } from "react-native";
import styles from "./Button.style";

export interface ButtonProps {
  label: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export function Button({
  label,
  variant = "primary",
  size = "md",
  onPress,
  disabled = false,
  loading = false,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      style={[
        styles.container,
        styles[variant],
        styles[size],
        isDisabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isDisabled }}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "outline" ? "#2563EB" : "#FFFFFF"}
        />
      ) : (
        <Text
          style={[styles.label, variant === "outline" && styles.labelOutline]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}
