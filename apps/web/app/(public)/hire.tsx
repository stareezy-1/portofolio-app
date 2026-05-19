import React from "react";
import { View, Text, Pressable, Linking } from "react-native";
import Head from "expo-router/head";
import { ContactForm } from "@/lib/ui/organisms/ContactForm";
import { AuroraBadge } from "@/lib/ui/molecules/AuroraBadge";
import { useContent } from "@/lib/hooks/useContent";
import { aurora } from "@/lib/constants/aurora";

export default function HirePage() {
  const { data: content } = useContent();
  const email = content?.email ?? "bintangmuhammad12@gmail.com";
  const socialLinks = content?.socialLinks ?? [
    { platform: "GitHub", url: "https://github.com/stareezy-1" },
    {
      platform: "LinkedIn",
      url: "https://id.linkedin.com/in/muhammad-bintang-al-akbar-72302812a",
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: aurora.deepSpace.value }}>
      <Head>
        <title>Hire Me — Muhammad Bintang Al Akbar</title>
        <meta
          name="description"
          content="Available for freelance projects, full-time roles, and consulting. Let's build something great together."
        />
        <link rel="canonical" href="https://stareezy.tech/hire" />
      </Head>

      {/* Hero */}
      <View
        style={{
          paddingHorizontal: 32,
          paddingTop: 72,
          paddingBottom: 48,
          alignItems: "center",
          maxWidth: 720,
          width: "100%" as any,
          alignSelf: "center",
        }}
      >
        <View style={{ marginBottom: 24 }}>
          <AuroraBadge label="Available for hire" variant="green" pulse />
        </View>
        <Text
          style={{
            fontSize: 38,
            fontWeight: "800",
            color: aurora.starWhite.value,
            textAlign: "center",
            letterSpacing: -0.8,
            marginBottom: 14,
          }}
        >
          Let&apos;s Work Together
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: aurora.textSecondary.value,
            textAlign: "center",
            lineHeight: 26,
            maxWidth: 500,
          }}
        >
          I&apos;m open to freelance projects, full-time opportunities, and
          consulting engagements. Fill out the form below and I&apos;ll get back
          to you within 24 hours.
        </Text>
      </View>

      {/* Contact form */}
      <ContactForm />

      {/* Direct contact */}
      <View
        style={{
          paddingHorizontal: 32,
          paddingVertical: 40,
          borderTopWidth: 1,
          borderTopColor: aurora.borderSubtle.value,
          alignItems: "center",
          gap: 16,
          maxWidth: 720,
          width: "100%" as any,
          alignSelf: "center",
        }}
      >
        <Text
          style={{
            fontSize: 14,
            color: aurora.textMuted.value,
            textAlign: "center",
            marginBottom: 4,
          }}
        >
          Prefer to reach out directly?
        </Text>
        <Pressable
          onPress={() => Linking.openURL(`mailto:${email}`)}
          accessibilityRole="link"
          accessibilityLabel={`Email ${email}`}
          style={{
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 10,
            borderWidth: 1.5,
            borderColor: aurora.auroraGreen.value,
            backgroundColor: `${aurora.auroraGreen.value}10`,
          }}
        >
          <Text
            style={{
              color: aurora.auroraGreen.value,
              fontWeight: "700",
              fontSize: 14,
            }}
          >
            ✉ {email}
          </Text>
        </Pressable>
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            flexWrap: "wrap",
            justifyContent: "center",
            marginTop: 4,
          }}
        >
          {socialLinks.map((link) => (
            <Pressable
              key={link.platform}
              onPress={() => Linking.openURL(link.url)}
              accessibilityRole="link"
              accessibilityLabel={`Visit ${link.platform}`}
              style={{
                paddingHorizontal: 18,
                paddingVertical: 10,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: aurora.borderSubtle.value,
                backgroundColor: `${aurora.borderSubtle.value}40`,
              }}
            >
              <Text
                style={{
                  color: aurora.textSecondary.value,
                  fontSize: 13,
                  fontWeight: "600",
                }}
              >
                {link.platform} ↗
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}
