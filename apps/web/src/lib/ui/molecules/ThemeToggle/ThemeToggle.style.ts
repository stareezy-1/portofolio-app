import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  light: {
    backgroundColor: "rgba(99,102,241,0.08)",
    borderColor: "rgba(99,102,241,0.2)",
  },
  dark: {
    backgroundColor: "rgba(99,102,241,0.12)",
    borderColor: "rgba(99,102,241,0.25)",
  },
  icon: { fontSize: 18 },
});
