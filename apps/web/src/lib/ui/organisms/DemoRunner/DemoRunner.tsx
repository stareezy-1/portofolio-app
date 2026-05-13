import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { IProject } from "@/lib/types/project";
import { EmulatorView } from "../EmulatorView";
import styles from "./DemoRunner.style";

export interface DemoRunnerProps {
  project: IProject;
}

export function DemoRunner({ project }: DemoRunnerProps) {
  const [webFailed, setWebFailed] = useState(false);
  const [mobileFailed, setMobileFailed] = useState(false);

  if (!project.demoMode) return null;

  if (project.type === "web") {
    if (webFailed || !project.liveUrl) {
      return (
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Live Demo</Text>
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>WEB</Text>
            </View>
          </View>
          <View style={styles.fallback}>
            <Text style={styles.fallbackIcon}>🌐</Text>
            <Text style={styles.fallbackTitle}>Demo Unavailable</Text>
            <Text style={styles.fallbackText}>
              The live demo could not be loaded in the browser.
            </Text>
            {project.liveUrl && (
              <Pressable
                style={styles.fallbackButton}
                onPress={() => {
                  if (typeof window !== "undefined")
                    window.open(project.liveUrl, "_blank");
                }}
                accessibilityRole="link"
                accessibilityLabel="Open live demo in new tab"
              >
                <Text style={styles.fallbackButtonText}>Open in New Tab →</Text>
              </Pressable>
            )}
          </View>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Live Demo</Text>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>WEB</Text>
          </View>
        </View>
        <View style={styles.iframeWrapper}>
          {typeof document !== "undefined" ? (
            <iframe
              src={project.liveUrl}
              width="100%"
              height={500}
              style={{ border: "none", display: "block" }}
              title={`${project.title} live demo`}
              onError={() => setWebFailed(true)}
            />
          ) : null}
        </View>
      </View>
    );
  }

  if (project.type === "mobile" && project.emulatorConfig) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Interactive Demo</Text>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>MOBILE</Text>
          </View>
        </View>
        {mobileFailed ? (
          <View style={styles.fallback}>
            <Text style={styles.fallbackIcon}>📱</Text>
            <Text style={styles.fallbackTitle}>Emulator Unavailable</Text>
            <Text style={styles.fallbackText}>
              Scan the QR code with Expo Go or download the app to try it on
              your device.
            </Text>
          </View>
        ) : (
          <EmulatorView
            config={project.emulatorConfig}
            onError={() => setMobileFailed(true)}
          />
        )}
      </View>
    );
  }

  return null;
}
