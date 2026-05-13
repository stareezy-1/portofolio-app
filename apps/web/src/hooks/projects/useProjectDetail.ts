import { useProject } from "@/lib/hooks/useProjects";

/**
 * Screen-level hook for the project detail page.
 * Encapsulates project fetching by slug.
 */
export function useProjectDetail(slug: string) {
  const { data, isLoading, error } = useProject(slug);

  const project = data?.data ?? null;

  return {
    project,
    isLoading,
    error,
    notFound: !isLoading && !error && !project,
  };
}
