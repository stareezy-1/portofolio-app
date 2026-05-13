import React, { useState, useCallback } from "react";
import { View, Text, Image, Pressable, ActivityIndicator } from "react-native";
import type { IPortfolioContent } from "@/lib/types/content";
import { useUploadFile } from "@/lib/hooks/useAdmin";
import { Field } from "./Field";
import { S } from "./styles";

interface IdentityTabProps {
  form: Partial<IPortfolioContent>;
  set: (k: keyof IPortfolioContent, v: any) => void;
}

export function IdentityTab({ form, set }: IdentityTabProps) {
  const uploadFile = useUploadFile();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handlePhotoUpload = useCallback(async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/jpeg,image/png,image/webp";
    input.onchange = async (e: any) => {
      const file = e.target?.files?.[0];
      if (!file) return;
      setUploading(true);
      setUploadError(null);
      try {
        const result = await uploadFile.mutateAsync(file);
        set("avatarUrl", result.data.url);
      } catch {
        setUploadError("Upload failed. Use JPG, PNG, or WEBP under 5MB.");
      } finally {
        setUploading(false);
      }
    };
    input.click();
  }, [uploadFile, set]);

  return (
    <>
      {/* Photo */}
      <View style={S.card}>
        <Text style={S.cardTitle}>Professional Photo</Text>
        <View
          style={{ flexDirection: "row", gap: 20, alignItems: "flex-start" }}
        >
          {/* Preview */}
          <View style={{ alignItems: "center", gap: 12 }}>
            {form.avatarUrl ? (
              <Image
                source={{ uri: form.avatarUrl }}
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                  backgroundColor: "rgba(30,41,59,0.8)",
                }}
                accessibilityLabel="Profile photo preview"
              />
            ) : (
              <View
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                  backgroundColor: "rgba(30,41,59,0.8)",
                  borderWidth: 2,
                  borderColor: "rgba(255,255,255,0.08)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 40 }}>👤</Text>
              </View>
            )}
            <Pressable
              style={[S.addBtn, uploading && { opacity: 0.6 }]}
              onPress={handlePhotoUpload}
              disabled={uploading}
              accessibilityRole="button"
              accessibilityLabel="Upload photo"
            >
              {uploading ? (
                <ActivityIndicator size="small" color="#3B82F6" />
              ) : (
                <Text style={S.addBtnText}>
                  📷 {form.avatarUrl ? "Replace Photo" : "Upload Photo"}
                </Text>
              )}
            </Pressable>
            {uploadError && (
              <Text
                style={{
                  fontSize: 11,
                  color: "#EF4444",
                  textAlign: "center",
                  maxWidth: 140,
                }}
              >
                {uploadError}
              </Text>
            )}
          </View>

          {/* URL field */}
          <View style={{ flex: 1 }}>
            <Field
              label="Photo URL"
              value={form.avatarUrl ?? ""}
              onChange={(v) => set("avatarUrl", v || undefined)}
              placeholder="https://... or upload above"
              hint="Displayed in the hero section. Recommended: square image, at least 400×400px."
            />
          </View>
        </View>
      </View>

      {/* Identity */}
      <View style={S.card}>
        <Text style={S.cardTitle}>Identity</Text>
        <View style={S.row}>
          <Field
            label="Full Name"
            value={form.name ?? ""}
            onChange={(v) => set("name", v)}
            placeholder="Alex Johnson"
          />
          <Field
            label="Role / Title"
            value={form.role ?? ""}
            onChange={(v) => set("role", v)}
            placeholder="Full Stack Engineer"
          />
        </View>
        <Field
          label="Tagline"
          value={form.tagline ?? ""}
          onChange={(v) => set("tagline", v)}
          placeholder="Short tagline shown in hero section"
        />
        <Field
          label="Bio"
          value={form.bio ?? ""}
          onChange={(v) => set("bio", v)}
          placeholder="About me paragraph..."
          multiline
        />
        <View style={S.row}>
          <Field
            label="Email"
            value={form.email ?? ""}
            onChange={(v) => set("email", v)}
            placeholder="hello@example.com"
          />
          <Field
            label="Location"
            value={form.location ?? ""}
            onChange={(v) => set("location", v)}
            placeholder="San Francisco, CA"
          />
        </View>
      </View>

      {/* Stats */}
      <View style={S.card}>
        <Text style={S.cardTitle}>Stats</Text>
        <View style={S.row}>
          <Field
            label="Years of Experience"
            value={String(form.yearsOfExperience ?? 0)}
            onChange={(v) => set("yearsOfExperience", parseInt(v) || 0)}
            placeholder="5"
          />
          <Field
            label="Projects Built"
            value={String(form.projectsBuilt ?? 0)}
            onChange={(v) => set("projectsBuilt", parseInt(v) || 0)}
            placeholder="30"
          />
          <Field
            label="Happy Clients"
            value={String(form.happyClients ?? 0)}
            onChange={(v) => set("happyClients", parseInt(v) || 0)}
            placeholder="10"
          />
        </View>
      </View>
    </>
  );
}
