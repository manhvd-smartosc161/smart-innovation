import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface AnalysisContextType {
  isAnalysed: boolean;
  setIsAnalysed: (value: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(
  undefined
);

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
  const [activeTab, setActiveTab] = useState('');

  return (
    <AnalysisContext.Provider
      value={{ isAnalysed, setIsAnalysed, activeTab, setActiveTab }}
    >
      {children}
    </AnalysisContext.Provider>
  );
};
