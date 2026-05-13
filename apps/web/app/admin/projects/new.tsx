import React, { useCallback } from "react";
import { View, Text, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useCreateProject } from "@/lib/hooks/useAdmin";
import type { IProjectCreateInput } from "@/lib/types/api";
import { ProjectForm } from "../../../src/components/admin/ProjectForm";
import styles from "./new.style";

export default function AdminNewProjectPage() {
  const router = useRouter();
  const createProject = useCreateProject();

  const handleSubmit = useCallback(
    (input: IProjectCreateInput) => {
      createProject.mutate(input, {
        onSuccess: () => {
          router.replace("/admin/projects" as any);
        },
      });
    },
    [createProject, router],
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>New Project</Text>
      <ProjectForm onSubmit={handleSubmit} loading={createProject.isPending} />
    </ScrollView>
  );
}
