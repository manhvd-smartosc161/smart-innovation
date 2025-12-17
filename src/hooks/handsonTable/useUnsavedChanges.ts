import { useRef, useCallback } from 'react';

export interface UnsavedChangesTracker {
  hasUnsavedChanges: () => boolean;
  markAsChanged: () => void;
  markAsSaved: () => void;
  reset: () => void;
}

/**
 * Hook to track unsaved changes in a component
 * Returns methods to check and update unsaved state
 */
export const useUnsavedChanges = (): UnsavedChangesTracker => {
  const hasChangesRef = useRef(false);

  const hasUnsavedChanges = useCallback(() => {
    return hasChangesRef.current;
  }, []);

  const markAsChanged = useCallback(() => {
    hasChangesRef.current = true;
  }, []);

  const markAsSaved = useCallback(() => {
    hasChangesRef.current = false;
  }, []);

  const reset = useCallback(() => {
    hasChangesRef.current = false;
  }, []);

  return {
    hasUnsavedChanges,
    markAsChanged,
    markAsSaved,
    reset,
  };
};
