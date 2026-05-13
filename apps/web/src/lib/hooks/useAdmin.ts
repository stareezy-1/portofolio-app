import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../utils/api-client";
import type {
  IApiResponse,
  IProjectCreateInput,
  IProjectUpdateInput,
} from "../types/api";
import type { IProject } from "../types/project";
import type { IResume } from "../types/resume";

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation<IApiResponse<IProject>, Error, IProjectCreateInput>({
    mutationFn: (input) =>
      apiClient.post("/admin/projects", input).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["featured-projects"] });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation<
    IApiResponse<IProject>,
    Error,
    { id: string; input: IProjectUpdateInput }
  >({
    mutationFn: ({ id, input }) =>
      apiClient.put(`/admin/projects/${id}`, input).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["featured-projects"] });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation<IApiResponse<{ message: string }>, Error, string>({
    mutationFn: (id) =>
      apiClient.delete(`/admin/projects/${id}`).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["featured-projects"] });
    },
  });
}

export function useUploadFile() {
  return useMutation<IApiResponse<{ url: string }>, Error, File>({
    mutationFn: (file) => {
      const formData = new FormData();
      formData.append("file", file);
      return apiClient
        .post("/admin/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => res.data);
    },
  });
}

export function useUploadResume() {
  const queryClient = useQueryClient();
  return useMutation<IApiResponse<IResume>, Error, File>({
    mutationFn: (file) => {
      const formData = new FormData();
      formData.append("file", file);
      return apiClient
        .post("/admin/resume", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => res.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resume"] });
    },
  });
}
