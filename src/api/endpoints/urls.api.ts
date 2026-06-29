import api from "@/api/axios";
import type {
  ApiResponse,
  CreateUrlDto,
  UpdateUrlDto,
  Url,
} from "@/types/api.types";

async function create(data: CreateUrlDto): Promise<Url> {
  const response = await api.post<ApiResponse<Url>>("/urls", data);

  return response.data.data;
}

async function findAll(): Promise<Url[]> {
  const response = await api.get<ApiResponse<Url[]>>("/urls");

  return response.data.data;
}

async function findOne(id: string): Promise<Url> {
  const response = await api.get<ApiResponse<Url>>(`/urls/${id}`);

  return response.data.data;
}

async function update(id: string, data: UpdateUrlDto): Promise<Url> {
  const response = await api.patch<ApiResponse<Url>>(`/urls/${id}`, data);

  return response.data.data;
}

async function remove(id: string): Promise<void> {
  await api.delete<ApiResponse<null>>(`/urls/${id}`);
}

export const urlsApi = {
  create,
  findAll,
  findOne,
  update,
  remove,
};
