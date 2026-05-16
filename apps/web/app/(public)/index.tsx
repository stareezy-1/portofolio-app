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
  const name = content?.name ?? "Muhammad Bintang Al Akbar";
  const role = content?.role ?? "Software Engineer (Front End Focus)";
  const tagline =
    content?.tagline ??
    "Building modern web and mobile applications with React & React Native.";
  const bio =
    content?.bio ??
    "Motivated and detail-oriented Front-End Developer with 3+ years of experience specializing in React and React Native development.";
  const yoe = content?.yearsOfExperience ?? 3;
  const projectsBuilt = content?.projectsBuilt ?? 9;
  const happyClients = content?.happyClients ?? 3;
  const socialLinks = content?.socialLinks ?? [
    { platform: "github", url: "https://github.com/stareezy-1" },
    {
      platform: "linkedin",
      url: "https://id.linkedin.com/in/muhammad-bintang-al-akbar-72302812a",
    },
    { platform: "instagram", url: "https://www.instagram.com/stareezy/" },
    { platform: "email", url: "mailto:bintangmuhammad12@gmail.com" },
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
                      id: "exp-1",
                      title: "Front End Developer",
                      organization: "Rekosistem",
                      location: "Jakarta, Indonesia",
                      startDate: "10/2023",
                      description:
                        "Develop and maintain ongoing projects using React.js and React Native. Work on ERP system development and state management optimization.",
                      highlights: [
                        "Develop and maintain 9+ ongoing projects using React.js and React Native",
                        "Develop and enhance ERP system to optimize internal business processes",
                        "Implement state management using Redux, MobX, and Zustand for efficient data flow",
                        "Optimize CI/CD pipelines, automating deployments, APK builds, and testing workflows",
                        "Write unit tests with Jest to ensure application stability",
                      ],
                    },
                    {
                      id: "exp-2",
                      title: "Mobile Developer",
                      organization:
                        "PT. Extramarks Education Indonesia (Kelas Pintar)",
                      location: "Jakarta, Indonesia",
                      startDate: "04/2023",
                      endDate: "09/2024",
                      description:
                        "Developed React Native revamp project for Kelas Pintar App using TypeScript.",
                      highlights: [
                        "Developed React Native revamp project for Kelas Pintar App using TypeScript",
                        "Built reusable components and optimized state management with Redux",
                        "Ensured project delivery within 3-month deployment timeline",
                      ],
                    },
                    {
                      id: "exp-3",
                      title: "Full Stack Developer",
                      organization: "PT Nawa Data Solutions",
                      location: "South Tangerang, Banten",
                      startDate: "10/2022",
                      endDate: "03/2023",
                      description:
                        "Worked as Full Stack Developer in Research and Development Division, under Nawa Framework & Digital Enabler Department.",
                      highlights: [
                        "Developed Nawadata's internal framework using React.js, .NET Core, and React Native",
                        "Implemented backend CRUD API using .NET Core",
                      ],
                    },
                    {
                      id: "exp-4",
                      title: "IT Support",
                      organization: "AIA Group Limited",
                      location: "South Jakarta, Jakarta",
                      startDate: "12/2021",
                      endDate: "03/2022",
                      description:
                        "Provided IT support including network configuration and documentation.",
                      highlights: [
                        "Configuring Networking using Mikrotik Router and Cisco Switch",
                        "Configuring Domain and VPN",
                        "Troubleshooting problematic computer systems or network components",
                        "Respond to all inquiries and requests in a timely manner",
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
                      id: "edu-1",
                      title: "System Information (S1)",
                      organization: "Universitas Gunadarma",
                      location: "Bekasi, Jawa Barat",
                      startDate: "2018",
                      endDate: "12/2022",
                      description:
                        "Bachelor's degree in Information Systems with strong academic performance.",
                      highlights: [
                        "Cumulative GPA: 3.77 / 4.0",
                        "2019 Runner-Up Fast Correct Category in Unlimited Software Building Contest",
                      ],
                    },
                    {
                      id: "edu-2",
                      title: "React Native Developer Bootcamp",
                      organization: "Binar Academy",
                      location: "Jakarta, Indonesia",
                      startDate: "08/2022",
                      endDate: "08/2022",
                      description:
                        "Intensive bootcamp focused on React Native development.",
                      highlights: [
                        "Completed React Native Developer Bootcamp, mastering Redux Thunk, Jest, ESLint, and CI/CD",
                        "Built a SecondHand Marketplace App as a final project",
                      ],
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

      {/* Social Links — dynamic
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
      </View> */}
    </View>
  );
}
