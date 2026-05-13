import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";
import { useUploadFile } from "@/lib/hooks/useAdmin";
import type { IProjectCreateInput } from "@/lib/types/api";
import type { IProject } from "@/lib/types/project";
import styles from "./ProjectForm.style";

interface ProjectFormProps {
  project?: IProject;
  onSubmit: (input: IProjectCreateInput) => void;
  loading?: boolean;
  error?: string | null;
}

export function ProjectForm({
  project,
  onSubmit,
  loading,
  error: externalError,
}: ProjectFormProps) {
  const uploadFile = useUploadFile();

  const [title, setTitle] = useState(project?.title ?? "");
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [type, setType] = useState<"web" | "mobile" | "backend">(
    (project?.type as any) ?? "web",
  );
  const [technologies, setTechnologies] = useState(
    project?.technologies?.join(", ") ?? "",
  );
  const [thumbnail, setThumbnail] = useState(project?.thumbnail ?? "");
  const [gallery, setGallery] = useState<string[]>(project?.gallery ?? []);
  const [githubUrl, setGithubUrl] = useState(project?.githubUrl ?? "");
  const [liveUrl, setLiveUrl] = useState(project?.liveUrl ?? "");
  const [featured, setFeatured] = useState(project?.featured ?? false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  const displayError = externalError ?? validationError;

  // Auto-generate slug from title
  const handleTitleChange = useCallback(
    (val: string) => {
      setTitle(val);
      if (!project) {
        setSlug(
          val
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, ""),
        );
      }
    },
    [project],
  );

  const handleImageUpload = useCallback(async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/jpeg,image/png,image/webp";
    input.onchange = async (e: any) => {
      const file = e.target?.files?.[0];
      if (!file) return;
      setUploadingImage(true);
      try {
        const result = await uploadFile.mutateAsync(file);
        setThumbnail(result.data.url);
      } catch {
        setValidationError(
          "Image upload failed. Use JPG, PNG, or WEBP under 5MB.",
        );
      } finally {
        setUploadingImage(false);
      }
    };
    input.click();
  }, [uploadFile]);

  const handleGalleryUpload = useCallback(async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/jpeg,image/png,image/webp";
    input.multiple = true;
    input.onchange = async (e: any) => {
      const files: File[] = Array.from(e.target?.files ?? []);
      if (!files.length) return;
      setUploadingGallery(true);
      try {
        const urls = await Promise.all(
          files.map((file) =>
            uploadFile.mutateAsync(file).then((r) => r.data.url),
          ),
        );
        setGallery((prev) => [...prev, ...urls]);
      } catch {
        setValidationError(
          "Gallery upload failed. Use JPG, PNG, or WEBP under 5MB each.",
        );
      } finally {
        setUploadingGallery(false);
      }
    };
    input.click();
  }, [uploadFile]);

  const removeGalleryImage = useCallback((index: number) => {
    setGallery((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSubmit = useCallback(() => {
    if (!title.trim() || !slug.trim() || !description.trim() || !type) {
      setValidationError("Title, slug, description, and type are required.");
      return;
    }
    setValidationError(null);

    const input: IProjectCreateInput = {
      title: title.trim(),
      slug: slug.trim(),
      description: description.trim(),
      type,
      technologies: technologies
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      thumbnail: thumbnail.trim() || undefined,
      gallery: gallery.length > 0 ? gallery : undefined,
      githubUrl: githubUrl.trim() || undefined,
      liveUrl: liveUrl.trim() || undefined,
      featured,
    };

    onSubmit(input);
  }, [
    title,
    slug,
    description,
    type,
    technologies,
    thumbnail,
    githubUrl,
    liveUrl,
    featured,
    onSubmit,
  ]);

  return (
    <View style={styles.form}>
      {displayError && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>{displayError}</Text>
        </View>
      )}

      {/* Basic Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Info</Text>

        <View style={styles.fieldWrapper}>
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={handleTitleChange}
            placeholder="My Awesome Project"
            placeholderTextColor="#334155"
            accessibilityLabel="Project title"
          />
        </View>

        <View style={styles.fieldWrapper}>
          <Text style={styles.label}>Slug *</Text>
          <TextInput
            style={styles.input}
            value={slug}
            onChangeText={setSlug}
            placeholder="my-awesome-project"
            placeholderTextColor="#334155"
            autoCapitalize="none"
            accessibilityLabel="Project slug"
          />
          <Text style={styles.hint}>
            URL-friendly identifier. Auto-generated from title.
          </Text>
        </View>

        <View style={styles.fieldWrapper}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Describe what this project does, the problem it solves, and the tech used..."
            placeholderTextColor="#334155"
            multiline
            numberOfLines={4}
            accessibilityLabel="Project description"
          />
        </View>

        <View style={styles.fieldWrapper}>
          <Text style={styles.label}>Type *</Text>
          <View style={styles.typeRow}>
            {(["web", "mobile", "backend"] as const).map((t) => (
              <Pressable
                key={t}
                style={[
                  styles.typeButton,
                  type === t && styles.typeButtonActive,
                ]}
                onPress={() => setType(t)}
                accessibilityRole="button"
                accessibilityLabel={`Type: ${t}`}
                accessibilityState={{ selected: type === t }}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    type === t && styles.typeButtonTextActive,
                  ]}
                >
                  {t === "web"
                    ? "🌐 Web"
                    : t === "mobile"
                      ? "📱 Mobile"
                      : "⚙️ Backend"}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>

      {/* Media */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Media</Text>

        <View style={styles.fieldWrapper}>
          <Text style={styles.label}>Thumbnail</Text>
          <View style={styles.uploadRow}>
            <TextInput
              style={[styles.input, styles.uploadInput]}
              value={thumbnail}
              onChangeText={setThumbnail}
              placeholder="https://... or upload below"
              placeholderTextColor="#334155"
              accessibilityLabel="Thumbnail URL"
            />
            <Pressable
              style={styles.uploadButton}
              onPress={handleImageUpload}
              disabled={uploadingImage}
              accessibilityRole="button"
              accessibilityLabel="Upload image"
            >
              {uploadingImage ? (
                <ActivityIndicator size="small" color="#94A3B8" />
              ) : (
                <Text style={styles.uploadButtonText}>📁 Upload</Text>
              )}
            </Pressable>
          </View>
          {thumbnail ? (
            <Image
              source={{ uri: thumbnail }}
              style={styles.thumbnailPreview}
              resizeMode="cover"
              accessibilityLabel="Thumbnail preview"
            />
          ) : null}
        </View>

        {/* Gallery */}
        <View style={styles.fieldWrapper}>
          <Text style={styles.label}>Gallery</Text>
          <Text style={styles.hint}>
            Upload multiple images for the project gallery. Select multiple
            files at once.
          </Text>

          <Pressable
            style={[styles.uploadButton, { marginTop: 8, marginBottom: 12 }]}
            onPress={handleGalleryUpload}
            disabled={uploadingGallery}
            accessibilityRole="button"
            accessibilityLabel="Upload gallery images"
          >
            {uploadingGallery ? (
              <ActivityIndicator size="small" color="#94A3B8" />
            ) : (
              <Text style={styles.uploadButtonText}>📁 Add Gallery Images</Text>
            )}
          </Pressable>

          {gallery.length > 0 && (
            <View style={styles.galleryGrid}>
              {gallery.map((url, index) => (
                <View key={index} style={styles.galleryItem}>
                  <Image
                    source={{ uri: url }}
                    style={styles.galleryThumb}
                    resizeMode="cover"
                    accessibilityLabel={`Gallery image ${index + 1}`}
                  />
                  <Pressable
                    style={styles.galleryRemove}
                    onPress={() => removeGalleryImage(index)}
                    accessibilityRole="button"
                    accessibilityLabel={`Remove gallery image ${index + 1}`}
                  >
                    <Text style={styles.galleryRemoveText}>✕</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>

      {/* Tech Stack */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tech Stack</Text>

        <View style={styles.fieldWrapper}>
          <Text style={styles.label}>Technologies</Text>
          <TextInput
            style={styles.input}
            value={technologies}
            onChangeText={setTechnologies}
            placeholder="React, TypeScript, Go, PostgreSQL"
            placeholderTextColor="#334155"
            accessibilityLabel="Technologies"
          />
          <Text style={styles.hint}>
            Comma-separated list of technologies used.
          </Text>
        </View>
      </View>

      {/* Links */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Links</Text>

        <View style={styles.row}>
          <View style={styles.fieldWrapper}>
            <Text style={styles.label}>GitHub URL</Text>
            <TextInput
              style={styles.input}
              value={githubUrl}
              onChangeText={setGithubUrl}
              placeholder="https://github.com/..."
              placeholderTextColor="#334155"
              autoCapitalize="none"
              accessibilityLabel="GitHub URL"
            />
          </View>
          <View style={styles.fieldWrapper}>
            <Text style={styles.label}>Live URL</Text>
            <TextInput
              style={styles.input}
              value={liveUrl}
              onChangeText={setLiveUrl}
              placeholder="https://..."
              placeholderTextColor="#334155"
              autoCapitalize="none"
              accessibilityLabel="Live URL"
            />
          </View>
        </View>
      </View>

      {/* Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>

        <Pressable
          style={styles.toggleRow}
          onPress={() => setFeatured(!featured)}
          accessibilityRole="switch"
          accessibilityState={{ checked: featured }}
          accessibilityLabel="Featured project"
        >
          <View style={styles.toggleInfo}>
            <Text style={styles.toggleLabel}>Featured Project</Text>
            <Text style={styles.toggleDesc}>
              Show this project on the landing page highlights.
            </Text>
          </View>
          <View style={[styles.toggle, featured && styles.toggleActive]}>
            <View
              style={[styles.toggleThumb, featured && styles.toggleThumbActive]}
            />
          </View>
        </Pressable>
      </View>

      <Pressable
        style={[styles.submitButton, loading && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
        accessibilityRole="button"
        accessibilityLabel={project ? "Update project" : "Create project"}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.submitButtonText}>
            {project ? "💾 Update Project" : "🚀 Create Project"}
          </Text>
        )}
      </Pressable>
    </View>
  );
}
