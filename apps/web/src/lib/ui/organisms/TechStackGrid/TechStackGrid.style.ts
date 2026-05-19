import { StyleSheet } from "react-native";
import { aurora } from "@/lib/constants/aurora";

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 32,
    paddingTop: 72,
    paddingBottom: 72,
    backgroundColor: aurora.deepSpace.value,
    maxWidth: 1100,
    width: "100%" as unknown as number,
    alignSelf: "center",
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    color: aurora.auroraGreen.value,
    marginBottom: 10,
  },
  heading: {
    fontSize: 30,
    fontWeight: "800",
    color: aurora.starWhite.value,
    letterSpacing: -0.5,
    marginBottom: 36,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  card: {
    backgroundColor: aurora.surfaceDark.value,
    borderWidth: 1,
    borderColor: aurora.borderSubtle.value,
    borderRadius: 16,
    padding: 24,
    minWidth: 200,
    flex: 1,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  cardIcon: {
    fontSize: 24,
  },
  cardCategory: {
    fontSize: 15,
    fontWeight: "700",
    color: aurora.starWhite.value,
  },
  skills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
  },
  skill: {
    backgroundColor: `${aurora.borderSubtle.value}80`,
    borderWidth: 1,
    borderColor: aurora.borderSubtle.value,
    borderRadius: 6,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  skillText: {
    fontSize: 12,
    color: aurora.textSecondary.value,
    fontWeight: "500",
  },
});
