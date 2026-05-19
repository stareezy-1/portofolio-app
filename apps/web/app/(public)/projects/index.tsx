import React, { useCallback } from "react";
import { View, Text, Pressable, TextInput } from "react-native";
import { useRouter } from "expo-router";
import Head from "expo-router/head";
import { ProjectCard } from "@/lib/ui/molecules/ProjectCard";
import { useProjects } from "@/lib/hooks/useProjects";
import { useProjectFilters } from "@/hooks/projects/useProjectFilters";
import { filterProjects } from "@/lib/utils/validators";
import { EProjectType } from "@/lib/constants/enums";
import { aurora } from "@/lib/constants/aurora";
import type { IProject } from "@/lib/types";
import styles from "./index.style";

const TYPE_FILTERS: Array<{ label: string; value: EProjectType | "all" }> = [
  { label: "All", value: "all" },
  { label: "Web", value: EProjectType.WEB },
  { label: "Mobile", value: EProjectType.MOBILE },
  { label: "Backend", value: EProjectType.BACKEND },
];

export default function ProjectListPage() {
  const router = useRouter();
  const { data: allProjects = [], isLoading } = useProjects();
  const { filters, setSearch, setType, clearFilters } = useProjectFilters();

  const filtered = filterProjects(allProjects, filters.type, filters.search);
  const hasActiveFilters = filters.search !== "" || filters.type !== "all";

  const handleProjectPress = useCallback(
    (project: IProject) => {
      router.push(`/projects/${project.slug}` as any);
    },
    [router],
  );

  return (
    <View
      style={[styles.container, { backgroundColor: aurora.deepSpace.value }]}
      accessible
      accessibilityLabel="Projects page"
    >
      <Head>
        <title>Projects — Muhammad Bintang Al Akbar | Stareezy</title>
        <meta
          name="description"
          content="Explore projects built by Muhammad Bintang Al Akbar — React, React Native, TypeScript, Expo, Go and Supabase applications."
        />
        <link rel="canonical" href="https://stareezy.tech/projects" />
      </Head>

      <View
        style={{ paddingHorizontal: 24, paddingTop: 32, paddingBottom: 24 }}
      >
        <Text
          style={{
            fontSize: 11,
            fontWeight: "700",
            textTransform: "uppercase",
            letterSpacing: 1.5,
            color: aurora.auroraGreen.value,
            marginBottom: 8,
          }}
        >
          Portfolio
        </Text>
        <Text
          style={{
            fontSize: 32,
            fontWeight: "800",
            color: aurora.starWhite.value,
            letterSpacing: -0.8,
            marginBottom: 8,
          }}
        >
          All Projects
        </Text>
        <Text style={{ fontSize: 14, color: aurora.textSecondary.value }}>
          {filtered.length} of {allProjects.length} projects
        </Text>
      </View>

      <View style={{ paddingHorizontal: 24, marginBottom: 12 }}>
        <TextInput
          style={{
            backgroundColor: aurora.surfaceDark.value,
            borderWidth: 1,
            borderColor: aurora.borderSubtle.value,
            borderRadius: 10,
            paddingHorizontal: 14,
            paddingVertical: 11,
            fontSize: 14,
            color: aurora.starWhite.value,
          }}
          value={filters.search}
          onChangeText={setSearch}
          placeholder="Search projects..."
          placeholderTextColor={aurora.textMuted.value}
          accessibilityLabel="Search projects"
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 24,
          gap: 8,
          marginBottom: 20,
          flexWrap: "wrap",
        }}
      >
        {TYPE_FILTERS.map((f) => {
          const active = filters.type === f.value;
          return (
            <Pressable
              key={f.value}
              onPress={() => setType(f.value)}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 7,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: active
                  ? aurora.auroraGreen.value
                  : aurora.borderSubtle.value,
                backgroundColor: active
                  ? `${aurora.auroraGreen.value}20`
                  : "transparent",
              }}
              accessibilityRole="button"
              accessibilityLabel={`Filter by ${f.label}`}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "600",
                  color: active
                    ? aurora.auroraGreen.value
                    : aurora.textSecondary.value,
                }}
              >
                {f.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {isLoading && (
        <View style={{ paddingHorizontal: 24, gap: 16 }}>
          {[1, 2, 3].map((i) => (
            <View
              key={i}
              style={{
                height: 220,
                backgroundColor: aurora.surfaceDark.value,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: aurora.borderSubtle.value,
              }}
            />
          ))}
        </View>
      )}

      {!isLoading && filtered.length === 0 && (
        <View
          style={{
            alignItems: "center",
            paddingVertical: 64,
            paddingHorizontal: 24,
          }}
        >
          <Text style={{ fontSize: 40, marginBottom: 16 }}>🔍</Text>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: aurora.starWhite.value,
              marginBottom: 8,
              textAlign: "center",
            }}
          >
            No projects found
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: aurora.textSecondary.value,
              textAlign: "center",
              marginBottom: 24,
            }}
          >
            Try adjusting your search or filter.
          </Text>
          {hasActiveFilters && (
            <Pressable
              onPress={clearFilters}
              style={{
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: aurora.auroraGreen.value,
              }}
              accessibilityRole="button"
            >
              <Text
                style={{ color: aurora.auroraGreen.value, fontWeight: "600" }}
              >
                Clear filters
              </Text>
            </Pressable>
          )}
        </View>
      )}

      {!isLoading && filtered.length > 0 && (
        <View style={{ paddingHorizontal: 24, gap: 16, paddingBottom: 40 }}>
          {filtered.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onPress={() => handleProjectPress(project)}
            />
          ))}
        </View>
      )}
    </View>
  );
}
