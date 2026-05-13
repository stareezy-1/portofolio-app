import React from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import styles from "./+not-found.style";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <View
      style={styles.container}
      accessible
      accessibilityLabel="Page not found"
    >
      <Text style={styles.code}>404</Text>
      <Text style={styles.title}>Page Not Found</Text>
      <Text style={styles.description}>
        The page you're looking for doesn't exist or has been moved.
      </Text>
      <Pressable
        style={styles.button}
        onPress={() => router.replace("/" as any)}
        accessibilityRole="button"
        accessibilityLabel="Go back to home"
      >
        <Text style={styles.buttonText}>← Back to Home</Text>
      </Pressable>
    </View>
  );
}
