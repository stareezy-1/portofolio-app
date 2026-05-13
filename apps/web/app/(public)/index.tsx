import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Animated,
  AccessibilityInfo,
} from "react-native";
import { useRouter } from "expo-router";
import { HeroSection } from "@/lib/ui/organisms/HeroSection";
import { TechStackSection } from "@/lib/ui/organisms/TechStackSection";
import { Timeline } from "@/lib/ui/organisms/Timeline";
import { ProjectGrid } from "@/lib/ui/organisms/ProjectGrid";
import { ContactForm } from "@/lib/ui/organisms/ContactForm";
import { SocialLink } from "@/lib/ui/molecules/SocialLink";
import { useTheme } from "../../src/providers/theme-provider";
import { EThemeMode } from "@/lib/constants/enums";
import { useFeaturedProjects } from "@/lib/hooks/useProjects";
import { useContent } from "@/lib/hooks/useContent";
import styles from "./index.style";

function AnimatedSection({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);
  return (
    <Animated.View
      style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
    >
      {children}
    </Animated.View>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const { colors, mode } = useTheme();
  const isDark = mode === EThemeMode.DARK;
  const [reduceMotion, setReduceMotion] = useState(false);
  const { data: featuredData, isLoading: featuredLoading } =
    useFeaturedProjects();
  const { data: contentData } = useContent();

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      setReduceMotion(mq.matches);
    }
    AccessibilityInfo.isReduceMotionEnabled?.().then((enabled) => {
      if (enabled) setReduceMotion(true);
    });
  }, []);

  const content = contentData?.data;
  const featuredProjects = featuredData?.data ?? [];

  const Wrap = reduceMotion
    ? ({ children }: { children: React.ReactNode }) => <>{children}</>
    : AnimatedSection;

  const sectionAltBg = isDark ? "rgba(30,41,59,0.4)" : "rgba(241,245,249,0.9)";
  const statCardBg = isDark ? "rgba(30,41,59,0.6)" : "#FFFFFF";
  const statCardBorder = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)";
  const socialBorder = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)";

  // Dynamic data with fallbacks
  const name = content?.name ?? "Alex Johnson";
  const role = content?.role ?? "Full Stack Engineer";
  const tagline =
    content?.tagline ?? "Building modern web and mobile applications.";
  const bio =
    content?.bio ??
    "A passionate developer focused on clean architecture and great user experiences.";
  const yoe = content?.yearsOfExperience ?? 5;
  const projectsBuilt = content?.projectsBuilt ?? 30;
  const happyClients = content?.happyClients ?? 10;
  const socialLinks = content?.socialLinks ?? [
    { platform: "github", url: "https://github.com" },
    { platform: "linkedin", url: "https://linkedin.com" },
    { platform: "twitter", url: "https://twitter.com" },
    { platform: "email", url: "mailto:hello@example.com" },
  ];
  const techStack = content?.techStack ?? [];
  const workExperience = content?.workExperience ?? [];
  const education = content?.education ?? [];

  return (
    <View style={styles.container} accessible accessibilityLabel="Landing page">
      {/* Hero — fully dynamic */}
      <HeroSection
        title="Hi, I'm"
        name={name}
        subtitle={role}
        description={tagline}
        avatarUrl={content?.avatarUrl}
        onViewWork={() => router.push("/projects" as any)}
        onContact={() => {}}
      />

      {/* About */}
      <View style={styles.section} accessible accessibilityLabel="About">
        <Wrap delay={100}>
          <Text style={styles.eyebrow}>Who I Am</Text>
          <Text style={[styles.sectionHeading, { color: colors.text }]}>
            About Me
          </Text>
          <View style={styles.aboutGrid}>
            <View style={styles.aboutText}>
              <Text
                style={[styles.aboutParagraph, { color: colors.textSecondary }]}
              >
                {bio}
              </Text>
            </View>
            <View style={styles.aboutStats}>
              {[
                { icon: "🚀", value: `${yoe}+`, desc: "Years of Experience" },
                {
                  icon: "📦",
                  value: `${projectsBuilt}+`,
                  desc: "Projects Shipped",
                },
                {
                  icon: "⭐",
                  value: `${happyClients}+`,
                  desc: "Happy Clients",
                },
              ].map((s) => (
                <View
                  key={s.desc}
                  style={[
                    styles.statCard,
                    {
                      backgroundColor: statCardBg,
                      borderColor: statCardBorder,
                    },
                  ]}
                >
                  <Text style={styles.statIcon}>{s.icon}</Text>
                  <View style={styles.statInfo}>
                    <Text style={[styles.statValue, { color: colors.text }]}>
                      {s.value}
                    </Text>
                    <Text
                      style={[styles.statDesc, { color: colors.textSecondary }]}
                    >
                      {s.desc}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </Wrap>
      </View>

      {/* Tech Stack — dynamic */}
      <Wrap delay={200}>
        <TechStackSection
          categories={techStack.length > 0 ? techStack : undefined}
          isDark={isDark}
        />
      </Wrap>

      {/* Work Experience — dynamic */}
      <View style={styles.section} accessible accessibilityLabel="Experience">
        <Wrap delay={300}>
          <Text style={styles.eyebrow}>Career</Text>
          <Text style={[styles.sectionHeading, { color: colors.text }]}>
            Work Experience
          </Text>
          <Timeline
            items={
              workExperience.length > 0
                ? workExperience.map((w) => ({
                    id: w.id,
                    title: w.title,
                    organization: w.organization,
                    location: w.location,
                    startDate: w.startDate,
                    endDate: w.endDate,
                    description: w.description,
                    highlights: w.highlights ?? [],
                  }))
                : [
                    {
                      id: "1",
                      title: "Senior Full Stack Engineer",
                      organization: "TechCorp Inc.",
                      location: "San Francisco, CA",
                      startDate: "2022",
                      description:
                        "Leading development of a high-traffic SaaS platform.",
                      highlights: [
                        "Reduced API response time by 60%",
                        "Led a team of 5 engineers",
                      ],
                    },
                  ]
            }
            variant="experience"
            isDark={isDark}
          />
        </Wrap>
      </View>

      {/* Featured Projects */}
      <View
        style={[styles.sectionAlt, { backgroundColor: sectionAltBg }]}
        accessible
        accessibilityLabel="Featured projects"
      >
        <View style={styles.sectionInner}>
          <Wrap delay={400}>
            <Text style={styles.eyebrow}>Portfolio</Text>
            <Text style={[styles.featuredHeading, { color: colors.text }]}>
              Featured Projects
            </Text>
            <Text
              style={[
                styles.featuredSubheading,
                { color: colors.textSecondary },
              ]}
            >
              A selection of projects I'm proud of — from side projects to
              production systems.
            </Text>
            <ProjectGrid
              projects={featuredProjects}
              loading={featuredLoading}
              onProjectPress={(p) => router.push(`/projects/${p.slug}` as any)}
            />
            <View style={styles.viewAllRow}>
              <Pressable
                style={styles.viewAllButton}
                onPress={() => router.push("/projects" as any)}
                accessibilityRole="button"
                accessibilityLabel="View all projects"
              >
                <Text style={styles.viewAllText}>View All Projects →</Text>
              </Pressable>
            </View>
          </Wrap>
        </View>
      </View>

      {/* Education — dynamic */}
      <View
        style={styles.resumeSection}
        accessible
        accessibilityLabel="Education"
      >
        <Wrap delay={500}>
          <Text style={styles.eyebrow}>Background</Text>
          <Text style={[styles.resumeHeading, { color: colors.text }]}>
            Education
          </Text>
          <Text
            style={[styles.resumeSubheading, { color: colors.textSecondary }]}
          >
            Academic foundation that shaped my engineering mindset.
          </Text>
          <Timeline
            items={
              education.length > 0
                ? education.map((e) => ({
                    id: e.id,
                    title: e.title,
                    organization: e.organization,
                    location: e.location,
                    startDate: e.startDate,
                    endDate: e.endDate,
                    description: e.description,
                    highlights: e.highlights ?? [],
                  }))
                : [
                    {
                      id: "e1",
                      title: "B.Sc. Computer Science",
                      organization: "State University",
                      location: "Boston, MA",
                      startDate: "2015",
                      endDate: "2019",
                      description:
                        "Focused on software engineering, algorithms, and distributed systems.",
                      highlights: ["GPA: 3.8 / 4.0 — Dean's List"],
                    },
                  ]
            }
            variant="education"
            isDark={isDark}
          />
        </Wrap>
      </View>

      {/* Contact */}
      <View
        style={[styles.sectionAlt, { backgroundColor: sectionAltBg }]}
        accessible
        accessibilityLabel="Contact"
      >
        <Wrap delay={600}>
          <ContactForm />
        </Wrap>
      </View>

      {/* Social Links — dynamic */}
      <View
        style={[styles.socialSection, { borderTopColor: socialBorder }]}
        accessible
        accessibilityLabel="Social links"
      >
        <Text style={[styles.socialHeading, { color: colors.textSecondary }]}>
          Find me online
        </Text>
        <View style={styles.socialLinks}>
          {socialLinks.map((link) => (
            <SocialLink
              key={link.platform}
              platform={link.platform}
              url={link.url}
            />
          ))}
        </View>
      </View>
    </View>
  );
}
