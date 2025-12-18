import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
} from 'react';
import type { ReactNode } from 'react';

interface AnalysisContextType {
  isAnalysed: boolean;
  setIsAnalysed: (value: boolean) => void;
  isChecklistGenerated: boolean;
  setIsChecklistGenerated: (value: boolean) => void;
  isTestCasesGenerated: boolean;
  setIsTestCasesGenerated: (value: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  hasUnsavedChanges: (tabKey: string) => boolean;
  markTabAsChanged: (tabKey: string) => void;
  markTabAsSaved: (tabKey: string) => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(
  undefined
);

// eslint-disable-next-line react-refresh/only-export-components
export const useAnalysis = () => {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error('useAnalysis must be used within AnalysisProvider');
  }
  return context;
};

interface AnalysisProviderProps {
  children: ReactNode;
}

export const AnalysisProvider: React.FC<AnalysisProviderProps> = ({
  children,
}) => {
  const [isAnalysed, setIsAnalysed] = useState(false);
  const [isChecklistGenerated, setIsChecklistGenerated] = useState(false);
  const [isTestCasesGenerated, setIsTestCasesGenerated] = useState(false);
  const [activeTab, setActiveTab] = useState('');

  // Track unsaved changes per tab
  const unsavedChangesRef = useRef<Map<string, boolean>>(new Map());

  const hasUnsavedChanges = useCallback((tabKey: string) => {
    return unsavedChangesRef.current.get(tabKey) || false;
  }, []);

  const markTabAsChanged = useCallback((tabKey: string) => {
    unsavedChangesRef.current.set(tabKey, true);
  }, []);

  const markTabAsSaved = useCallback((tabKey: string) => {
    unsavedChangesRef.current.set(tabKey, false);
  }, []);

  return (
    <AnalysisContext.Provider
      value={{
        isAnalysed,
        setIsAnalysed,
        isChecklistGenerated,
        setIsChecklistGenerated,
        isTestCasesGenerated,
        setIsTestCasesGenerated,
        activeTab,
        setActiveTab,
        hasUnsavedChanges,
        markTabAsChanged,
        markTabAsSaved,
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
};
