import api from "@/api/axios";
import type {
  ApiResponse,
  LoginDto,
  RegisterDto,
  User,
} from "@/types/api.types";

async function register(data: RegisterDto): Promise<User> {
  const response = await api.post<ApiResponse<User>>("/auth/register", data);

  return response.data.data;
}

async function login(data: LoginDto): Promise<User> {
  const response = await api.post<ApiResponse<User>>("/auth/login", data);

  return response.data.data;
}

async function refresh(): Promise<User> {
  const response = await api.post<ApiResponse<User>>("/auth/refresh");

  return response.data.data;
}

async function logout(): Promise<void> {
  await api.post<ApiResponse<null>>("/auth/logout");
}

export const authApi = {
  register,
  login,
  refresh,
  logout,
};
