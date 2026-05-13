import React from "react";
import { View, Text, Pressable } from "react-native";
import type { ITechCategory } from "@/lib/types/content";
import { Field } from "./Field";
import { SkillsEditor } from "./SkillsEditor";
import { S } from "./styles";

const ICONS = ["🎨", "⚙️", "📱", "🛠️", "🗄️", "☁️", "🔒", "📊", "🤖", "🌐"];

interface TechTabProps {
  stack: ITechCategory[];
  onChange: (stack: ITechCategory[]) => void;
}

export function TechTab({ stack, onChange }: TechTabProps) {
  const updateField = (i: number, key: keyof ITechCategory, v: any) => {
    const next = [...stack];
    next[i] = { ...next[i], [key]: v };
    onChange(next);
  };

  const remove = (i: number) => onChange(stack.filter((_, j) => j !== i));
  const add = () =>
    onChange([...stack, { category: "", icon: "🛠️", skills: [] }]);

  return (
    <View style={S.card}>
      <Text style={S.cardTitle}>Tech Stack Categories</Text>
      {stack.map((cat, i) => (
        <View key={i} style={S.listItem}>
          <View style={S.listItemHeader}>
            <Text style={S.listItemTitle}>
              {cat.icon} {cat.category || `Category ${i + 1}`}
            </Text>
            <Pressable
              style={S.removeBtn}
              onPress={() => remove(i)}
              accessibilityRole="button"
              accessibilityLabel="Remove category"
            >
              <Text style={S.removeBtnText}>✕</Text>
            </Pressable>
          </View>

          <View style={S.row}>
            <Field
              label="Category Name"
              value={cat.category}
              onChange={(v) => updateField(i, "category", v)}
              placeholder="Frontend"
            />
            <View style={S.field}>
              <Text style={S.label}>Icon</Text>
              <View style={S.skillsRow}>
                {ICONS.map((ic) => (
                  <Pressable
                    key={ic}
                    onPress={() => updateField(i, "icon", ic)}
                    style={[
                      S.chip,
                      cat.icon === ic && {
                        backgroundColor: "rgba(37,99,235,0.25)",
                        borderColor: "#3B82F6",
                      },
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel={ic}
                  >
                    <Text style={{ fontSize: 18 }}>{ic}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>

          <SkillsEditor
            skills={cat.skills}
            onChange={(s) => updateField(i, "skills", s)}
          />
        </View>
      ))}
      <Pressable
        style={S.addBtn}
        onPress={add}
        accessibilityRole="button"
        accessibilityLabel="Add category"
      >
        <Text style={S.addBtnText}>+ Add Category</Text>
      </Pressable>
    </View>
  );
}
