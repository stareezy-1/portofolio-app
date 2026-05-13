import { StyleSheet } from "react-native";

export default StyleSheet.create({
  form: {
    maxWidth: 720,
    width: "100%",
  },
  // Section card
  section: {
    backgroundColor: "rgba(30,41,59,0.6)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#3B82F6",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    gap: 16,
  },
  fieldWrapper: {
    flex: 1,
    marginBottom: 18,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#94A3B8",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  hint: {
    fontSize: 11,
    color: "#475569",
    marginTop: 4,
  },
  input: {
    backgroundColor: "rgba(15,23,42,0.7)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#F1F5F9",
  },
  inputFocused: {
    borderColor: "#3B82F6",
  },
  textArea: {
    minHeight: 110,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  // Type selector
  typeRow: {
    flexDirection: "row",
    gap: 10,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    backgroundColor: "rgba(15,23,42,0.5)",
  },
  typeButtonActive: {
    backgroundColor: "rgba(37,99,235,0.2)",
    borderColor: "#3B82F6",
  },
  typeButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
    textTransform: "capitalize",
  },
  typeButtonTextActive: {
    color: "#3B82F6",
  },
  // Thumbnail upload
  uploadRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
  },
  uploadInput: {
    flex: 1,
    marginBottom: 0,
  },
  uploadButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "rgba(30,41,59,0.8)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  uploadButtonText: {
    color: "#94A3B8",
    fontSize: 13,
    fontWeight: "600",
  },
  thumbnailPreview: {
    width: "100%",
    height: 140,
    borderRadius: 10,
    marginTop: 10,
    backgroundColor: "rgba(15,23,42,0.5)",
  },
  // Gallery grid
  galleryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 4,
  },
  galleryItem: {
    position: "relative",
    width: 100,
    height: 100,
  },
  galleryThumb: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: "rgba(15,23,42,0.5)",
  },
  galleryRemove: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(239,68,68,0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  galleryRemoveText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
  // Featured toggle
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  toggleInfo: {
    flex: 1,
  },
  toggleLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#F1F5F9",
  },
  toggleDesc: {
    fontSize: 12,
    color: "#475569",
    marginTop: 2,
  },
  toggle: {
    width: 48,
    height: 26,
    borderRadius: 13,
    backgroundColor: "rgba(30,41,59,0.8)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  toggleActive: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#475569",
  },
  toggleThumbActive: {
    backgroundColor: "#FFFFFF",
    alignSelf: "flex-end",
  },
  // Submit
  submitButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
    marginTop: 4,
  },
  submitButtonDisabled: {
    opacity: 0.6,
    shadowOpacity: 0,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  // Error
  errorBanner: {
    backgroundColor: "rgba(239,68,68,0.1)",
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.2)",
    borderRadius: 10,
    padding: 14,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  errorIcon: {
    fontSize: 16,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 14,
    flex: 1,
  },
  // Success
  successBanner: {
    backgroundColor: "rgba(34,197,94,0.1)",
    borderWidth: 1,
    borderColor: "rgba(34,197,94,0.2)",
    borderRadius: 10,
    padding: 14,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  successText: {
    color: "#4ADE80",
    fontSize: 14,
    flex: 1,
  },
});
