import React from "react";
import { View, TextInput, Text } from "react-native";
import styles from "./Input.style";

export interface InputProps {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
  error?: string;
  label?: string;
  secureTextEntry?: boolean;
  multiline?: boolean;
  editable?: boolean;
}

export function Input({
  value,
  onChange,
  placeholder,
  error,
  label,
  secureTextEntry = false,
  multiline = false,
  editable = true,
}: InputProps) {
  const inputId = label ? label.toLowerCase().replace(/\s+/g, "-") : undefined;

  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label} accessibilityRole="text">
          {label}
        </Text>
      )}
      <TextInput
        style={[styles.input, error ? styles.inputError : undefined]}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        editable={editable}
        accessibilityLabel={label || placeholder}
        accessibilityRole="text"
        accessibilityState={{ disabled: !editable }}
        nativeID={inputId}
      />
      {error && (
        <Text style={styles.error} accessibilityRole="alert">
          {error}
        </Text>
      )}
    </View>
  );
}
