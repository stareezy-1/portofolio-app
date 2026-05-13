import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../utils/api-client";
import type { IApiResponse } from "../types/api";
import type { IResume } from "../types/resume";

export function useResume() {
  return useQuery<IApiResponse<IResume>>({
    queryKey: ["resume"],
    queryFn: () => apiClient.get("/resume").then((res) => res.data),
  });
}
