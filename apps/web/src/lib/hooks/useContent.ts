import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../utils/api-client";
import type { IPortfolioContent, IContactMessage } from "../types/content";
import type { IHookResult } from "./useProjects";

// Hardcoded fallback content — DO NOT REMOVE.
export const HARDCODED_CONTENT: IPortfolioContent = {
  id: "hardcoded",
  name: "Muhammad Bintang Al Akbar",
  role: "Software Engineer (Front End Focus)",
  tagline:
    "Building modern web and mobile applications with React & React Native.",
  bio: "Motivated and detail-oriented Front-End Developer with 3+ years of experience specializing in React and React Native development. Passionate about building beautiful, performant, and accessible user interfaces.",
  avatarUrl: undefined,
  yearsOfExperience: 3,
  projectsBuilt: 9,
  happyClients: 3,
  email: "bintangmuhammad12@gmail.com",
  location: "Indonesia",
  socialLinks: [
    { platform: "GitHub", url: "https://github.com/stareezy-1" },
    {
      platform: "LinkedIn",
      url: "https://id.linkedin.com/in/muhammad-bintang-al-akbar-72302812a",
    },
    { platform: "Instagram", url: "https://www.instagram.com/stareezy/" },
  ],
  techStack: [
    {
      category: "Frontend",
      icon: "⚛",
      skills: ["React", "React Native", "TypeScript", "Expo", "Next.js"],
    },
    {
      category: "Backend",
      icon: "⚙",
      skills: ["Go", "Gin", "Node.js", "REST APIs"],
    },
    {
      category: "Design System",
      icon: "◈",
      skills: ["Stareezy UI", "Tailwind CSS", "Stitches", "Storybook"],
    },
    {
      category: "Tools",
      icon: "🛠",
      skills: ["Supabase", "Docker", "Fly.io", "GitHub Actions", "Vitest"],
    },
  ],
  workExperience: [
    {
      id: "we-1",
      title: "Front-End Developer",
      organization: "Rekosistem",
      location: "Indonesia",
      startDate: "2022-01",
      description:
        "Building React Native mobile applications for waste management platform.",
      highlights: ["React Native", "TypeScript", "Design Systems"],
    },
  ],
  education: [
    {
      id: "edu-1",
      title: "Bachelor of Computer Science",
      organization: "University",
      startDate: "2018-08",
      endDate: "2022-07",
      description:
        "Computer Science degree with focus on software engineering.",
      highlights: [],
    },
  ],
  updatedAt: new Date().toISOString(),
};

const hasApiUrl = !!process.env.EXPO_PUBLIC_API_URL;

export function useContent(): IHookResult<IPortfolioContent> {
  const query = useQuery<IPortfolioContent>({
    queryKey: ["content"],
    queryFn: async () => {
      if (!hasApiUrl) throw new Error("No API URL");
      const res = await apiClient.get("/content");
      return res.data.data;
    },
    placeholderData: HARDCODED_CONTENT,
    staleTime: 5 * 60 * 1000,
    retry: hasApiUrl ? 2 : 0,
  });

  const isFallback = !hasApiUrl || query.isError;
  const data = isFallback ? HARDCODED_CONTENT : query.data ?? HARDCODED_CONTENT;

  return {
    data,
    isLoading: query.isLoading && hasApiUrl,
    isError: query.isError && hasApiUrl,
    isFallback,
    refetch: query.refetch,
  };
}

export function useUpdateContent() {
  const queryClient = useQueryClient();
  return useMutation<IPortfolioContent, Error, IPortfolioContent>({
    mutationFn: (input) =>
      apiClient.put("/admin/content", input).then((res) => res.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content"] });
    },
  });
}

export function useSendContact() {
  return useMutation<{ message: string }, Error, IContactMessage>({
    mutationFn: (msg) =>
      apiClient.post("/contact", msg).then((res) => res.data.data),
  });
}
