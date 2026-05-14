import { StyleSheet } from "react-native";

export default StyleSheet.create({
  image: {
    width: "100%" as unknown as number,
    height: 200,
    borderRadius: 12,
  },
  fallback: {
    width: "100%" as unknown as number,
    height: 200,
    borderRadius: 12,
    backgroundColor: "rgba(99,102,241,0.08)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(99,102,241,0.1)",
  },
});
