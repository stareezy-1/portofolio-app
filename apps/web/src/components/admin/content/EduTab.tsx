import React from "react";
import { View, Text, Pressable } from "react-native";
import type { IEducation } from "@/lib/types/content";
import { ExperienceItem } from "./ExperienceItem";
import { S } from "./styles";

interface EduTabProps {
  items: IEducation[];
  onChange: (items: IEducation[]) => void;
}

export function EduTab({ items, onChange }: EduTabProps) {
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
      <Text style={S.cardTitle}>Education</Text>
      {items.map((item, i) => (
        <ExperienceItem
          key={item.id || i}
          item={item}
          index={i}
          noun="Education"
          onUpdate={update}
          onRemove={remove}
        />
      ))}
      <Pressable
        style={S.addBtn}
        onPress={add}
        accessibilityRole="button"
        accessibilityLabel="Add education"
      >
        <Text style={S.addBtnText}>+ Add Education</Text>
      </Pressable>
    </View>
  );
}
