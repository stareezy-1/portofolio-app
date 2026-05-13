import React from "react";
import { View, Text, TextInput } from "react-native";
import { S } from "./styles";

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
  hint?: string;
}

// Module-level component — never recreated on parent re-render, preserves focus
export function Field({
  label,
  value,
  onChange,
  placeholder,
  multiline,
  hint,
}: FieldProps) {
  return (
    <View style={S.field}>
      <Text style={S.label}>{label}</Text>
      <TextInput
        style={[S.input, multiline ? S.textArea : null]}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="#334155"
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
        accessibilityLabel={label}
      />
      {hint ? <Text style={S.hint}>{hint}</Text> : null}
    </View>
  );
}
