import type { IApiResponse } from "../types/api";
import type { IProject } from "../types/project";
import { EProjectType } from "../constants/enums";

// Hardcoded until backend is deployed
export const HARDCODED_PROJECTS: IProject[] = [
  {
    id: "a1b2c3d4-0001-4000-8000-000000000001",
    title: "Aurora PDF",
    slug: "aurora-pdf",
    description:
      "A fully client-side PDF toolkit built with React, TypeScript, and Vite. Supports PDF compression, splitting, merging, watermarking, signing, OCR, and format conversions (Word ↔ PDF, Excel ↔ PDF, PDF → JPG) — all processed in the browser with zero server uploads, ensuring complete privacy.",
    thumbnail:
      "https://res.cloudinary.com/diwktkaxv/image/upload/v1778914286/aruora-pdf_bvllkw.png",
    gallery: [],
    technologies: [
      "React",
      "TypeScript",
      "Vite",
      "pdf-lib",
      "Tesseract.js",
      "Tailwind CSS",
    ],
    type: EProjectType.WEB,
    githubUrl: "https://github.com/stareezy-1/aurora-pdf",
    liveUrl: "https://aurora.stareezy.tech",
    demoMode: true,
    featured: true,
    createdAt: "2026-05-16T00:00:00+00:00",
    updatedAt: "2026-05-16T00:00:00+00:00",
  },
  {
    id: "a1b2c3d4-0002-4000-8000-000000000002",
    title: "Stareezy UI",
    slug: "stareezy-ui",
    description:
      "A fully typed, object-based design token system and cross-platform component library for React Native and web. Ships 70+ components built on a zero-dependency token package, an O(1) style registry, and a Babel/Vite build-time compiler for atomic CSS extraction.",
    thumbnail:
      "https://res.cloudinary.com/diwktkaxv/image/upload/v1778913417/stareezy-ui_h48hys.png",
    gallery: [],
    technologies: [
      "React",
      "React Native",
      "TypeScript",
      "Stitches",
      "Storybook",
      "Next.js",
      "Vitest",
      "tsup",
      "pnpm workspaces",
    ],
    type: EProjectType.WEB,
    githubUrl: "https://github.com/stareezy-1/stareezy-ui",
    liveUrl: "https://ui.stareezy.tech",
    demoMode: true,
    featured: true,
    createdAt: "2026-05-16T00:00:00+00:00",
    updatedAt: "2026-05-16T00:00:00+00:00",
  },
  {
    id: "a1b2c3d4-0003-4000-8000-000000000003",
    title: "Portfolio Platform",
    slug: "portfolio-platform",
    description:
      "A fullstack portfolio website built with Expo 55 (React Native Web) and Go/Gin. Features a dynamic public portfolio with hero section, project showcase, resume viewer, and contact form — all content managed through a built-in admin panel backed by Supabase.",
    thumbnail:
      "https://res.cloudinary.com/diwktkaxv/image/upload/v1778915005/portofolio-stareezy_fsl9sb.png",
    gallery: [],
    technologies: [
      "Expo",
      "React Native Web",
      "TypeScript",
      "Go",
      "Gin",
      "Supabase",
      "TanStack Query",
      "Zustand",
    ],
    type: EProjectType.WEB,
    githubUrl: "https://github.com/stareezy-1/portofolio-app",
    liveUrl: "https://stareezy.tech",
    demoMode: true,
    featured: true,
    createdAt: "2026-05-16T00:00:00+00:00",
    updatedAt: "2026-05-16T00:00:00+00:00",
  },
];

const ok = <T>(data: T): IApiResponse<T> => ({
  success: true,
  data,
  meta: undefined,
  error: undefined,
});

export function useProjects(_params?: { page?: number; limit?: number }) {
  return { data: ok(HARDCODED_PROJECTS), isLoading: false, error: null };
}

export function useProject(slug: string) {
  const project = HARDCODED_PROJECTS.find((p) => p.slug === slug) ?? null;
  return {
    data: project ? ok(project) : undefined,
    isLoading: false,
    error: null,
  };
}

export function useFeaturedProjects() {
  return {
    data: ok(HARDCODED_PROJECTS.filter((p) => p.featured)),
    isLoading: false,
    error: null,
  };
}
