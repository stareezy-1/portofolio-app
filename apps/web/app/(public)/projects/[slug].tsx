import React from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  Linking,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Head from "expo-router/head";
import { useProject, useProjects } from "@/lib/hooks/useProjects";
import { getRelatedProjects } from "@/lib/utils/validators";
import { DemoRunner } from "@/lib/ui/organisms/DemoRunner";
import { ProjectCard } from "@/lib/ui/molecules/ProjectCard";
import { aurora } from "@/lib/constants/aurora";
import styles from "./[slug].style";

export default function ProjectDetailPage() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const { data: project, isLoading } = useProject(slug ?? "");
  const { data: allProjects = [] } = useProjects();

  const related = project ? getRelatedProjects(project, allProjects) : [];

  if (isLoading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: aurora.deepSpace.value },
        ]}
      >
        <Text style={{ color: aurora.textSecondary.value, fontSize: 14 }}>
          Loading project...
        </Text>
      </View>
    );
  }

  if (!project) {
    return (
      <View
        style={[
          styles.errorContainer,
          { backgroundColor: aurora.deepSpace.value },
        ]}
      >
        <Text style={{ fontSize: 48, marginBottom: 16 }}>🔍</Text>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "700",
            color: aurora.starWhite.value,
            marginBottom: 8,
            textAlign: "center",
          }}
        >
          Project not found
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: aurora.textSecondary.value,
            textAlign: "center",
            marginBottom: 24,
          }}
        >
          The project you&apos;re looking for doesn&apos;t exist.
        </Text>
        <Pressable
          style={{
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: aurora.auroraGreen.value,
          }}
          onPress={() => router.push("/projects" as any)}
          accessibilityRole="button"
        >
          <Text style={{ color: aurora.auroraGreen.value, fontWeight: "600" }}>
            ← Back to Projects
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: aurora.deepSpace.value }}>
      <Head>
        <title>{project.title} — Stareezy Portfolio</title>
        <meta name="description" content={project.description.slice(0, 160)} />
      </Head>

      {/* Hero banner */}
      <View style={{ position: "relative", height: 280, overflow: "hidden" }}>
        {project.thumbnail ? (
          <Image
            source={{ uri: project.thumbnail }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
            accessibilityLabel={`${project.title} banner`}
          />
        ) : (
          <View style={{ flex: 1, backgroundColor: aurora.cosmicGray.value }} />
        )}
        {typeof window !== "undefined" && (
          <style>{`
            .project-hero-overlay {
              position: absolute; inset: 0;
              background: linear-gradient(to bottom, transparent 0%, ${aurora.deepSpace.value} 100%);
            }
            .project-detail-layout {
              display: flex;
              flex-direction: row;
              gap: 24px;
              padding: 0 24px 48px;
            }
            .project-detail-main { flex: 2; min-width: 0; }
            .project-detail-sidebar { flex: 1; min-width: 0; }
            @media (max-width: 768px) {
              .project-detail-layout { flex-direction: column; }
            }
            .related-grid {
              display: flex;
              flex-direction: row;
              flex-wrap: wrap;
              gap: 16px;
            }
            .related-grid-item {
              flex: 1;
              min-width: 260px;
              max-width: calc(33.333% - 11px);
            }
            @media (max-width: 768px) {
              .related-grid-item { max-width: 100%; }
            }
          `}</style>
        )}
        <div className="project-hero-overlay" />
        <View style={{ position: "absolute", bottom: 24, left: 24, right: 24 }}>
          <Text
            style={{
              fontSize: 28,
              fontWeight: "800",
              color: aurora.starWhite.value,
              letterSpacing: -0.5,
            }}
          >
            {project.title}
          </Text>
        </View>
      </View>

      {/* Breadcrumb */}
      <View style={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8 }}>
        <Pressable
          onPress={() => router.push("/projects" as any)}
          accessibilityRole="link"
        >
          <Text
            style={{
              color: aurora.auroraGreen.value,
              fontSize: 13,
              fontWeight: "600",
            }}
          >
            ← Back to Projects
          </Text>
        </Pressable>
      </View>

      {/* Two-column layout — stacks on mobile via CSS */}
      <div className="project-detail-layout">
        <div className="project-detail-main">
          <Text
            style={{
              fontSize: 15,
              color: aurora.textSecondary.value,
              lineHeight: 24,
              marginBottom: 24,
            }}
          >
            {project.description}
          </Text>

          {project.gallery && project.gallery.length > 0 && (
            <View style={{ marginBottom: 24 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "700",
                  color: aurora.starWhite.value,
                  marginBottom: 12,
                }}
              >
                Gallery
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {project.gallery.map((url, i) => (
                  <Image
                    key={i}
                    source={{ uri: url }}
                    style={{
                      width: 200,
                      height: 130,
                      borderRadius: 10,
                      marginRight: 12,
                      borderWidth: 1,
                      borderColor: aurora.borderSubtle.value,
                    }}
                    resizeMode="cover"
                    accessibilityLabel={`${project.title} gallery image ${
                      i + 1
                    }`}
                  />
                ))}
              </ScrollView>
            </View>
          )}

          {project.demoMode && (
            <View style={{ marginBottom: 24 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "700",
                  color: aurora.starWhite.value,
                  marginBottom: 12,
                }}
              >
                Live Demo
              </Text>
              <DemoRunner project={project} />
            </View>
          )}
        </div>

        <div className="project-detail-sidebar">
          <View
            style={{
              backgroundColor: aurora.surfaceDark.value,
              borderWidth: 1,
              borderColor: aurora.borderSubtle.value,
              borderRadius: 12,
              padding: 16,
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: "700",
                color: aurora.textMuted.value,
                textTransform: "uppercase",
                letterSpacing: 1,
                marginBottom: 12,
              }}
            >
              Technologies
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
              {project.technologies.map((tech) => (
                <View
                  key={tech}
                  style={{
                    backgroundColor: `${aurora.borderSubtle.value}80`,
                    borderWidth: 1,
                    borderColor: aurora.borderSubtle.value,
                    borderRadius: 6,
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: aurora.textSecondary.value,
                      fontWeight: "500",
                    }}
                  >
                    {tech}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View style={{ gap: 10 }}>
            {project.liveUrl && (
              <Pressable
                style={{
                  paddingVertical: 12,
                  borderRadius: 10,
                  backgroundColor: aurora.auroraGreen.value,
                  alignItems: "center",
                }}
                onPress={() => Linking.openURL(project.liveUrl!)}
                accessibilityRole="link"
              >
                <Text
                  style={{
                    color: aurora.deepSpace.value,
                    fontWeight: "700",
                    fontSize: 14,
                  }}
                >
                  🌐 Live Demo
                </Text>
              </Pressable>
            )}
            {project.githubUrl && (
              <Pressable
                style={{
                  paddingVertical: 12,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: aurora.borderSubtle.value,
                  alignItems: "center",
                }}
                onPress={() => Linking.openURL(project.githubUrl!)}
                accessibilityRole="link"
              >
                <Text
                  style={{
                    color: aurora.starWhite.value,
                    fontWeight: "600",
                    fontSize: 14,
                  }}
                >
                  ↗ View Source
                </Text>
              </Pressable>
            )}
            {project.appStoreUrl && (
              <Pressable
                style={{
                  paddingVertical: 12,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: aurora.borderSubtle.value,
                  alignItems: "center",
                }}
                onPress={() => Linking.openURL(project.appStoreUrl!)}
                accessibilityRole="link"
              >
                <Text
                  style={{
                    color: aurora.starWhite.value,
                    fontWeight: "600",
                    fontSize: 14,
                  }}
                >
                  🍎 App Store
                </Text>
              </Pressable>
            )}
            {project.playStoreUrl && (
              <Pressable
                style={{
                  paddingVertical: 12,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: aurora.borderSubtle.value,
                  alignItems: "center",
                }}
                onPress={() => Linking.openURL(project.playStoreUrl!)}
                accessibilityRole="link"
              >
                <Text
                  style={{
                    color: aurora.starWhite.value,
                    fontWeight: "600",
                    fontSize: 14,
                  }}
                >
                  🤖 Play Store
                </Text>
              </Pressable>
            )}
          </View>
        </div>
      </div>

      {/* Related projects — max 3 columns grid */}
      {related.length > 0 && (
        <View
          style={{
            paddingHorizontal: 24,
            paddingBottom: 48,
            borderTopWidth: 1,
            borderTopColor: aurora.borderSubtle.value,
            paddingTop: 32,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: aurora.starWhite.value,
              marginBottom: 16,
            }}
          >
            Related Projects
          </Text>
          <div className="related-grid">
            {related.map((p) => (
              <div key={p.id} className="related-grid-item">
                <ProjectCard
                  project={p}
                  onPress={() => router.push(`/projects/${p.slug}` as any)}
                />
              </div>
            ))}
          </div>
        </View>
      )}
    </View>
  );
}
