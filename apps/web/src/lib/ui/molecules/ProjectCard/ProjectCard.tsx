import React from "react";
import { View, Pressable, Text } from "react-native";
import { IProject } from "@/lib/types";
import { Image } from "../../atoms/Image";
import styles from "./ProjectCard.style";

export interface ProjectCardProps {
  project: IProject;
  onPress?: () => void;
}

export function ProjectCard({ project, onPress }: ProjectCardProps) {
  return (
    <Pressable
      style={styles.container}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`View project: ${project.title}`}
    >
      <View style={styles.imageWrapper}>
        <Image
          src={project.thumbnail}
          alt={`${project.title} thumbnail`}
          height={180}
        />
        <View style={styles.typeBadge}>
          <Text style={styles.typeBadgeText}>{project.type}</Text>
        </View>
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {project.title}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {project.description}
        </Text>
        <View style={styles.tags}>
          {project.technologies.slice(0, 4).map((tech) => (
            <View key={tech} style={styles.tag}>
              <Text style={styles.tagText}>{tech}</Text>
            </View>
          ))}
        </View>
        <View style={styles.footer}>
          <Text style={styles.viewLink}>View Project →</Text>
          {project.featured && (
            <View style={styles.featuredBadge}>
              <Text style={styles.featuredText}>⭐ Featured</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}
