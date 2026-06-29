import api from "@/api/axios";
import type { AnalyticsResponse, ApiResponse } from "@/types/api.types";

async function getByUrlId(urlId: string): Promise<AnalyticsResponse> {
  const response = await api.get<ApiResponse<AnalyticsResponse>>(
    `/urls/${urlId}/analytics`,
  );

  return response.data.data;
}

export const analyticsApi = {
  getByUrlId,
};
