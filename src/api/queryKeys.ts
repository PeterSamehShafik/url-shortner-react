export const queryKeys = {
  urls: ["urls"] as const,

  url: (id: string) => ["urls", id] as const,

  analytics: (id: string) => ["analytics", id] as const,
};
