import React from "react";
import { View, Text } from "react-native";
import styles from "./FormField.style";

export interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

export function FormField({
  label,
  error,
  required = false,
  children,
}: FormFieldProps) {
  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label} accessibilityRole="text">
          {label}
        </Text>
        {required && (
          <Text style={styles.required} accessibilityLabel="required">
            *
          </Text>
        )}
      </View>
      {children}
      {error && (
        <Text style={styles.error} accessibilityRole="alert">
          {error}
        </Text>
      )}
    </View>
  );
}
