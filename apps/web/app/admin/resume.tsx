import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useResume } from "@/lib/hooks/useResume";
import { useUploadResume } from "@/lib/hooks/useAdmin";
import styles from "./resume.style";

export default function AdminResumePage() {
  const { data, isLoading, refetch } = useResume();
  const uploadResume = useUploadResume();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const resume = data?.data;
  const hasPDF = !!resume?.pdfUrl;

  const handleUpload = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/pdf,.pdf";
    input.onchange = async (e: any) => {
      const file = e.target?.files?.[0];
      if (!file) return;
      setError(null);
      setSuccess(false);
      try {
        await uploadResume.mutateAsync(file);
        setSuccess(true);
        refetch();
      } catch (err: any) {
        const msg =
          err?.response?.data?.error?.message ??
          err?.message ??
          "Upload failed. Ensure the file is a PDF under 10MB.";
        setError(msg);
      }
    };
    input.click();
  }, [uploadResume, refetch]);

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Content Management</Text>
        <Text style={styles.title}>Resume PDF</Text>
        <Text style={styles.subtitle}>
          Upload your resume so visitors can download it.
        </Text>
      </View>

      {/* Feedback */}
      {error && (
        <View style={styles.errorBanner}>
          <Text>⚠️</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      {success && (
        <View style={styles.successBanner}>
          <Text>✓</Text>
          <Text style={styles.successText}>Resume uploaded successfully!</Text>
        </View>
      )}

      {/* Current Status */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardIcon}>📄</Text>
          <View style={styles.cardTitleGroup}>
            <Text style={styles.sectionTitle}>Current Resume</Text>
            <Text style={styles.sectionSubtitle}>
              {hasPDF
                ? "A PDF is currently uploaded and available for download."
                : "No PDF uploaded yet."}
            </Text>
          </View>
        </View>

        <View style={styles.statusRow}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: hasPDF ? "#22C55E" : "#EF4444" },
            ]}
          />
          <Text style={styles.statusText}>
            {hasPDF
              ? "PDF available for download"
              : "No PDF — download button is hidden from visitors"}
          </Text>
        </View>

        {hasPDF && (
          <>
            <View style={styles.metadataRow}>
              <Text style={styles.metadataLabel}>File</Text>
              <Pressable
                onPress={() => {
                  if (typeof window !== "undefined")
                    window.open(resume!.pdfUrl!, "_blank");
                }}
                accessibilityRole="link"
                accessibilityLabel="View current resume PDF"
              >
                <Text style={styles.linkText}>View PDF →</Text>
              </Pressable>
            </View>
            {resume?.updatedAt && (
              <View style={styles.metadataRow}>
                <Text style={styles.metadataLabel}>Updated</Text>
                <Text style={styles.metadataValue}>
                  {new Date(resume.updatedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Text>
              </View>
            )}
          </>
        )}
      </View>

      {/* Upload */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardIcon}>📤</Text>
          <View style={styles.cardTitleGroup}>
            <Text style={styles.sectionTitle}>
              {hasPDF ? "Replace Resume" : "Upload Resume"}
            </Text>
            <Text style={styles.sectionSubtitle}>
              PDF format, maximum 10MB.
            </Text>
          </View>
        </View>

        <View style={styles.uploadZone}>
          <Text style={styles.uploadZoneIcon}>📁</Text>
          <Text style={styles.uploadZoneTitle}>
            {hasPDF
              ? "Upload a new PDF to replace the current one"
              : "Upload your resume PDF"}
          </Text>
          <Text style={styles.uploadZoneDesc}>
            Click the button below to select a PDF file from your computer.
            {"\n"}
            Accepted format: PDF · Max size: 10MB
          </Text>
          <Pressable
            style={[
              styles.uploadButton,
              uploadResume.isPending && styles.uploadButtonDisabled,
            ]}
            onPress={handleUpload}
            disabled={uploadResume.isPending}
            accessibilityRole="button"
            accessibilityLabel={
              hasPDF ? "Replace resume PDF" : "Upload resume PDF"
            }
          >
            {uploadResume.isPending ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.uploadButtonText}>
                {hasPDF ? "📤 Replace PDF" : "📤 Upload PDF"}
              </Text>
            )}
          </Pressable>
        </View>

        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>💡</Text>
          <Text style={styles.tipText}>
            After uploading, the download button will automatically appear on
            the public resume page. Make sure your PDF is up to date before
            sharing your portfolio link.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
