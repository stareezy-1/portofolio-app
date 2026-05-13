import React, { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { S } from "./styles";

interface SkillsEditorProps {
  skills: string[];
  onChange: (s: string[]) => void;
}

export function SkillsEditor({ skills, onChange }: SkillsEditorProps) {
  // Local draft state — lives in this component, not the parent
  const [draft, setDraft] = useState("");

  const add = () => {
    const t = draft.trim();
    if (t && !skills.includes(t)) {
      onChange([...skills, t]);
      setDraft("");
    }
  };

  const remove = (i: number) => onChange(skills.filter((_, j) => j !== i));

  return (
    <View style={S.field}>
      <Text style={S.label}>Skills</Text>
      <View style={S.hlRow}>
        <TextInput
          style={[S.input, { flex: 1 }]}
          value={draft}
          onChangeText={setDraft}
          placeholder="Type a skill and press +"
          placeholderTextColor="#334155"
          onSubmitEditing={add}
          accessibilityLabel="New skill"
        />
        <Pressable
          style={S.addBtn}
          onPress={add}
          accessibilityRole="button"
          accessibilityLabel="Add skill"
        >
          <Text style={S.addBtnText}>+</Text>
        </Pressable>
      </View>
      <View style={S.skillsRow}>
        {skills.map((s, i) => (
          <View key={i} style={S.chip}>
            <Text style={S.chipText}>{s}</Text>
            <Pressable
              onPress={() => remove(i)}
              accessibilityRole="button"
              accessibilityLabel={`Remove ${s}`}
            >
              <Text style={S.chipRemove}>✕</Text>
            </Pressable>
          </View>
        ))}
      </View>
    </View>
  );
}
