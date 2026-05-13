import React from "react";
import { Pressable, Text } from "react-native";
import styles from "./SocialLink.style";

export interface SocialLinkProps {
  platform: string;
  url: string;
  onPress?: () => void;
}

function getPlatformIcon(platform: string): string {
  switch (platform.toLowerCase()) {
    case "github":
      return "🐙";
    case "linkedin":
      return "💼";
    case "twitter":
      return "🐦";
    case "email":
      return "✉️";
    default:
      return "🔗";
  }
}

export function SocialLink({ platform, url, onPress }: SocialLinkProps) {
  return (
    <Pressable
      style={styles.container}
      onPress={onPress}
      accessibilityRole="link"
      accessibilityLabel={`Visit ${platform} profile`}
      accessibilityHint={`Opens ${url}`}
    >
      <Text style={styles.icon}>{getPlatformIcon(platform)}</Text>
    </Pressable>
  );
}
