import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: { marginBottom: 12 },
  label: { fontSize: 14, fontWeight: "500", marginBottom: 4, color: "#374151" },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
  },
  inputError: { borderColor: "#DC2626" },
  error: { fontSize: 12, color: "#DC2626", marginTop: 4 },
});
