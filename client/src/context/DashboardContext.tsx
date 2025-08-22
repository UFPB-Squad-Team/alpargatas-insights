import { createContext, useState, useContext, ReactNode, useMemo } from 'react';

interface DashboardContextType {
  selectedSchoolId: number | string | null;
  setSelectedSchoolId: (id: number | string | null) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined,
);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [selectedSchoolId, setSelectedSchoolId] = useState<
    number | string | null
  >(null);

  const value = useMemo(
    () => ({ selectedSchoolId, setSelectedSchoolId }),
    [selectedSchoolId],
  );

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = (): DashboardContextType => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error(
      'useDashboard deve ser usado dentro de um DashboardProvider',
    );
  }
  return context;
};
