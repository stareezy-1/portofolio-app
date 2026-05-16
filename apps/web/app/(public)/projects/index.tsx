import React, { useCallback } from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import Head from "expo-router/head";
import { ProjectGrid } from "@/lib/ui/organisms/ProjectGrid";
import { useMetadata } from "../../../src/components/MetaHead";
import { useProjectList } from "../../../src/hooks/projects/useProjectList";
import type { IProject } from "@/lib/types";
import styles from "./index.style";

export default function ProjectListPage() {
  const router = useRouter();
  const {
    projects,
    meta,
    page,
    totalPages,
    isLoading,
    goToNextPage,
    goToPrevPage,
    hasNextPage,
    hasPrevPage,
  } = useProjectList();

  useMetadata({
    title: "Projects",
    description: "Browse all portfolio projects",
    url: "/projects",
  });

  const handleProjectPress = useCallback(
    (project: IProject) => {
      router.push(`/projects/${project.slug}` as any);
    },
    [router],
  );

  return (
    <View
      style={styles.container}
      accessible
      accessibilityLabel="Projects page"
    >
      <Head>
        <title>Projects — Muhammad Bintang Al Akbar | Stareezy</title>
        <meta
          name="description"
          content="Explore projects built by Muhammad Bintang Al Akbar — React, React Native, TypeScript, Expo, Go and Supabase applications."
        />
        <meta property="og:title" content="Projects — Stareezy Portfolio" />
        <meta
          property="og:description"
          content="Explore projects built with React, React Native, TypeScript, Expo, Go and Supabase."
        />
        <meta
          property="og:url"
          content="https://stareezy.tech/projects"
        />
        <link
          rel="canonical"
          href="https://stareezy.tech/projects"
        />
      </Head>
      <Text style={styles.heading}>Projects</Text>

      <ProjectGrid
        projects={projects}
        loading={isLoading}
        onProjectPress={handleProjectPress}
      />

      {meta && totalPages > 1 && (
        <View
          style={styles.pagination}
          accessible
          accessibilityLabel="Pagination"
        >
          <Pressable
            style={[
              styles.pageButton,
              !hasPrevPage && styles.pageButtonDisabled,
            ]}
            onPress={goToPrevPage}
            disabled={!hasPrevPage}
            accessibilityRole="button"
            accessibilityLabel="Previous page"
          >
            <Text style={styles.pageButtonText}>← Previous</Text>
          </Pressable>

          <Text style={styles.pageInfo}>
            Page {page} of {totalPages}
          </Text>

          <Pressable
            style={[
              styles.pageButton,
              !hasNextPage && styles.pageButtonDisabled,
            ]}
            onPress={goToNextPage}
            disabled={!hasNextPage}
            accessibilityRole="button"
            accessibilityLabel="Next page"
          >
            <Text style={styles.pageButtonText}>Next →</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
