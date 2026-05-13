import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "rgba(15,23,42,0.8)",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  headerTitle: { fontSize: 14, fontWeight: "600", color: "#94A3B8" },
  headerBadge: {
    backgroundColor: "rgba(59,130,246,0.15)",
    borderWidth: 1,
    borderColor: "rgba(59,130,246,0.25)",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  headerBadgeText: { fontSize: 11, fontWeight: "600", color: "#93C5FD" },
  iframeWrapper: {
    width: "100%" as unknown as number,
    height: 500,
    backgroundColor: "#000",
  },
  fallback: { padding: 32, alignItems: "center", gap: 16 },
  fallbackIcon: { fontSize: 40 },
  fallbackTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#F1F5F9",
    textAlign: "center",
  },
  fallbackText: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 20,
  },
  fallbackButton: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  fallbackButtonText: { fontSize: 14, fontWeight: "600", color: "#FFFFFF" },
});
