import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  primary: {
    backgroundColor: "#6366F1",
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 6,
  },
  secondary: {
    backgroundColor: "#7C3AED",
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 6,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "#6366F1",
  },
  sm: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
  },
  md: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  lg: {
    paddingHorizontal: 28,
    paddingVertical: 15,
    borderRadius: 14,
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
  labelOutline: {
    color: "#818CF8",
  },
  disabled: {
    opacity: 0.45,
    shadowOpacity: 0,
  },
});
