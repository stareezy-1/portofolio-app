import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback } from "react";
import { EProjectType } from "@/lib/constants/enums";

export interface IProjectFilters {
  search: string;
  type: EProjectType | "all";
}

export function useProjectFilters() {
  const router = useRouter();
  const params = useLocalSearchParams<{ search?: string; type?: string }>();

  const filters: IProjectFilters = {
    search: params.search ?? "",
    type: (params.type as EProjectType | "all") ?? "all",
  };

  const setSearch = useCallback(
    (q: string) => {
      router.setParams({
        search: q || undefined,
        type: filters.type === "all" ? undefined : filters.type,
      });
    },
    [router, filters.type],
  );

  const setType = useCallback(
    (t: EProjectType | "all") => {
      router.setParams({
        search: filters.search || undefined,
        type: t === "all" ? undefined : t,
      });
    },
    [router, filters.search],
  );

  const clearFilters = useCallback(() => {
    router.setParams({ search: undefined, type: undefined });
  }, [router]);

  return { filters, setSearch, setType, clearFilters };
}
