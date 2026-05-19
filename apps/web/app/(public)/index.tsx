import React, { useEffect, useRef, useState } from "react";
import Head from "expo-router/head";
import {
  View,
  Text,
  Pressable,
  Animated,
  AccessibilityInfo,
  ScrollView,
  Linking,
} from "react-native";
import { useRouter } from "expo-router";
import { AuroraHero } from "@/lib/ui/organisms/AuroraHero";
import { TechStackGrid } from "@/lib/ui/organisms/TechStackGrid";
import { TimelineItem } from "@/lib/ui/molecules/TimelineItem";
import { ProjectCard } from "@/lib/ui/molecules/ProjectCard";
import { HireMeSection } from "@/lib/ui/organisms/HireMeSection";
import { ContactForm } from "@/lib/ui/organisms/ContactForm";
import { useFeaturedProjects } from "@/lib/hooks/useProjects";
import { useContent } from "@/lib/hooks/useContent";
import { sortTimelineEntries } from "@/lib/utils/validators";
import { aurora } from "@/lib/constants/aurora";
import type {
  // IWorkExperience,
  IEducation,
} from "@/lib/types/content";
import styles from "./index.style";

export default function LandingPage() {
  const router = useRouter();
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

  const content = contentData;
  const featuredProjects = featuredData ?? [];

  // Dynamic data with fallbacks
  const name = content?.name ?? "Muhammad Bintang Al Akbar";
  const tagline =
    content?.tagline ??
    "Building modern web and mobile applications with React & React Native.";
  const bio =
    content?.bio ??
    "Motivated and detail-oriented Front-End Developer with 3+ years of experience specializing in React and React Native development.";
  const yoe = content?.yearsOfExperience ?? 3;
  const projectsBuilt = content?.projectsBuilt ?? 9;
  const happyClients = content?.happyClients ?? 3;
  const techStack = content?.techStack ?? [];
  // const workExperience: IWorkExperience[] = content?.workExperience ?? [];
  const education: IEducation[] = content?.education ?? [];

  const sortedWork =
    // sortTimelineEntries(
    // workExperience.length > 2
    //   ? workExperience
    //   :
    [
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
        organization: "PT. Extramarks Education Indonesia (Kelas Pintar)",
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
          "Develop design documents, user guides, maintenance documents, and release documents",
          "Respond to all inquiries and requests in a timely manner",
        ],
      },
    ];
  // ,// );

  const sortedEdu =
    // sortTimelineEntries(
    // education.length > 0
    //   ? education
    //     :
    [
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
        description: "Intensive bootcamp focused on React Native development.",
        highlights: [
          "Completed React Native Developer Bootcamp, mastering Redux Thunk, Jest, ESLint, and CI/CD",
          "Built a SecondHand Marketplace App as a final project",
        ],
      },
    ];
  //   ,
  // );

  return (
    <View style={styles.container} accessible accessibilityLabel="Landing page">
      <Head>
        <title>
          Muhammad Bintang Al Akbar — Front-End Developer | Stareezy
        </title>
        <meta
          name="description"
          content="Muhammad Bintang Al Akbar — Front-End Developer with 3+ years experience in React & React Native."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://stareezy.tech/" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://stareezy.tech/" />
        <meta
          property="og:title"
          content="Muhammad Bintang Al Akbar — Front-End Developer"
        />
        <meta
          property="og:image"
          content="https://stareezy.tech/og-image.svg"
        />
        <meta name="theme-color" content={aurora.deepSpace.value} />
        <link rel="manifest" href="/manifest.webmanifest" />
      </Head>

      {/* Hero */}
      <AuroraHero
        name={name}
        tagline={tagline}
        yearsOfExperience={yoe}
        projectsBuilt={projectsBuilt}
        happyClients={happyClients}
      />

      {/* About */}
      <View
        style={[styles.section, { backgroundColor: aurora.deepSpace.value }]}
        accessible
        accessibilityLabel="About"
      >
        <Text style={[styles.eyebrow, { color: aurora.auroraGreen.value }]}>
          Who I Am
        </Text>
        <Text
          style={[styles.sectionHeading, { color: aurora.starWhite.value }]}
        >
          About Me
        </Text>
        <View style={styles.aboutGrid}>
          <View style={styles.aboutText}>
            <Text
              style={[
                styles.aboutParagraph,
                { color: aurora.textSecondary.value },
              ]}
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
              { icon: "⭐", value: `${happyClients}+`, desc: "Happy Clients" },
            ].map((s) => (
              <View
                key={s.desc}
                style={[
                  styles.statCard,
                  {
                    backgroundColor: aurora.surfaceDark.value,
                    borderColor: aurora.borderSubtle.value,
                  },
                ]}
              >
                <Text style={styles.statIcon}>{s.icon}</Text>
                <View style={styles.statInfo}>
                  <Text
                    style={[
                      styles.statValue,
                      { color: aurora.auroraGreen.value },
                    ]}
                  >
                    {s.value}
                  </Text>
                  <Text
                    style={[
                      styles.statDesc,
                      { color: aurora.textSecondary.value },
                    ]}
                  >
                    {s.desc}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Tech Stack */}
      <TechStackGrid categories={techStack} />

      {/* Work Experience */}
      <View
        style={[styles.section, { backgroundColor: aurora.deepSpace.value }]}
        accessible
        accessibilityLabel="Experience"
      >
        <Text style={[styles.eyebrow, { color: aurora.auroraGreen.value }]}>
          Career
        </Text>
        <Text
          style={[styles.sectionHeading, { color: aurora.starWhite.value }]}
        >
          Work Experience
        </Text>
        <View role="list" accessibilityRole="list">
          {sortedWork.map((item, idx) => (
            <TimelineItem
              key={item.id}
              item={item}
              isActive={idx === 0}
              isLast={idx === sortedWork.length - 1}
            />
          ))}
        </View>
      </View>

      {/* Featured Projects */}
      <View
        style={[
          styles.sectionAlt,
          { backgroundColor: aurora.cosmicGray.value },
        ]}
        accessible
        accessibilityLabel="Featured projects"
      >
        <View style={styles.sectionInner}>
          <Text style={[styles.eyebrow, { color: aurora.auroraGreen.value }]}>
            Portfolio
          </Text>
          <Text
            style={[styles.featuredHeading, { color: aurora.starWhite.value }]}
          >
            Featured Projects
          </Text>
          <Text
            style={[
              styles.featuredSubheading,
              { color: aurora.textSecondary.value },
            ]}
          >
            A selection of projects I'm proud of — from side projects to
            production systems.
          </Text>
          {typeof window !== "undefined" && (
            <style>{`
              .project-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 16px;
              }
              @media (max-width: 768px) {
                .project-grid { grid-template-columns: repeat(2, 1fr); }
              }
              @media (max-width: 480px) {
                .project-grid { grid-template-columns: 1fr; }
              }
            `}</style>
          )}
          {featuredLoading ? (
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 16 }}>
              {[1, 2, 3].map((i) => (
                <View
                  key={i}
                  style={{
                    height: 200,
                    backgroundColor: aurora.surfaceDark.value,
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: aurora.borderSubtle.value,
                    flex: 1,
                    minWidth: 260,
                  }}
                />
              ))}
            </View>
          ) : typeof window !== "undefined" ? (
            <div className="project-grid">
              {featuredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onPress={() =>
                    router.push(`/projects/${project.slug}` as any)
                  }
                />
              ))}
            </div>
          ) : (
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 16 }}>
              {featuredProjects.map((project) => (
                <View key={project.id} style={{ flex: 1, minWidth: 260 }}>
                  <ProjectCard
                    project={project}
                    onPress={() =>
                      router.push(`/projects/${project.slug}` as any)
                    }
                  />
                </View>
              ))}
            </View>
          )}
          <View style={styles.viewAllRow}>
            <Pressable
              style={[
                styles.viewAllButton,
                { borderColor: aurora.auroraGreen.value },
              ]}
              onPress={() => router.push("/projects" as any)}
              accessibilityRole="button"
              accessibilityLabel="View all projects"
            >
              <Text
                style={[
                  styles.viewAllText,
                  { color: aurora.auroraGreen.value },
                ]}
              >
                View All Projects →
              </Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Education */}
      <View
        style={[
          styles.resumeSection,
          { backgroundColor: aurora.deepSpace.value },
        ]}
        accessible
        accessibilityLabel="Education"
      >
        <Text style={[styles.eyebrow, { color: aurora.auroraGreen.value }]}>
          Background
        </Text>
        <Text style={[styles.resumeHeading, { color: aurora.starWhite.value }]}>
          Education
        </Text>
        <View role="list" accessibilityRole="list">
          {sortedEdu.map((item, idx) => (
            <TimelineItem
              key={item.id}
              item={item}
              isActive={false}
              isLast={idx === sortedEdu.length - 1}
            />
          ))}
        </View>
      </View>

      {/* Hire Me CTA */}
      <HireMeSection />

      {/* Contact */}
      <View
        style={[
          styles.sectionAlt,
          { backgroundColor: aurora.surfaceDark.value },
        ]}
        accessible
        accessibilityLabel="Contact"
      >
        <ContactForm />
      </View>
    </View>
  );
}
