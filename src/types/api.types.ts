export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  data: T;
  timestamp: string;
}

export interface ApiError {
  success: false;
  statusCode: number;
  message: string;
  timestamp: string;
}

export interface User {
  id: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
}

export interface Url {
  id: string;
  slug: string;
  originalUrl: string;
  expiresAt: string | null;
  isActive: boolean;
  createdAt: string;
  userId: string | null;
}

export interface CreateUrlDto {
  originalUrl: string;
  customSlug?: string;
  expiresAt?: string | null;
}

export interface UpdateUrlDto {
  isActive?: boolean;
  expiresAt?: string | null;
}

export interface CachedUrl {
  id: string;
  originalUrl: string;
  expiresAt: string | null;
}

export interface AnalyticsResponse {
  urlId: string;
  slug: string;
  totalClicks: number;
  uniqueVisitors: number;
  clicksLast7Days: number;
  clicksLast30Days: number;
  clicksByDay: ClickByDay[];
  topReferers: RefererStat[];
  devices: DeviceStat[];
  browsers: BrowserStat[];
}

export interface ClickByDay {
  date: string;
  count: number;
}

export interface RefererStat {
  referer: string | null;
  count: number;
}

export interface DeviceStat {
  device: string;
  count: number;
}

export interface BrowserStat {
  browser: string;
  count: number;
}
