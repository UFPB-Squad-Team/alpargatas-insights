import { createContext, useState, useContext, ReactNode, useMemo } from 'react';

export interface IFilterState {
  municipalityId?: string;
  inseLevel?: string;
  location?: string;
}

interface IFiltersContext {
  filters: IFilterState;
  setFilters: React.Dispatch<React.SetStateAction<IFilterState>>;
  clearFilters: () => void;
}

const FiltersContext = createContext<IFiltersContext | undefined>(undefined);

const INITIAL_STATE: IFilterState = {
  municipalityId: undefined,
  inseLevel: undefined,
  location: undefined,
};

export const FiltersProvider = ({ children }: { children: ReactNode }) => {
  const [filters, setFilters] = useState<IFilterState>(INITIAL_STATE);

  const clearFilters = () => {
    setFilters(INITIAL_STATE);
  };

  const value = useMemo(
    () => ({
      filters,
      setFilters,
      clearFilters,
    }),
    [filters],
  );

  return (
    <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>
  );
};

export const useFilters = (): IFiltersContext => {
  const context = useContext(FiltersContext);
  if (context === undefined) {
    throw new Error('useFilters deve ser usado dentro de um FiltersProvider');
  }
  return context;
};
