import React from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { AuroraBadge } from "../../molecules/AuroraBadge";
import { styles } from "./HireMeSection.style";

export function HireMeSection() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {typeof window !== "undefined" && (
        <style>{`
          .hire-section-bg {
            background: linear-gradient(135deg, #050505 0%, #1a1a2e 100%);
          }
        `}</style>
      )}
      <View style={styles.badge}>
        <AuroraBadge label="Available for hire" variant="green" pulse />
      </View>
      <Text style={styles.heading}>Let&apos;s Build Something Great</Text>
      <Text style={styles.sub}>
        I&apos;m currently open to new opportunities — freelance projects,
        full-time roles, or consulting. If you have an idea, let&apos;s talk.
      </Text>
      <Pressable
        style={styles.btn}
        onPress={() => router.push("/hire" as any)}
        accessibilityRole="link"
        accessibilityLabel="Let's Work Together"
      >
        <Text style={styles.btnText}>Let&apos;s Work Together →</Text>
      </Pressable>
    </View>
  );
}
