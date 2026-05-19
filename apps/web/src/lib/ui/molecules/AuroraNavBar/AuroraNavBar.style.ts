import { StyleSheet } from "react-native";
import { aurora } from "@/lib/constants/aurora";

export const styles = StyleSheet.create({
  nav: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 200,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 14,
    height: 60,
  },
  logo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logoDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: aurora.auroraGreen.value,
  },
  logoText: {
    color: aurora.starWhite.value,
    fontWeight: "800",
    fontSize: 16,
    letterSpacing: -0.5,
  },
  links: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  link: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  linkText: {
    color: aurora.textSecondary.value,
    fontSize: 14,
    fontWeight: "500",
  },
  linkActive: {
    color: aurora.auroraGreen.value,
  },
  hireBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: aurora.auroraGreen.value,
    marginLeft: 8,
  },
  hireBtnText: {
    color: aurora.deepSpace.value,
    fontWeight: "700",
    fontSize: 13,
  },
  drawerOverlay: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: aurora.surfaceDark.value,
    borderBottomWidth: 1,
    borderBottomColor: aurora.borderSubtle.value,
    paddingVertical: 8,
    paddingHorizontal: 16,
    zIndex: 199,
  },
  drawerLink: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  drawerLinkText: {
    color: aurora.textSecondary.value,
    fontSize: 15,
    fontWeight: "500",
  },
  drawerLinkActive: {
    color: aurora.auroraGreen.value,
  },
  hamburger: {
    padding: 8,
  },
  hamburgerText: {
    color: aurora.starWhite.value,
    fontSize: 20,
  },
});
