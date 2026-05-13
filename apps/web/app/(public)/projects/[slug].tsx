import React from "react";
import { View, Text, Image, Pressable, Linking } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useProject } from "@/lib/hooks/useProjects";
import { useTheme } from "../../../src/providers/theme-provider";
import { useMetadata } from "../../../src/components/MetaHead";
import { DemoRunner } from "@/lib/ui/organisms/DemoRunner";
import styles from "./[slug].style";

export default function ProjectDetailPage() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { data, isLoading, error } = useProject(slug ?? "");

  const project = data?.data;

  useMetadata({
    title: project?.title ?? "Project",
    description: project?.description ?? "Project details",
    image: project?.thumbnail,
    url: `/projects/${slug}`,
  });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Loading project...
        </Text>
      </View>
    );
  }

  if (error || !project) {
    return (
      <View style={styles.errorContainer}>
        <Text style={{ fontSize: 48, marginBottom: 16 }}>🔍</Text>
        <Text
          style={[
            styles.errorText,
            { color: colors.text, fontSize: 20, fontWeight: "700" },
          ]}
        >
          Project not found
        </Text>
        <Pressable
          style={[styles.link, { marginTop: 20 }]}
          onPress={() => router.push("/projects" as any)}
          accessibilityRole="button"
          accessibilityLabel="Back to projects"
        >
          <Text style={styles.linkText}>← Back to Projects</Text>
        </Pressable>
      </View>
    );
  }

  const handleLinkPress = (url: string) => Linking.openURL(url);

  return (
    <View
      style={styles.container}
      accessible
      accessibilityLabel={`Project: ${project.title}`}
    >
      {/* Back */}
      <Pressable
        style={styles.backButton}
        onPress={() => router.push("/projects" as any)}
        accessibilityRole="button"
        accessibilityLabel="Back to projects"
      >
        <Text style={styles.backText}>← All Projects</Text>
      </Pressable>

      {/* Thumbnail */}
      {project.thumbnail ? (
        <Image
          source={{ uri: project.thumbnail }}
          style={styles.thumbnail}
          accessibilityLabel={`${project.title} thumbnail`}
          resizeMode="cover"
        />
      ) : null}

      {/* Type badge */}
      <View style={styles.typeBadge}>
        <Text style={styles.typeBadgeText}>{project.type}</Text>
      </View>

      {/* Title */}
      <Text style={[styles.title, { color: colors.text }]}>
        {project.title}
      </Text>

      {/* Description */}
      <Text style={[styles.description, { color: colors.textSecondary }]}>
        {project.description}
      </Text>

      {/* Demo Runner */}
      {project.demoMode && (
        <View style={styles.section}>
          <Text style={[styles.sectionHeading, { color: colors.text }]}>
            Live Demo
          </Text>
          <DemoRunner project={project} />
        </View>
      )}

      {/* Technologies */}
      {project.technologies && project.technologies.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionHeading, { color: colors.text }]}>
            Technologies
          </Text>
          <View style={styles.technologies}>
            {project.technologies.map((tech) => (
              <View key={tech} style={styles.techBadge}>
                <Text style={styles.techBadgeText}>{tech}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Gallery */}
      {project.gallery && project.gallery.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionHeading, { color: colors.text }]}>
            Gallery
          </Text>
          <View style={styles.gallery}>
            {project.gallery.map((imageUrl, index) => (
              <Image
                key={index}
                source={{ uri: imageUrl }}
                style={styles.galleryImage}
                accessibilityLabel={`${project.title} gallery image ${index + 1}`}
                resizeMode="cover"
              />
            ))}
          </View>
        </View>
      )}

      {/* Links */}
      {(project.githubUrl ||
        project.liveUrl ||
        project.playStoreUrl ||
        project.appStoreUrl) && (
        <View style={styles.section}>
          <Text style={[styles.sectionHeading, { color: colors.text }]}>
            Links
          </Text>
          <View style={styles.links}>
            {project.githubUrl && (
              <Pressable
                style={styles.link}
                onPress={() => handleLinkPress(project.githubUrl!)}
                accessibilityRole="link"
                accessibilityLabel="View source on GitHub"
              >
                <Text style={styles.linkText}>🐙 GitHub</Text>
              </Pressable>
            )}
            {project.liveUrl && (
              <Pressable
                style={styles.link}
                onPress={() => handleLinkPress(project.liveUrl!)}
                accessibilityRole="link"
                accessibilityLabel="View live project"
              >
                <Text style={styles.linkText}>🌐 Live Demo</Text>
              </Pressable>
            )}
            {project.playStoreUrl && (
              <Pressable
                style={styles.link}
                onPress={() => handleLinkPress(project.playStoreUrl!)}
                accessibilityRole="link"
                accessibilityLabel="View on Play Store"
              >
                <Text style={styles.linkText}>🤖 Play Store</Text>
              </Pressable>
            )}
            {project.appStoreUrl && (
              <Pressable
                style={styles.link}
                onPress={() => handleLinkPress(project.appStoreUrl!)}
                accessibilityRole="link"
                accessibilityLabel="View on App Store"
              >
                <Text style={styles.linkText}>🍎 App Store</Text>
              </Pressable>
            )}
          </View>
        </View>
      )}
    </View>
  );
}
