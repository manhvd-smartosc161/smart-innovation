import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface TestCaseState {
  selectedTestCaseId: string | null;
  expandedGroups: Set<string>;
  setSelectedTestCaseId: (id: string | null) => void;
  toggleGroup: (groupId: string) => void;
  expandAllGroups: () => void;
  collapseAllGroups: () => void;
}

export const useTestCaseStore = create<TestCaseState>()(
  devtools(
    (set) => ({
      selectedTestCaseId: null,
      expandedGroups: new Set<string>(),

      setSelectedTestCaseId: (id: string | null) =>
        set({ selectedTestCaseId: id }, false, 'setSelectedTestCaseId'),

      toggleGroup: (groupId: string) =>
        set(
          (state) => {
            const newSet = new Set(state.expandedGroups);
            if (newSet.has(groupId)) {
              newSet.delete(groupId);
            } else {
              newSet.add(groupId);
            }
            return { expandedGroups: newSet };
          },
          false,
          'toggleGroup'
        ),

      expandAllGroups: () =>
        set({ expandedGroups: new Set() }, false, 'expandAllGroups'),

      collapseAllGroups: () =>
        set({ expandedGroups: new Set() }, false, 'collapseAllGroups'),
    }),
    { name: 'TestCaseStore' }
  )
);
