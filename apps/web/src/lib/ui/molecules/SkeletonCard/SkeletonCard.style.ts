import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    borderRadius: 20,
    backgroundColor: "rgba(15,20,40,0.8)",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(99,102,241,0.08)",
  },
  content: { padding: 18, gap: 10 },
  tags: { flexDirection: "row", gap: 6, marginTop: 4 },
});
