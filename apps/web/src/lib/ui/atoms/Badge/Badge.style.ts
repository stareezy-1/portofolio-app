import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
    borderWidth: 1,
  },
  tech: {
    backgroundColor: "rgba(99,102,241,0.1)",
    borderColor: "rgba(99,102,241,0.25)",
  },
  status: {
    backgroundColor: "rgba(34,197,94,0.1)",
    borderColor: "rgba(34,197,94,0.25)",
  },
  label: { fontSize: 12, fontWeight: "600" },
  techLabel: { color: "#A5B4FC" },
  statusLabel: { color: "#4ADE80" },
});
