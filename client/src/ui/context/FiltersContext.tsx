import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useMemo,
  useTransition,
} from 'react';

export interface IFilterState {
  municipioIdIbge?: string;
  dependenciaAdm?: string;
  tipoLocalizacao?: string;
}

interface IFiltersContext {
  filters: IFilterState;
  updateFilter: (filterName: keyof IFilterState, value?: string) => void;
  clearFilters: () => void;
  isPending: boolean;
}

const FiltersContext = createContext<IFiltersContext | undefined>(undefined);

const INITIAL_STATE: IFilterState = {
  municipioIdIbge: undefined,
  dependenciaAdm: undefined,
  tipoLocalizacao: undefined,
};

export const FiltersProvider = ({ children }: { children: ReactNode }) => {
  const [filters, setFilters] = useState<IFilterState>(INITIAL_STATE);
  const [isPending, startTransition] = useTransition();

  const clearFilters = () => {
    startTransition(() => {
      setFilters(INITIAL_STATE);
    });
  };

  const updateFilter = (filterName: keyof IFilterState, value?: string) => {
    startTransition(() => {
      setFilters((prev) => ({
        ...prev,
        [filterName]: value,
      }));
    });
  };

  const value = useMemo(
    () => ({
      filters,
      clearFilters,
      updateFilter,
      isPending,
    }),
    [filters, isPending],
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
