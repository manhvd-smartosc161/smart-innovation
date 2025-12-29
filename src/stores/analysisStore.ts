import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface AnalysisState {
  // Analysis workflow states
  isAnalysed: boolean;
  isChecklistGenerated: boolean;
  isTestCasesGenerated: boolean;

  // Tab navigation
  activeTab: string;

  // Test case selection
  selectedTestCaseId: string | null;

  // Unsaved changes tracking
  unsavedChanges: Map<string, boolean>;

  // Actions
  setIsAnalysed: (value: boolean) => void;
  setIsChecklistGenerated: (value: boolean) => void;
  setIsTestCasesGenerated: (value: boolean) => void;
  setActiveTab: (tab: string) => void;
  setSelectedTestCaseId: (id: string | null) => void;
  hasUnsavedChanges: (tabKey: string) => boolean;
  markTabAsChanged: (tabKey: string) => void;
  markTabAsSaved: (tabKey: string) => void;
  resetAnalysis: () => void;
}

const initialState = {
  isAnalysed: false,
  isChecklistGenerated: false,
  isTestCasesGenerated: false,
  activeTab: 'Initialization',
  selectedTestCaseId: null,
  unsavedChanges: new Map<string, boolean>(),
};

export const useAnalysisStore = create<AnalysisState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        setIsAnalysed: (value: boolean) =>
          set({ isAnalysed: value }, false, 'setIsAnalysed'),

        setIsChecklistGenerated: (value: boolean) =>
          set(
            { isChecklistGenerated: value },
            false,
            'setIsChecklistGenerated'
          ),

        setIsTestCasesGenerated: (value: boolean) =>
          set({ isTestCasesGenerated: value }, false, 'setTestCasesGenerated'),

        setActiveTab: (tab: string) =>
          set({ activeTab: tab }, false, 'setActiveTab'),

        setSelectedTestCaseId: (id: string | null) =>
          set({ selectedTestCaseId: id }, false, 'setSelectedTestCaseId'),

        hasUnsavedChanges: (tabKey: string) => {
          return get().unsavedChanges.get(tabKey) || false;
        },

        markTabAsChanged: (tabKey: string) =>
          set(
            (state) => {
              const newMap = new Map(state.unsavedChanges);
              newMap.set(tabKey, true);
              return { unsavedChanges: newMap };
            },
            false,
            'markTabAsChanged'
          ),

        markTabAsSaved: (tabKey: string) =>
          set(
            (state) => {
              const newMap = new Map(state.unsavedChanges);
              newMap.set(tabKey, false);
              return { unsavedChanges: newMap };
            },
            false,
            'markTabAsSaved'
          ),

        resetAnalysis: () => set(initialState, false, 'resetAnalysis'),
      }),
      {
        name: 'analysis-store',
        partialize: (state) => ({
          selectedTestCaseId: state.selectedTestCaseId,
          unsavedChanges: Array.from(state.unsavedChanges.entries()),
        }),
      }
    ),
    { name: 'AnalysisStore' }
  )
);

// Compatibility hook to match old Context API
export const useAnalysis = useAnalysisStore;
