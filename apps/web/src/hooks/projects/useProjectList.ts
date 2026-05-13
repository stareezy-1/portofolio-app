import { useState, useCallback } from "react";
import { useProjects } from "@/lib/hooks/useProjects";
import type { IProject } from "@/lib/types/project";

const PAGE_SIZE = 10;

/**
 * Screen-level hook for the project list page.
 * Encapsulates pagination state and project data fetching.
 */
export function useProjectList() {
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useProjects({ page, limit: PAGE_SIZE });

  const projects: IProject[] = data?.data ?? [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages ?? 1;

  const goToNextPage = useCallback(() => {
    setPage((p) => Math.min(totalPages, p + 1));
  }, [totalPages]);

  const goToPrevPage = useCallback(() => {
    setPage((p) => Math.max(1, p - 1));
  }, []);

  const goToPage = useCallback(
    (p: number) => {
      setPage(Math.max(1, Math.min(totalPages, p)));
    },
    [totalPages],
  );

  return {
    projects,
    meta,
    page,
    totalPages,
    isLoading,
    error,
    goToNextPage,
    goToPrevPage,
    goToPage,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}
