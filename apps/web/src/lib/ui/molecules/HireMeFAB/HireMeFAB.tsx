"use client";
import React from "react";
import { Pressable, Text } from "react-native";
import { usePathname, useRouter } from "expo-router";
import { styles } from "./HireMeFAB.style";

/** Pure helper — exported for property tests */
export function shouldShowFAB(pathname: string): boolean {
  return pathname !== "/hire";
}

export function HireMeFAB() {
  const pathname = usePathname();
  const router = useRouter();

  if (!shouldShowFAB(pathname)) return null;

  return (
    <Pressable
      style={styles.fab}
      onPress={() => router.push("/hire" as any)}
      accessibilityRole="button"
      accessibilityLabel="Contact me for hire"
    >
      <Text style={styles.icon}>✉</Text>
      <Text style={styles.label}>Hire Me</Text>
    </Pressable>
  );
}
