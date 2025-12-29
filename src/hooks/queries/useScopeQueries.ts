import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Types
interface ScopeData {
  analysisId: string;
  items: unknown[];
  [key: string]: unknown;
}

// Mock API functions
const fetchScopeData = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    items: [],
    lastUpdated: new Date().toISOString(),
  };
};

const saveScopeData = async (data: ScopeData) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return data;
};

export function useScopeData(analysisId: string) {
  return useQuery({
    queryKey: ['scope', analysisId],
    queryFn: fetchScopeData,
    enabled: !!analysisId,
  });
}

export function useSaveScope() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveScopeData,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['scope', variables.analysisId],
      });
    },
  });
}
