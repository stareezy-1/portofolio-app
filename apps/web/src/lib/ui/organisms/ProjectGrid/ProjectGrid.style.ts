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
  emptyContainer: { paddingVertical: 60, alignItems: "center" },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyText: { fontSize: 16, color: "#475569", textAlign: "center" },
  loadMore: {
    marginTop: 32,
    alignSelf: "center",
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(59,130,246,0.3)",
    backgroundColor: "rgba(59,130,246,0.05)",
  },
  loadMoreText: { fontSize: 14, fontWeight: "600", color: "#3B82F6" },
});
