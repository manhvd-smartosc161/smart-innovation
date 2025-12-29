import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Types
interface ImpactData {
  analysisId: string;
  items: unknown[];
  [key: string]: unknown;
}

// Mock API functions
const fetchImpactData = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    items: [],
    lastUpdated: new Date().toISOString(),
  };
};

const saveImpactData = async (data: ImpactData) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return data;
};

export function useImpactData(analysisId: string) {
  return useQuery({
    queryKey: ['impact', analysisId],
    queryFn: fetchImpactData,
    enabled: !!analysisId,
  });
}

export function useSaveImpact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveImpactData,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['impact', variables.analysisId],
      });
    },
  });
}
