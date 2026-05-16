import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Linking,
  ActivityIndicator,
} from "react-native";
import Head from "expo-router/head";
import { useResume } from "@/lib/hooks/useResume";
import { useMetadata } from "../../src/components/MetaHead";
import styles from "./resume.style";

export default function ResumePage() {
  const { data, isLoading } = useResume();
  const [showViewer, setShowViewer] = useState(true);

  useMetadata({
    title: "Resume",
    description: "View and download my professional resume",
    url: "/resume",
  });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  const pdfUrl = data?.data?.pdfUrl;

  return (
    <View style={styles.container} accessible accessibilityLabel="Resume page">
      <Head>
        <title>Resume — Muhammad Bintang Al Akbar | Stareezy</title>
        <meta
          name="description"
          content="Resume of Muhammad Bintang Al Akbar — Front-End Developer with 3+ years experience in React, React Native, TypeScript, Expo, Go and Supabase."
        />
        <meta property="og:title" content="Resume — Stareezy Portfolio" />
        <meta
          property="og:description"
          content="Resume of Muhammad Bintang Al Akbar — Front-End Developer."
        />
        <meta
          property="og:url"
          content="https://stareezy.tech/resume"
        />
        <link
          rel="canonical"
          href="https://stareezy.tech/resume"
        />
      </Head>
      <Text style={styles.eyebrow}>My Resume</Text>
      <Text style={[styles.heading, { color: "#F8FAFC" }]}>
        Curriculum Vitae
      </Text>
      <Text style={[styles.subheading, { color: "#64748B" }]}>
        View my full resume below or download a copy.
      </Text>

      {pdfUrl ? (
        <>
          <View
            style={{
              flexDirection: "row",
              gap: 12,
              marginBottom: 32,
              flexWrap: "wrap",
            }}
          >
            <Pressable
              style={[styles.downloadButton, { backgroundColor: "#2563EB" }]}
              onPress={() => Linking.openURL(pdfUrl)}
              accessibilityRole="button"
              accessibilityLabel="Download resume as PDF"
            >
              <Text style={{ fontSize: 16 }}>⬇️</Text>
              <Text style={styles.downloadButtonText}>Download PDF</Text>
            </Pressable>

            <Pressable
              style={[
                styles.downloadButton,
                {
                  backgroundColor: "rgba(30,41,59,0.8)",
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.1)",
                },
              ]}
              onPress={() => {
                if (typeof window !== "undefined")
                  window.open(pdfUrl, "_blank");
              }}
              accessibilityRole="link"
              accessibilityLabel="Open resume in new tab"
            >
              <Text style={{ fontSize: 16 }}>↗️</Text>
              <Text style={[styles.downloadButtonText, { color: "#94A3B8" }]}>
                Open in New Tab
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.downloadButton,
                {
                  backgroundColor: "rgba(59,130,246,0.08)",
                  borderWidth: 1,
                  borderColor: "rgba(59,130,246,0.25)",
                },
              ]}
              onPress={() => setShowViewer((v) => !v)}
              accessibilityRole="button"
              accessibilityLabel={
                showViewer ? "Hide PDF viewer" : "Show PDF viewer"
              }
            >
              <Text style={{ fontSize: 16 }}>{showViewer ? "🙈" : "👁️"}</Text>
              <Text style={[styles.downloadButtonText, { color: "#3B82F6" }]}>
                {showViewer ? "Hide Preview" : "Show Preview"}
              </Text>
            </Pressable>
          </View>

          {showViewer && (
            <View
              style={{
                borderRadius: 16,
                overflow: "hidden",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.08)",
                backgroundColor: "#1E293B",
                marginBottom: 24,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: "rgba(255,255,255,0.06)",
                }}
              >
                <Text
                  style={{ fontSize: 13, fontWeight: "600", color: "#64748B" }}
                >
                  📄 Resume Preview
                </Text>
                <Text style={{ fontSize: 11, color: "#334155" }}>
                  Scroll to read · Use buttons above to download
                </Text>
              </View>
              {typeof document !== "undefined" ? (
                <iframe
                  src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1`}
                  width="100%"
                  height={900}
                  style={{
                    border: "none",
                    display: "block",
                    backgroundColor: "#fff",
                  }}
                  title="Resume PDF"
                />
              ) : null}
            </View>
          )}
        </>
      ) : (
        <View
          style={{
            backgroundColor: "rgba(30,41,59,0.4)",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.05)",
            borderRadius: 16,
            padding: 48,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 48, marginBottom: 16 }}>📋</Text>
          <Text
            style={{
              fontSize: 16,
              color: "#475569",
              textAlign: "center",
              lineHeight: 24,
            }}
          >
            Resume PDF is not available yet.{"\n"}Check back soon!
          </Text>
        </View>
      )}
    </View>
  );
}
