import React from "react";
import { View, Text, Pressable } from "react-native";
import type { ISocialLink } from "@/lib/types/content";
import { Field } from "./Field";
import { S } from "./styles";

const PLATFORMS = [
  "github",
  "linkedin",
  "twitter",
  "instagram",
  "youtube",
  "email",
  "website",
];

interface SocialTabProps {
  links: ISocialLink[];
  onChange: (links: ISocialLink[]) => void;
}

export function SocialTab({ links, onChange }: SocialTabProps) {
  const updateField = (i: number, key: keyof ISocialLink, v: string) => {
    const next = [...links];
    next[i] = { ...next[i], [key]: v };
    onChange(next);
  };

  const remove = (i: number) => onChange(links.filter((_, j) => j !== i));
  const add = () => onChange([...links, { platform: "github", url: "" }]);

  return (
    <View style={S.card}>
      <Text style={S.cardTitle}>Social Links</Text>
      {links.map((link, i) => (
        <View key={i} style={S.listItem}>
          <View style={S.listItemHeader}>
            <Text style={S.listItemTitle}>
              {link.platform || `Link ${i + 1}`}
            </Text>
            <Pressable
              style={S.removeBtn}
              onPress={() => remove(i)}
              accessibilityRole="button"
              accessibilityLabel="Remove link"
            >
              <Text style={S.removeBtnText}>✕</Text>
            </Pressable>
          </View>

          <Text style={S.label}>Platform</Text>
          <View style={[S.skillsRow, { marginBottom: 12 }]}>
            {PLATFORMS.map((p) => (
              <Pressable
                key={p}
                onPress={() => updateField(i, "platform", p)}
                style={[
                  S.chip,
                  link.platform === p && {
                    backgroundColor: "rgba(37,99,235,0.25)",
                    borderColor: "#3B82F6",
                  },
                ]}
                accessibilityRole="button"
                accessibilityLabel={p}
              >
                <Text
                  style={[
                    S.chipText,
                    link.platform === p && { fontWeight: "700" },
                  ]}
                >
                  {p}
                </Text>
              </Pressable>
            ))}
          </View>

          <Field
            label="URL"
            value={link.url}
            onChange={(v) => updateField(i, "url", v)}
            placeholder="https://..."
          />
        </View>
      ))}
      <Pressable
        style={S.addBtn}
        onPress={add}
        accessibilityRole="button"
        accessibilityLabel="Add social link"
      >
        <Text style={S.addBtnText}>+ Add Social Link</Text>
      </Pressable>
    </View>
  );
}
