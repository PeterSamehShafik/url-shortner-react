import { useQuery } from "@tanstack/react-query";

import { analyticsApi } from "@/api/endpoints/analytics.api";
import { queryKeys } from "@/api/queryKeys";

export function useAnalytics(urlId: string) {
  return useQuery({
    queryKey: queryKeys.analytics(urlId),
    queryFn: () => analyticsApi.getByUrlId(urlId),
    enabled: !!urlId,
    staleTime: 0,
    refetchInterval: 20000,
    refetchIntervalInBackground: true,
  });
}
