import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: { marginBottom: 18 },
  labelRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  label: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748B",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  required: { fontSize: 13, color: "#EF4444", marginLeft: 3 },
  error: { fontSize: 12, color: "#EF4444", marginTop: 4 },
});
