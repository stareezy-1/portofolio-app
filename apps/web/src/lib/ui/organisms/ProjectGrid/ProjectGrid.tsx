import React from "react";
import { View, Pressable, Text } from "react-native";
import { IProject } from "@/lib/types";
import { ProjectCard } from "../../molecules/ProjectCard";
import { SkeletonCard } from "../../molecules/SkeletonCard";
import styles from "./ProjectGrid.style";

export interface ProjectGridProps {
  projects: IProject[];
  loading?: boolean;
  onProjectPress?: (project: IProject) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export function ProjectGrid({
  projects,
  loading = false,
  onProjectPress,
  onLoadMore,
  hasMore = false,
}: ProjectGridProps) {
  if (loading && projects.length === 0) {
    return (
      <View style={styles.grid} accessibilityLabel="Loading projects">
        {Array.from({ length: 6 }).map((_, i) => (
          <View key={i} style={styles.gridItem}>
            <SkeletonCard />
          </View>
        ))}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {projects.map((project) => (
          <View key={project.id} style={styles.gridItem}>
            <ProjectCard
              project={project}
              onPress={() => onProjectPress?.(project)}
            />
          </View>
        ))}
      </View>
      {hasMore && (
        <Pressable
          style={styles.loadMore}
          onPress={onLoadMore}
          accessibilityRole="button"
          accessibilityLabel="Load more projects"
        >
          <Text style={styles.loadMoreText}>Load More</Text>
        </Pressable>
      )}
    </View>
  );
}
