import React from "react";
import { View, Text, Pressable } from "react-native";
import type { IWorkExperience } from "@/lib/types/content";
import { ExperienceItem } from "./ExperienceItem";
import { S } from "./styles";

interface WorkTabProps {
  items: IWorkExperience[];
  onChange: (items: IWorkExperience[]) => void;
}

export function WorkTab({ items, onChange }: WorkTabProps) {
  const update = (i: number, key: string, v: any) => {
    const next = [...items];
    (next[i] as any)[key] = v;
    onChange(next);
  };

  const remove = (i: number) => onChange(items.filter((_, j) => j !== i));

  const add = () =>
    onChange([
      ...items,
      {
        id: String(Date.now()),
        title: "",
        organization: "",
        startDate: "",
        description: "",
        highlights: [],
      },
    ]);

  return (
    <View style={S.card}>
      <Text style={S.cardTitle}>Work Experience</Text>
      {items.map((item, i) => (
        <ExperienceItem
          key={item.id || i}
          item={item}
          index={i}
          noun="Experience"
          onUpdate={update}
          onRemove={remove}
        />
      ))}
      <Pressable
        style={S.addBtn}
        onPress={add}
        accessibilityRole="button"
        accessibilityLabel="Add experience"
      >
        <Text style={S.addBtnText}>+ Add Experience</Text>
      </Pressable>
    </View>
  );
}
