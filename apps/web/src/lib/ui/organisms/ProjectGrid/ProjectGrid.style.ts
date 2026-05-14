import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: { width: "100%" as unknown as number },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 20 },
  gridItem: {
    width: "100%" as unknown as number,
    maxWidth: 380,
    minWidth: 280,
    flex: 1,
  },
  emptyContainer: { paddingVertical: 64, alignItems: "center" },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyText: { fontSize: 16, color: "#475569", textAlign: "center" },
  loadMore: {
    marginTop: 36,
    alignSelf: "center",
    paddingHorizontal: 32,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(99,102,241,0.3)",
    backgroundColor: "rgba(99,102,241,0.06)",
  },
  loadMoreText: { fontSize: 14, fontWeight: "700", color: "#818CF8" },
});
