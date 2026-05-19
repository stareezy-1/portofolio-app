import { StyleSheet } from "react-native";
import { aurora } from "@/lib/constants/aurora";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 24,
  },
  lineCol: {
    alignItems: "center",
    width: 20,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: aurora.auroraGreen.value,
    marginTop: 4,
    zIndex: 1,
  },
  dotInactive: {
    backgroundColor: aurora.borderSubtle.value,
  },
  line: {
    flex: 1,
    width: 2,
    backgroundColor: aurora.borderSubtle.value,
    marginTop: 4,
  },
  lineActive: {
    backgroundColor: aurora.auroraGreen.value,
  },
  card: {
    flex: 1,
    backgroundColor: aurora.surfaceDark.value,
    borderWidth: 1,
    borderColor: aurora.borderSubtle.value,
    borderRadius: 12,
    padding: 16,
    marginBottom: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 4,
    gap: 8,
    flexWrap: "wrap",
  },
  title: {
    color: aurora.starWhite.value,
    fontWeight: "700",
    fontSize: 15,
    flex: 1,
  },
  org: {
    color: aurora.auroraGreen.value,
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 2,
  },
  dates: {
    color: aurora.textMuted.value,
    fontSize: 12,
    marginBottom: 8,
  },
  description: {
    color: aurora.textSecondary.value,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 8,
  },
  highlights: {
    gap: 4,
  },
  highlight: {
    flexDirection: "row",
    gap: 6,
    alignItems: "flex-start",
  },
  bullet: {
    color: aurora.auroraGreen.value,
    fontSize: 12,
    marginTop: 2,
  },
  highlightText: {
    color: aurora.textSecondary.value,
    fontSize: 12,
    lineHeight: 18,
    flex: 1,
  },
});
