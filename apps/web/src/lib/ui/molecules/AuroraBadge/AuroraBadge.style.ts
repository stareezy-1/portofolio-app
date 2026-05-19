import { StyleSheet } from "react-native";
import { aurora } from "@/lib/constants/aurora";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 100,
    gap: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  text: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.4,
  },
  // Variants
  green: {
    backgroundColor: `${aurora.auroraGreen.value}20`,
    borderWidth: 1,
    borderColor: `${aurora.auroraGreen.value}40`,
  },
  purple: {
    backgroundColor: `${aurora.nebulaPurple.value}20`,
    borderWidth: 1,
    borderColor: `${aurora.nebulaPurple.value}40`,
  },
  amber: {
    backgroundColor: `${aurora.warningAmber.value}20`,
    borderWidth: 1,
    borderColor: `${aurora.warningAmber.value}40`,
  },
  red: {
    backgroundColor: `${aurora.errorRed.value}20`,
    borderWidth: 1,
    borderColor: `${aurora.errorRed.value}40`,
  },
  default: {
    backgroundColor: `${aurora.borderSubtle.value}80`,
    borderWidth: 1,
    borderColor: aurora.borderSubtle.value,
  },
});
