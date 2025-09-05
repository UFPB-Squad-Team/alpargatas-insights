import { Filter, X } from 'lucide-react';
import FilterDropdown from '@/ui/components/common/FilterDropdown';
import { useQuery } from '@tanstack/react-query';
import { listMunicipalitiesUseCase } from '@/shared/services/Municipality/logic/listMunicipalitiesUseCase';
import { Button } from '@/ui/components/common/button';
import { useFilters } from '@/ui/context/FiltersContext';

const DashboardFilters = () => {
  const { filters, clearFilters, updateFilter } = useFilters();

  const { data: municipalitiesResponse } = useQuery({
    queryKey: ['municipalities-for-filter'],
    queryFn: () => listMunicipalitiesUseCase.execute({ limit: 250 }),
  });

  const municipalities = municipalitiesResponse?.data || [];

  const municipalityOptions = municipalities.map((m) => ({
    value: m.codigoIbge,
    label: m.nome,
  }));

  const locationOptions = [
    { value: 'Urbana', label: 'Urbana' },
    { value: 'Rural', label: 'Rural' },
  ];

  const dependenciesOptions = [
    { value: 'Municipal', label: 'Municipal' },
    { value: 'Estadual', label: 'Estadual' },
    { value: 'Federal', label: 'Federal' },
  ];

  const hasActiveFilters = Object.values(filters).some((v) => v);

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 mb-6">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex items-center gap-2 text-brand-orange-dark flex-shrink-0">
          <Filter size={16} />
          <h3 className="font-semibold text-sm uppercase">Filtros</h3>
        </div>

        <div className="flex flex-wrap gap-3 w-full">
          <FilterDropdown
            label="Município"
            placeholder="Todos os municípios"
            options={municipalityOptions}
            value={filters.municipioIdIbge}
            onChange={(value) => updateFilter('municipioIdIbge', value)}
            searchPlaceholder={''}
            emptyText={''}
          />
          <FilterDropdown
            label="Dependência Administrativa"
            placeholder="Todas"
            options={dependenciesOptions}
            value={filters.dependenciaAdm}
            onChange={(value) => updateFilter('dependenciaAdm', value)}
            searchPlaceholder={''}
            emptyText={''}
          />
          <FilterDropdown
            label="Localização"
            placeholder="Ambas"
            options={locationOptions}
            value={filters.tipoLocalizacao}
            onChange={(value) => updateFilter('tipoLocalizacao', value)}
            searchPlaceholder={''}
            emptyText={''}
          />
        </div>

        {hasActiveFilters && (
          <Button variant="ghost" onClick={clearFilters} className="...">
            <X size={14} />
            Limpar Filtros
          </Button>
        )}
      </div>
    </div>
  );
};

export default DashboardFilters;
