import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../utils/api-client";
import type { IProject } from "../types/project";
import { EProjectType } from "../constants/enums";

// Hardcoded fallback — DO NOT REMOVE. Used when backend is not deployed.
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

export interface IHookResult<T> {
  data: T | undefined;
  isLoading: boolean;
  isError: boolean;
  isFallback: boolean;
  refetch: () => void;
}

const hasApiUrl = !!process.env.EXPO_PUBLIC_API_URL;

export function useProjects(_params?: {
  page?: number;
  limit?: number;
}): IHookResult<IProject[]> {
  const query = useQuery<IProject[]>({
    queryKey: ["projects", _params],
    queryFn: async () => {
      if (!hasApiUrl) throw new Error("No API URL");
      const res = await apiClient.get("/projects", { params: _params });
      return res.data.data;
    },
    placeholderData: HARDCODED_PROJECTS,
    retry: hasApiUrl ? 2 : 0,
  });

  const isFallback = !hasApiUrl || query.isError;
  const data = isFallback
    ? HARDCODED_PROJECTS
    : query.data ?? HARDCODED_PROJECTS;

  return {
    data,
    isLoading: query.isLoading && hasApiUrl,
    isError: query.isError && hasApiUrl,
    isFallback,
    refetch: query.refetch,
  };
}

export function useProject(slug: string): IHookResult<IProject | null> {
  const query = useQuery<IProject | null>({
    queryKey: ["project", slug],
    queryFn: async () => {
      if (!hasApiUrl) throw new Error("No API URL");
      const res = await apiClient.get(`/projects/${slug}`);
      return res.data.data;
    },
    placeholderData: HARDCODED_PROJECTS.find((p) => p.slug === slug) ?? null,
    retry: hasApiUrl ? 2 : 0,
  });

  const fallback = HARDCODED_PROJECTS.find((p) => p.slug === slug) ?? null;
  const isFallback = !hasApiUrl || query.isError;
  const data = isFallback ? fallback : query.data ?? fallback;

  return {
    data,
    isLoading: query.isLoading && hasApiUrl,
    isError: query.isError && hasApiUrl && fallback === null,
    isFallback,
    refetch: query.refetch,
  };
}

export function useFeaturedProjects(): IHookResult<IProject[]> {
  const query = useQuery<IProject[]>({
    queryKey: ["featured-projects"],
    queryFn: async () => {
      if (!hasApiUrl) throw new Error("No API URL");
      const res = await apiClient.get("/featured-projects");
      return res.data.data;
    },
    placeholderData: HARDCODED_PROJECTS.filter((p) => p.featured),
    retry: hasApiUrl ? 2 : 0,
  });

  const fallback = HARDCODED_PROJECTS.filter((p) => p.featured);
  const isFallback = !hasApiUrl || query.isError;
  const data = isFallback ? fallback : query.data ?? fallback;

  return {
    data,
    isLoading: query.isLoading && hasApiUrl,
    isError: query.isError && hasApiUrl,
    isFallback,
    refetch: query.refetch,
  };
}
