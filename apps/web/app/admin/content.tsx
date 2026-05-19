import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useContent, useUpdateContent } from "@/lib/hooks/useContent";
import type {
  IPortfolioContent,
  ISocialLink,
  ITechCategory,
  IWorkExperience,
  IEducation,
} from "@/lib/types/content";
import { IdentityTab } from "../../src/components/admin/content/IdentityTab";
import { SocialTab } from "../../src/components/admin/content/SocialTab";
import { TechTab } from "../../src/components/admin/content/TechTab";
import { WorkTab } from "../../src/components/admin/content/WorkTab";
import { EduTab } from "../../src/components/admin/content/EduTab";
import { S } from "../../src/components/admin/content/styles";

const TABS = [
  "Identity",
  "Social",
  "Tech Stack",
  "Experience",
  "Education",
] as const;
type Tab = (typeof TABS)[number];

export default function AdminContentPage() {
  const { data, isLoading } = useContent();
  const updateContent = useUpdateContent();

  const [activeTab, setActiveTab] = useState<Tab>("Identity");
  const [form, setForm] = useState<Partial<IPortfolioContent>>({});
  const [socialLinks, setSocialLinks] = useState<ISocialLink[]>([]);
  const [techStack, setTechStack] = useState<ITechCategory[]>([]);
  const [workExp, setWorkExp] = useState<IWorkExperience[]>([]);
  const [education, setEducation] = useState<IEducation[]>([]);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (data) {
      const c = data;
      setForm(c);
      setSocialLinks(c.socialLinks ?? []);
      setTechStack(c.techStack ?? []);
      setWorkExp(c.workExperience ?? []);
      setEducation(c.education ?? []);
    }
  }, [data]);

  // Stable setter — won't cause child re-renders that lose focus
  const setField = useCallback((k: keyof IPortfolioContent, v: any) => {
    setForm((prev) => ({ ...prev, [k]: v }));
  }, []);

  const handleSave = async () => {
    setError(null);
    setSaved(false);
    try {
      await updateContent.mutateAsync({
        ...form,
        socialLinks,
        techStack,
        workExperience: workExp,
        education,
      } as IPortfolioContent);
      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
    } catch (err: any) {
      setError(
        err?.response?.data?.error?.message ?? err?.message ?? "Save failed",
      );
    }
  };

  if (isLoading) {
    return (
      <View
        style={[
          S.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <ScrollView style={S.container} contentContainerStyle={S.scroll}>
      <Text style={S.eyebrow}>Site Management</Text>
      <Text style={S.pageTitle}>Portfolio Content</Text>
      <Text style={S.pageSubtitle}>
        Edit everything shown on your public portfolio page.
      </Text>

      {saved && (
        <View style={S.successBanner}>
          <Text style={S.successText}>✓ Content saved successfully!</Text>
        </View>
      )}
      {error && (
        <View style={S.errorBanner}>
          <Text style={S.errorText}>⚠️ {error}</Text>
        </View>
      )}

      {/* Tab bar */}
      <View style={S.tabs}>
        {TABS.map((tab) => (
          <Pressable
            key={tab}
            style={[S.tab, activeTab === tab && S.tabActive]}
            onPress={() => setActiveTab(tab)}
            accessibilityRole="tab"
            accessibilityLabel={tab}
            accessibilityState={{ selected: activeTab === tab }}
          >
            <Text style={[S.tabText, activeTab === tab && S.tabTextActive]}>
              {tab}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Tab content — each is a stable module-level component */}
      {activeTab === "Identity" && <IdentityTab form={form} set={setField} />}
      {activeTab === "Social" && (
        <SocialTab links={socialLinks} onChange={setSocialLinks} />
      )}
      {activeTab === "Tech Stack" && (
        <TechTab stack={techStack} onChange={setTechStack} />
      )}
      {activeTab === "Experience" && (
        <WorkTab items={workExp} onChange={setWorkExp} />
      )}
      {activeTab === "Education" && (
        <EduTab items={education} onChange={setEducation} />
      )}

      <Pressable
        style={[S.saveBtn, updateContent.isPending && S.saveBtnDisabled]}
        onPress={handleSave}
        disabled={updateContent.isPending}
        accessibilityRole="button"
        accessibilityLabel="Save all changes"
      >
        {updateContent.isPending ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={S.saveBtnText}>💾 Save All Changes</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}
