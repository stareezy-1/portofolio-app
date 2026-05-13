import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../utils/api-client";
import {
  STALE_TIME_PROJECTS,
  STALE_TIME_FEATURED,
} from "../constants/api.const";
import type { IApiResponse } from "../types/api";
import type { IProject } from "../types/project";

export function useProjects(params?: { page?: number; limit?: number }) {
  return useQuery<IApiResponse<IProject[]>>({
    queryKey: ["projects", params],
    queryFn: () =>
      apiClient.get("/projects", { params }).then((res) => res.data),
    staleTime: STALE_TIME_PROJECTS,
  });
}

export function useProject(slug: string) {
  return useQuery<IApiResponse<IProject>>({
    queryKey: ["project", slug],
    queryFn: () => apiClient.get(`/projects/${slug}`).then((res) => res.data),
    enabled: !!slug,
  });
}

export function useFeaturedProjects() {
  return useQuery<IApiResponse<IProject[]>>({
    queryKey: ["featured-projects"],
    queryFn: () => apiClient.get("/featured-projects").then((res) => res.data),
    staleTime: STALE_TIME_FEATURED,
  });
}
