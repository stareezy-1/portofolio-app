import React, { useCallback } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useProjects } from "@/lib/hooks/useProjects";
import { useDeleteProject } from "@/lib/hooks/useAdmin";
import type { IProject } from "@/lib/types/project";
import styles from "./index.style";

export default function AdminProjectListPage() {
  const router = useRouter();
  const { data, isLoading } = useProjects({ page: 1, limit: 50 });
  const deleteProject = useDeleteProject();

  const projects = data ?? [];

  const handleCreate = useCallback(() => {
    router.push("/admin/projects/new" as any);
  }, [router]);

  const handleEdit = useCallback(
    (project: IProject) => {
      router.push(`/admin/projects/${project.id}` as any);
    },
    [router],
  );

  const handleDelete = useCallback(
    (id: string) => {
      deleteProject.mutate(id);
    },
    [deleteProject],
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading projects...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.titleGroup}>
          <Text style={styles.title}>Projects</Text>
          <Text style={styles.subtitle}>{projects.length} total</Text>
        </View>
        <Pressable
          style={styles.createButton}
          onPress={handleCreate}
          accessibilityRole="button"
          accessibilityLabel="Create new project"
        >
          <Text style={styles.createButtonText}>+ New Project</Text>
        </Pressable>
      </View>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text
            style={[
              styles.tableCellText,
              { flex: 3, fontWeight: "600", color: "#64748B" },
            ]}
          >
            Title
          </Text>
          <Text
            style={[
              styles.tableCellText,
              { flex: 1, fontWeight: "600", color: "#64748B" },
            ]}
          >
            Type
          </Text>
          <Text
            style={[
              styles.tableCellText,
              { flex: 1, fontWeight: "600", color: "#64748B" },
            ]}
          >
            Featured
          </Text>
          <Text
            style={[
              styles.tableCellText,
              { flex: 2, fontWeight: "600", color: "#64748B" },
            ]}
          >
            Actions
          </Text>
        </View>

        {projects.map((project: IProject) => (
          <View key={project.id} style={styles.tableRow}>
            <Text
              style={[styles.tableCellText, styles.cellTitleText, { flex: 3 }]}
              numberOfLines={1}
            >
              {project.title}
            </Text>
            <Text style={[styles.tableCellText, { flex: 1 }]}>
              {project.type}
            </Text>
            <Text
              style={[
                styles.tableCellText,
                { flex: 1, color: project.featured ? "#4ADE80" : "#475569" },
              ]}
            >
              {project.featured ? "⭐ Yes" : "No"}
            </Text>
            <View style={[styles.cellActions, styles.actionsRow]}>
              <Pressable
                style={styles.editButton}
                onPress={() => handleEdit(project)}
                accessibilityRole="button"
                accessibilityLabel={`Edit ${project.title}`}
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </Pressable>
              <Pressable
                style={styles.deleteButton}
                onPress={() => handleDelete(project.id)}
                accessibilityRole="button"
                accessibilityLabel={`Delete ${project.title}`}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </Pressable>
            </View>
          </View>
        ))}

        {projects.length === 0 && (
          <View style={styles.emptyRow}>
            <Text style={styles.emptyIcon}>📂</Text>
            <Text style={styles.emptyText}>
              No projects yet. Create your first one!
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
