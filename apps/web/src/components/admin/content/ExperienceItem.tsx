import React from "react";
import { View, Text, Pressable } from "react-native";
import type { IWorkExperience, IEducation } from "@/lib/types/content";
import { Field } from "./Field";
import { HighlightsEditor } from "./HighlightsEditor";
import { S } from "./styles";

type ExpItem = IWorkExperience | IEducation;

interface ExperienceItemProps {
  item: ExpItem;
  index: number;
  noun: string;
  onUpdate: (i: number, key: string, v: any) => void;
  onRemove: (i: number) => void;
}

export function ExperienceItem({
  item,
  index,
  noun,
  onUpdate,
  onRemove,
}: ExperienceItemProps) {
  const u = (key: string, v: any) => onUpdate(index, key, v);

  return (
    <View style={S.listItem}>
      <View style={S.listItemHeader}>
        <Text style={S.listItemTitle}>
          {item.title || `${noun} ${index + 1}`}
        </Text>
        <Pressable
          style={S.removeBtn}
          onPress={() => onRemove(index)}
          accessibilityRole="button"
          accessibilityLabel={`Remove ${noun}`}
        >
          <Text style={S.removeBtnText}>✕</Text>
        </Pressable>
      </View>

      <View style={S.row}>
        <Field
          label="Title"
          value={item.title}
          onChange={(v) => u("title", v)}
          placeholder={
            noun === "Education" ? "B.Sc. Computer Science" : "Senior Engineer"
          }
        />
        <Field
          label={noun === "Education" ? "Institution" : "Organization"}
          value={item.organization}
          onChange={(v) => u("organization", v)}
          placeholder={
            noun === "Education" ? "University Name" : "Company Name"
          }
        />
      </View>

      <View style={S.row}>
        <Field
          label="Location"
          value={item.location ?? ""}
          onChange={(v) => u("location", v || undefined)}
          placeholder="San Francisco, CA"
        />
        <Field
          label="Start Date"
          value={item.startDate}
          onChange={(v) => u("startDate", v)}
          placeholder="2022"
        />
        <Field
          label="End Date"
          value={item.endDate ?? ""}
          onChange={(v) => u("endDate", v || undefined)}
          placeholder="2024 (blank = Present)"
        />
      </View>

      <Field
        label="Description"
        value={item.description}
        onChange={(v) => u("description", v)}
        placeholder="What you did..."
        multiline
      />

      <HighlightsEditor
        highlights={item.highlights ?? []}
        onChange={(h) => u("highlights", h)}
      />
    </View>
  );
}
