import React from "react";
import { View, Pressable, Text, Linking } from "react-native";
import { IProject } from "@/lib/types";
import { Image } from "../../atoms/Image";
import { truncateDescription } from "@/lib/utils/validators";
import styles from "./ProjectCard.style";

export interface ProjectCardProps {
  project: IProject;
  onPress?: () => void;
}

export function ProjectCard({ project, onPress }: ProjectCardProps) {
  const visibleTechs = project.technologies.slice(0, 4);
  const overflowCount = project.technologies.length - 4;

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
        {project.featured && (
          <View style={styles.featuredBadgeTop}>
            <Text style={styles.featuredBadgeTopText}>⭐ Featured</Text>
          </View>
        )}
        <View style={styles.typeBadge}>
          <Text style={styles.typeBadgeText}>{project.type}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {project.title}
        </Text>
        <Text style={styles.description} numberOfLines={3}>
          {truncateDescription(project.description, 140)}
        </Text>

        <View style={styles.tags}>
          {visibleTechs.map((tech) => (
            <View key={tech} style={styles.tag}>
              <Text style={styles.tagText}>{tech}</Text>
            </View>
          ))}
          {overflowCount > 0 && (
            <View style={styles.tagOverflow}>
              <Text style={styles.tagOverflowText}>+{overflowCount}</Text>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          {project.githubUrl && (
            <Pressable
              style={styles.actionBtn}
              onPress={(e) => {
                e.stopPropagation?.();
                Linking.openURL(project.githubUrl!);
              }}
              accessibilityRole="link"
              accessibilityLabel="View source on GitHub"
            >
              <Text style={styles.actionBtnText}>↗ Source</Text>
            </Pressable>
          )}
          {project.liveUrl && (
            <Pressable
              style={styles.actionBtn}
              onPress={(e) => {
                e.stopPropagation?.();
                Linking.openURL(project.liveUrl!);
              }}
              accessibilityRole="link"
              accessibilityLabel="View live project"
            >
              <Text style={styles.actionBtnText}>🌐 Live</Text>
            </Pressable>
          )}
          {/* <Text style={styles.viewLink}>View →</Text> */}
        </View>
      </View>
    </Pressable>
  );
}
