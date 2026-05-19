import React from "react";
import { View, Text } from "react-native";
import type { ITechCategory } from "@/lib/types/content";
import { styles } from "./TechStackGrid.style";

export interface TechStackGridProps {
  categories: ITechCategory[];
}

export function TechStackGrid({ categories }: TechStackGridProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>Skills</Text>
      <Text style={styles.heading}>Tech Stack</Text>
      <View style={styles.grid}>
        {categories.map((cat) => (
          <View key={cat.category} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>{cat.icon}</Text>
              <Text style={styles.cardCategory}>{cat.category}</Text>
            </View>
            <View style={styles.skills}>
              {cat.skills.map((skill) => (
                <View key={skill} style={styles.skill}>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
