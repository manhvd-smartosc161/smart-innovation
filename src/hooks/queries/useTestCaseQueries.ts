import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Types
interface TestCaseData {
  analysisId: string;
  testCases: unknown[];
  [key: string]: unknown;
}

// Mock API functions
const fetchTestCases = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    testCases: [],
    lastUpdated: new Date().toISOString(),
  };
};

const saveTestCase = async (data: TestCaseData) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return data;
};

export function useTestCasesData(analysisId: string) {
  return useQuery({
    queryKey: ['testCases', analysisId],
    queryFn: fetchTestCases,
    enabled: !!analysisId,
  });
}

export function useSaveTestCase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveTestCase,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['testCases', variables.analysisId],
      });
    },
  });
}
