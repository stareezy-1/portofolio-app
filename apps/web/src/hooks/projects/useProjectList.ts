import type { IProject } from "@/lib/types/project";
import { EProjectType } from "@/lib/constants/enums";
import { HARDCODED_PROJECTS } from "@/lib/hooks/useProjects";

/**
 * Screen-level hook for the project list page.
 * Returns hardcoded projects until the backend is deployed.
 */
export function useProjectList() {
  return {
    projects: HARDCODED_PROJECTS,
    meta: undefined,
    page: 1,
    totalPages: 1,
    isLoading: false,
    error: null,
    goToNextPage: () => {},
    goToPrevPage: () => {},
    goToPage: () => {},
    hasNextPage: false,
    hasPrevPage: false,
  };
}
