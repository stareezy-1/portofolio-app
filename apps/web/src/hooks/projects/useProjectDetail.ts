import { useProject } from "@/lib/hooks/useProjects";

/**
 * Screen-level hook for the project detail page.
 * Encapsulates project fetching by slug.
 */
export function useProjectDetail(slug: string) {
  const { data: project, isLoading, isError, refetch } = useProject(slug);

  return {
    project: project ?? null,
    isLoading,
    error: isError,
    notFound: !isLoading && !isError && !project,
    refetch,
  };
}
