import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { IEmulatorConfig } from "@/lib/types/project";
import styles from "./EmulatorView.style";

export interface EmulatorViewProps {
  config: IEmulatorConfig;
  onError?: () => void;
}

type Orientation = "portrait" | "landscape";

const PORTRAIT_W = 320;
const PORTRAIT_H = 568;

export function EmulatorView({ config, onError }: EmulatorViewProps) {
  const [orientation, setOrientation] = useState<Orientation>(
    (config.orientation as Orientation) ?? "portrait",
  );
  const [failed, setFailed] = useState(false);

  const isLandscape = orientation === "landscape";
  const screenW = isLandscape ? PORTRAIT_H : PORTRAIT_W;
  const screenH = isLandscape ? PORTRAIT_W : PORTRAIT_H;

  if (failed) {
    return (
      <View style={styles.container}>
        <View style={styles.fallbackPanel}>
          <Text style={styles.fallbackTitle}>Connection Failed</Text>
          <Text style={styles.fallbackText}>
            Could not connect to the Expo server. Scan the QR code or download
            the app to try it on your device.
          </Text>
          <View style={styles.qrPlaceholder}>
            <Text style={styles.qrText}>
              QR Code{"\n"}(scan with{"\n"}Expo Go)
            </Text>
          </View>
          <View style={styles.downloadLinks}>
            <Pressable
              style={styles.downloadButton}
              accessibilityRole="link"
              accessibilityLabel="Download APK"
            >
              <Text style={styles.downloadButtonText}>📱 APK</Text>
            </Pressable>
            <Pressable
              style={styles.downloadButton}
              accessibilityRole="link"
              accessibilityLabel="TestFlight"
            >
              <Text style={styles.downloadButtonText}>🍎 TestFlight</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        <Pressable
          style={styles.orientationButton}
          onPress={() =>
            setOrientation((o) => (o === "portrait" ? "landscape" : "portrait"))
          }
          accessibilityRole="button"
          accessibilityLabel={`Switch to ${isLandscape ? "portrait" : "landscape"} orientation`}
        >
          <Text style={styles.orientationIcon}>
            {isLandscape ? "📱" : "🔄"}
          </Text>
          <Text style={styles.orientationButtonText}>
            {isLandscape ? "Portrait" : "Landscape"}
          </Text>
        </Pressable>
      </View>

      <View
        style={[styles.deviceFrame, isLandscape && styles.deviceFrameLandscape]}
      >
        {!isLandscape && (
          <View style={styles.notch}>
            <View style={styles.notchBar} />
          </View>
        )}
        <View
          style={[
            styles.deviceScreen,
            isLandscape && styles.deviceScreenLandscape,
            { width: screenW, height: screenH },
          ]}
        >
          <View
            style={[styles.iframeWrapper, { width: screenW, height: screenH }]}
          >
            {typeof document !== "undefined" ? (
              <iframe
                src={config.expoUrl}
                width={screenW}
                height={screenH}
                style={{ border: "none", display: "block" }}
                title="Mobile app emulator"
                onError={() => {
                  setFailed(true);
                  onError?.();
                }}
              />
            ) : null}
          </View>
        </View>
        {!isLandscape && (
          <View style={styles.homeBar}>
            <View style={styles.homeBarIndicator} />
          </View>
        )}
      </View>
    </View>
  );
}
