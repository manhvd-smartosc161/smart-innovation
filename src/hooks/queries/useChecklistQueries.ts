import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Types
interface ChecklistData {
  analysisId: string;
  items: unknown[];
  [key: string]: unknown;
}

// Mock API functions (replace with real API calls)
const fetchChecklistData = async () => {
  // TODO: Replace with real API call
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    items: [],
    lastUpdated: new Date().toISOString(),
  };
};

const saveChecklistData = async (data: ChecklistData) => {
  // TODO: Replace with real API call
  await new Promise((resolve) => setTimeout(resolve, 500));
  return data;
};

// Query hook for fetching checklist data
export function useChecklistData(analysisId: string) {
  return useQuery({
    queryKey: ['checklist', analysisId],
    queryFn: fetchChecklistData,
    enabled: !!analysisId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Mutation hook for saving checklist
export function useSaveChecklist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveChecklistData,
    onMutate: async (newData) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['checklist'] });

      // Snapshot previous value
      const previousData = queryClient.getQueryData([
        'checklist',
        newData.analysisId,
      ]);

      // Optimistically update
      queryClient.setQueryData(['checklist', newData.analysisId], newData);

      return { previousData };
    },
    onError: (_err, newData, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(
          ['checklist', newData.analysisId],
          context.previousData
        );
      }
    },
    onSuccess: (_data, variables) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({
        queryKey: ['checklist', variables.analysisId],
      });
    },
  });
}
