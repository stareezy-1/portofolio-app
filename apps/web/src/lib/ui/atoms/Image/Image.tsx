import React, { useState } from "react";
import { View, Image as RNImage, ImageSourcePropType } from "react-native";
import styles from "./Image.style";

export interface ImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fallback?: ImageSourcePropType;
}

export function Image({ src, alt, width, height, fallback }: ImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError && fallback) {
    return (
      <RNImage
        source={fallback}
        style={[
          styles.image,
          width ? { width } : undefined,
          height ? { height } : undefined,
        ]}
        accessibilityRole="image"
        accessibilityLabel={alt}
      />
    );
  }

  if (hasError) {
    return (
      <View
        style={[
          styles.fallback,
          width ? { width } : undefined,
          height ? { height } : undefined,
        ]}
        accessibilityRole="image"
        accessibilityLabel={alt}
      />
    );
  }

  return (
    <RNImage
      source={{ uri: src }}
      style={[
        styles.image,
        width ? { width } : undefined,
        height ? { height } : undefined,
      ]}
      accessibilityRole="image"
      accessibilityLabel={alt}
      onError={() => setHasError(true)}
      {...({ loading: "lazy" } as object)}
    />
  );
}
