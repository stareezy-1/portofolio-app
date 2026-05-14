import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 56,
    maxWidth: 1200,
    width: "100%",
    alignSelf: "center",
  },
  heading: {
    fontSize: 48,
    fontWeight: "900",
    marginBottom: 10,
    color: "#F1F5F9",
    letterSpacing: -1.5,
  },
  subheading: {
    fontSize: 16,
    color: "#64748B",
    marginBottom: 44,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    paddingVertical: 36,
  },
  pageButton: {
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(99,102,241,0.3)",
    backgroundColor: "rgba(99,102,241,0.06)",
  },
  pageButtonDisabled: {
    opacity: 0.3,
  },
  pageButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#818CF8",
  },
  pageInfo: {
    fontSize: 14,
    color: "#475569",
    minWidth: 100,
    textAlign: "center",
  },
});
