import { Filter, X } from 'lucide-react'; // Importar o ícone 'X'
import FilterDropdown from '@/ui/components/common/FilterDropdown';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { listMunicipalitiesUseCase } from '@/shared/services/Municipality/logic/listMunicipalitiesUseCase';
import { Button } from '@/ui/components/common/button';

const DashboardFilters = () => {
  const [selectedMunicipality, setSelectedMunicipality] = useState<string>();
  const [selectedINSE, setSelectedINSE] = useState<string>();
  const [selectedLocation, setSelectedLocation] = useState<string>();

  const { data: municipalities = [] } = useQuery({
    queryKey: ['municipalities-for-filter'],
    queryFn: listMunicipalitiesUseCase.execute,
  });
  const municipalityOptions = municipalities.map((m) => ({
    value: m.codigoIbge.toString(),
    label: m.nome,
  }));
  const inseOptions = [
    { value: '1', label: 'Nível I' },
    { value: '2', label: 'Nível II' },
  ];
  const locationOptions = [
    { value: 'urbana', label: 'Urbana' },
    { value: 'rural', label: 'Rural' },
  ];

  const handleClearFilters = () => {
    setSelectedMunicipality(undefined);
    setSelectedINSE(undefined);
    setSelectedLocation(undefined);
  };

  const hasActiveFilters =
    selectedMunicipality || selectedINSE || selectedLocation;

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 mb-6">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="flex items-center gap-2 text-brand-orange-dark flex-shrink-0">
          <Filter size={16} />
          <h3 className="font-semibold text-sm uppercase">Filtros</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
          <FilterDropdown
            label="Município"
            placeholder="Todos os municípios"
            searchPlaceholder="Buscar município..."
            emptyText="Nenhum município encontrado."
            options={municipalityOptions}
            value={selectedMunicipality}
            onChange={setSelectedMunicipality}
          />
          <FilterDropdown
            label="Nível Socioeconômico"
            placeholder="Todos os níveis"
            searchPlaceholder="Buscar nível..."
            emptyText="Nenhum nível encontrado."
            options={inseOptions}
            value={selectedINSE}
            onChange={setSelectedINSE}
            disabled={false}
          />
          <FilterDropdown
            label="Localização"
            placeholder="Urbana e Rural"
            searchPlaceholder="Buscar localização..."
            emptyText="Nenhuma localização encontrada."
            options={locationOptions}
            value={selectedLocation}
            onChange={setSelectedLocation}
            disabled={false}
          />
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={handleClearFilters}
            className="flex items-center gap-2 text-brand-text-secondary hover:text-brand-orange-dark"
          >
            <X size={14} />
            Limpar Filtros
          </Button>
        )}
      </div>
    </div>
  );
};

export default DashboardFilters;
