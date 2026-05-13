import React from "react";
import { Text as RNText, TextProps as RNTextProps } from "react-native";
import styles from "./Text.style";

export type TextVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "body"
  | "caption";

export interface TextProps extends RNTextProps {
  variant?: TextVariant;
  color?: string;
  children: React.ReactNode;
}

export function Text({
  variant = "body",
  color,
  style,
  children,
  ...rest
}: TextProps) {
  return (
    <RNText
      style={[styles[variant], color ? { color } : undefined, style]}
      accessibilityRole={variant.startsWith("h") ? "header" : "text"}
      {...rest}
    >
      {children}
    </RNText>
  );
}
