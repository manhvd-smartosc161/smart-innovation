import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data considered fresh for 10 minutes (reduced refetches)
      staleTime: 10 * 60 * 1000,

      // Keep unused data in cache for 15 minutes
      gcTime: 15 * 60 * 1000,

      // Only retry failed requests once (faster failures)
      retry: 1,

      // Don't refetch on window focus (reduce unnecessary requests)
      refetchOnWindowFocus: false,

      // Refetch when reconnecting to network
      refetchOnReconnect: true,

      // Don't refetch on mount if data is fresh
      refetchOnMount: false,
    },
    mutations: {
      // Don't retry mutations (user should manually retry)
      retry: 0,

      // Keep mutation cache for 5 minutes
      gcTime: 5 * 60 * 1000,
    },
  },
});
