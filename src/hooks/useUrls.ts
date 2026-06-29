import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { urlsApi } from "@/api/endpoints/urls.api";
import { queryKeys } from "@/api/queryKeys";
import type { CreateUrlDto, UpdateUrlDto } from "@/types/api.types";

export function useUrls() {
  return useQuery({
    queryKey: queryKeys.urls,
    queryFn: urlsApi.findAll,
  });
}

export function useUrl(id: string) {
  return useQuery({
    queryKey: queryKeys.url(id),
    queryFn: () => urlsApi.findOne(id),
    enabled: !!id,
  });
}

export function useCreateUrl() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUrlDto) => urlsApi.create(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.urls,
      });
    },
  });
}

export function useUpdateUrl() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUrlDto }) =>
      urlsApi.update(id, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.urls,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.url(variables.id),
      });
    },
  });
}

export function useDeleteUrl() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: urlsApi.remove,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.urls,
      });
    },
  });
}
