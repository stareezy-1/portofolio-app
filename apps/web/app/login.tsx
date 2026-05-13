import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { apiClient } from "@/lib/utils/api-client";
import { useAuthStore } from "../src/stores/auth-store";
import styles from "./login.style";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await apiClient.post("/admin/login", {
        email,
        password,
      });
      const token = response.data.token ?? response.data.data?.token;
      login(token);
      router.replace("/admin/projects" as any);
    } catch (err: any) {
      const message =
        err?.response?.data?.error?.message ??
        err?.response?.data?.message ??
        "Invalid credentials";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [email, password, login, router]);

  return (
    <View style={styles.container} accessible accessibilityLabel="Login page">
      <View style={styles.glow} />
      <View style={styles.logoRow}>
        <View style={styles.logoDot} />
        <Text style={styles.logoText}>Portfolio</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to manage your portfolio</Text>

        {error && (
          <Text style={styles.errorText} accessibilityRole="alert">
            {error}
          </Text>
        )}

        <Text style={styles.label} nativeID="email-label">
          Email
        </Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="admin@example.com"
          placeholderTextColor="#334155"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          accessibilityLabel="Email"
          accessibilityLabelledBy="email-label"
        />

        <Text style={styles.label} nativeID="password-label">
          Password
        </Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          placeholderTextColor="#334155"
          secureTextEntry
          autoComplete="current-password"
          accessibilityLabel="Password"
          accessibilityLabelledBy="password-label"
        />

        <Pressable
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
          accessibilityRole="button"
          accessibilityLabel="Sign in"
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Sign In →</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}
