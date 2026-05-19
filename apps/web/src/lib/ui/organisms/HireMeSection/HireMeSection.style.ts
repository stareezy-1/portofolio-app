import { StyleSheet } from "react-native";
import { aurora } from "@/lib/constants/aurora";

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 32,
    paddingTop: 80,
    paddingBottom: 80,
    alignItems: "center",
    backgroundColor: aurora.cosmicGray.value,
    position: "relative",
    overflow: "hidden",
  },
  badge: {
    marginBottom: 24,
  },
  heading: {
    fontSize: 34,
    fontWeight: "800",
    color: aurora.starWhite.value,
    textAlign: "center",
    letterSpacing: -0.8,
    marginBottom: 14,
  },
  sub: {
    fontSize: 16,
    color: aurora.textSecondary.value,
    textAlign: "center",
    lineHeight: 26,
    marginBottom: 36,
    maxWidth: 520,
  },
  btn: {
    paddingHorizontal: 36,
    paddingVertical: 17,
    borderRadius: 12,
    backgroundColor: aurora.auroraGreen.value,
    shadowColor: aurora.auroraGreen.value,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  btnText: {
    color: aurora.deepSpace.value,
    fontWeight: "800",
    fontSize: 16,
    letterSpacing: 0.2,
  },
});
