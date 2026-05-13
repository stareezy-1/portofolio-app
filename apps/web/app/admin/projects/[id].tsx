import React, { useCallback } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/utils/api-client";
import { useUpdateProject } from "@/lib/hooks/useAdmin";
import type { IProjectCreateInput } from "@/lib/types/api";
import type { IProject } from "@/lib/types/project";
import { ProjectForm } from "../../../src/components/admin/ProjectForm";
import styles from "./[id].style";

export default function AdminEditProjectPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const updateProject = useUpdateProject();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-project", id],
    queryFn: () =>
      apiClient.get(`/admin/projects/${id}`).then((res) => res.data),
    enabled: !!id,
  });

  const project: IProject | undefined = data?.data;

  const handleSubmit = useCallback(
    (input: IProjectCreateInput) => {
      if (!id) return;
      updateProject.mutate(
        { id, input },
        {
          onSuccess: () => {
            router.replace("/admin/projects" as any);
          },
        },
      );
    },
    [id, updateProject, router],
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!project) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Project not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Edit Project</Text>
      <ProjectForm
        project={project}
        onSubmit={handleSubmit}
        loading={updateProject.isPending}
      />
    </ScrollView>
  );
}
