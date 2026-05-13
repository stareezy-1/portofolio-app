import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../utils/api-client";
import type { IApiResponse } from "../types/api";
import type { IPortfolioContent, IContactMessage } from "../types/content";

export function useContent() {
  return useQuery<IApiResponse<IPortfolioContent>>({
    queryKey: ["content"],
    queryFn: () => apiClient.get("/content").then((res) => res.data),
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateContent() {
  const queryClient = useQueryClient();
  return useMutation<IApiResponse<IPortfolioContent>, Error, IPortfolioContent>(
    {
      mutationFn: (input) =>
        apiClient.put("/admin/content", input).then((res) => res.data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["content"] });
      },
    },
  );
}

export function useSendContact() {
  return useMutation<IApiResponse<{ message: string }>, Error, IContactMessage>(
    {
      mutationFn: (msg) =>
        apiClient.post("/contact", msg).then((res) => res.data),
    },
  );
}
