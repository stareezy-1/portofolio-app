import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 48,
    maxWidth: 1200,
    width: "100%",
    alignSelf: "center",
  },
  heading: {
    fontSize: 36,
    fontWeight: "800",
    marginBottom: 8,
    color: "#F8FAFC",
    letterSpacing: -0.5,
  },
  subheading: {
    fontSize: 16,
    color: "#64748B",
    marginBottom: 40,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    paddingVertical: 32,
  },
  pageButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(59,130,246,0.3)",
    backgroundColor: "rgba(59,130,246,0.05)",
  },
  pageButtonDisabled: {
    opacity: 0.3,
  },
  pageButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3B82F6",
  },
  pageInfo: {
    fontSize: 14,
    color: "#475569",
    minWidth: 100,
    textAlign: "center",
  },
});
