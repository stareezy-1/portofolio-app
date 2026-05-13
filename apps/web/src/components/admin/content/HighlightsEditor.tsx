import React from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { S } from "./styles";

interface HighlightsEditorProps {
  highlights: string[];
  onChange: (h: string[]) => void;
}

export function HighlightsEditor({
  highlights,
  onChange,
}: HighlightsEditorProps) {
  const update = (i: number, v: string) => {
    const next = [...highlights];
    next[i] = v;
    onChange(next);
  };

  const remove = (i: number) => onChange(highlights.filter((_, j) => j !== i));
  const add = () => onChange([...highlights, ""]);

  return (
    <View style={S.field}>
      <Text style={S.label}>Highlights</Text>
      {highlights.map((h, i) => (
        <View key={i} style={S.hlRow}>
          <TextInput
            style={[S.input, { flex: 1 }]}
            value={h}
            onChangeText={(v) => update(i, v)}
            placeholder={`Highlight ${i + 1}`}
            placeholderTextColor="#334155"
            accessibilityLabel={`Highlight ${i + 1}`}
          />
          <Pressable
            style={S.removeBtn}
            onPress={() => remove(i)}
            accessibilityRole="button"
            accessibilityLabel="Remove highlight"
          >
            <Text style={S.removeBtnText}>✕</Text>
          </Pressable>
        </View>
      ))}
      <Pressable
        style={S.addBtn}
        onPress={add}
        accessibilityRole="button"
        accessibilityLabel="Add highlight"
      >
        <Text style={S.addBtnText}>+ Add Highlight</Text>
      </Pressable>
    </View>
  );
}
