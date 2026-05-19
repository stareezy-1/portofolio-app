import { StyleSheet } from "react-native";
import { aurora } from "@/lib/constants/aurora";

export const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 28,
    right: 24,
    zIndex: 500,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 50,
    backgroundColor: aurora.auroraGreen.value,
    shadowColor: aurora.auroraGreen.value,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  label: {
    color: aurora.deepSpace.value,
    fontWeight: "700",
    fontSize: 14,
    letterSpacing: 0.2,
  },
  icon: {
    color: aurora.deepSpace.value,
    fontSize: 16,
  },
});
