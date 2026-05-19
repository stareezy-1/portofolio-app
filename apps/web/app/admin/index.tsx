import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useProjects } from "@/lib/hooks/useProjects";
import { useResume } from "@/lib/hooks/useResume";
import styles from "./index.style";

export default function AdminDashboard() {
  const router = useRouter();
  const { data: projectsData, isLoading: projectsLoading } = useProjects({
    page: 1,
    limit: 50,
  });
  const { data: resumeData } = useResume();

  const projects = projectsData ?? [];
  const totalProjects = projects.length;
  const featuredCount = projects.filter((p) => p.featured).length;
  const hasPDF = !!resumeData?.data?.pdfUrl;

  const dotColor = (type: string) => {
    if (type === "mobile") return styles.projectDotMobile;
    if (type === "backend") return styles.projectDotBackend;
    return {};
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Admin Dashboard</Text>
        <Text style={styles.title}>Welcome back 👋</Text>
        <Text style={styles.subtitle}>
          Here's an overview of your portfolio content.
        </Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>📦</Text>
          <Text style={styles.statValue}>
            {projectsLoading ? "—" : totalProjects}
          </Text>
          <Text style={styles.statLabel}>Total Projects</Text>
          <Text style={styles.statSub}>{featuredCount} featured</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>⭐</Text>
          <Text style={styles.statValue}>{featuredCount}</Text>
          <Text style={styles.statLabel}>Featured</Text>
          <Text style={styles.statSub}>Shown on landing page</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>📄</Text>
          <Text style={styles.statValue}>{hasPDF ? "✓" : "—"}</Text>
          <Text style={styles.statLabel}>Resume PDF</Text>
          <Text style={styles.statSub}>
            {hasPDF ? "Uploaded" : "Not uploaded"}
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionsGrid}>
        <View style={[styles.actionCard, styles.actionCardPrimary]}>
          <Text style={styles.actionIcon}>➕</Text>
          <Text style={styles.actionTitle}>New Project</Text>
          <Text style={styles.actionDesc}>
            Add a new project to your portfolio showcase.
          </Text>
          <Pressable
            style={styles.actionButton}
            onPress={() => router.push("/admin/projects/new" as any)}
            accessibilityRole="button"
            accessibilityLabel="Create new project"
          >
            <Text style={styles.actionButtonText}>Create Project</Text>
          </Pressable>
        </View>

        <View style={styles.actionCard}>
          <Text style={styles.actionIcon}>📋</Text>
          <Text style={styles.actionTitle}>Manage Projects</Text>
          <Text style={styles.actionDesc}>
            Edit, delete, or reorder your existing projects.
          </Text>
          <Pressable
            style={[styles.actionButton, styles.actionButtonSecondary]}
            onPress={() => router.push("/admin/projects" as any)}
            accessibilityRole="button"
            accessibilityLabel="View all projects"
          >
            <Text
              style={[
                styles.actionButtonText,
                styles.actionButtonTextSecondary,
              ]}
            >
              View All
            </Text>
          </Pressable>
        </View>

        <View style={styles.actionCard}>
          <Text style={styles.actionIcon}>📄</Text>
          <Text style={styles.actionTitle}>Resume PDF</Text>
          <Text style={styles.actionDesc}>
            {hasPDF
              ? "Update your resume PDF file."
              : "Upload your resume PDF to enable downloads."}
          </Text>
          <Pressable
            style={[styles.actionButton, styles.actionButtonSecondary]}
            onPress={() => router.push("/admin/resume" as any)}
            accessibilityRole="button"
            accessibilityLabel="Manage resume"
          >
            <Text
              style={[
                styles.actionButtonText,
                styles.actionButtonTextSecondary,
              ]}
            >
              {hasPDF ? "Update Resume" : "Upload Resume"}
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.recentSection}>
        <View style={styles.recentHeader}>
          <Text style={styles.recentTitle}>Recent Projects</Text>
          <Pressable
            onPress={() => router.push("/admin/projects" as any)}
            accessibilityRole="link"
            accessibilityLabel="View all projects"
          >
            <Text style={styles.viewAllText}>View all →</Text>
          </Pressable>
        </View>
        {projects.length === 0 ? (
          <Text style={styles.emptyText}>
            No projects yet. Create your first one!
          </Text>
        ) : (
          projects.slice(0, 5).map((project) => (
            <Pressable
              key={project.id}
              style={styles.projectRow}
              onPress={() =>
                router.push(`/admin/projects/${project.id}` as any)
              }
              accessibilityRole="button"
              accessibilityLabel={`Edit ${project.title}`}
            >
              <View style={[styles.projectDot, dotColor(project.type)]} />
              <View style={styles.projectInfo}>
                <Text style={styles.projectTitle}>{project.title}</Text>
                <Text style={styles.projectMeta}>
                  {project.type} ·{" "}
                  {project.technologies?.slice(0, 3).join(", ")}
                </Text>
              </View>
              {project.featured && (
                <View style={styles.featuredBadge}>
                  <Text style={styles.featuredBadgeText}>⭐ Featured</Text>
                </View>
              )}
            </Pressable>
          ))
        )}
      </View>

      <View style={styles.recentSection}>
        <View style={styles.recentHeader}>
          <Text style={styles.recentTitle}>Resume Status</Text>
          <Pressable
            onPress={() => router.push("/admin/resume" as any)}
            accessibilityRole="link"
            accessibilityLabel="Manage resume"
          >
            <Text style={styles.viewAllText}>Manage →</Text>
          </Pressable>
        </View>
        <View style={styles.resumeStatus}>
          <View
            style={[
              styles.resumeStatusDot,
              { backgroundColor: hasPDF ? "#22C55E" : "#EF4444" },
            ]}
          />
          <Text style={styles.resumeStatusText}>
            {hasPDF
              ? `PDF uploaded · Last updated ${
                  resumeData?.data?.updatedAt
                    ? new Date(resumeData.data.updatedAt).toLocaleDateString()
                    : "recently"
                }`
              : "No PDF uploaded — visitors cannot download your resume"}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
