import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
    maxWidth: 1000,
    width: "100%",
    alignSelf: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 64,
  },
  loadingText: {
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 64,
  },
  errorText: {
    fontSize: 16,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 24,
    alignSelf: "flex-start",
  },
  backText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#3B82F6",
  },
  thumbnail: {
    width: "100%",
    height: 320,
    borderRadius: 16,
    marginBottom: 32,
  },
  typeBadge: {
    alignSelf: "flex-start",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(59,130,246,0.3)",
    backgroundColor: "rgba(59,130,246,0.08)",
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#3B82F6",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 17,
    lineHeight: 28,
    marginBottom: 32,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 14,
  },
  technologies: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  techBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(59,130,246,0.2)",
    backgroundColor: "rgba(59,130,246,0.08)",
  },
  techBadgeText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#3B82F6",
  },
  gallery: {
    gap: 12,
  },
  galleryImage: {
    width: "100%",
    height: 220,
    borderRadius: 12,
  },
  links: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  link: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(59,130,246,0.3)",
    backgroundColor: "rgba(59,130,246,0.05)",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  linkText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3B82F6",
  },
});
