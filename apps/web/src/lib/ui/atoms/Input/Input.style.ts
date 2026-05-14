import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: { marginBottom: 4 },
  label: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748B",
    marginBottom: 8,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  input: {
    borderWidth: 1,
    borderColor: "rgba(99,102,241,0.15)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
    backgroundColor: "rgba(6,11,24,0.7)",
    color: "#F1F5F9",
  },
  inputError: { borderColor: "#EF4444" },
  error: { fontSize: 12, color: "#EF4444", marginTop: 4 },
});
