import { useParams, useNavigate } from 'react-router-dom';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import Spinner from '@/ui/components/common/Spinner';
import { Button } from '@/ui/components/common/button';
import { ArrowLeft, School, TrendingUp } from 'lucide-react';
import RiskIndicator from '@/ui/components/common/RiskIndicator';
import { getMunicipalityDetailsUseCase } from '@/shared/services/Municipality/logic/getMunicipalityDetailsUseCase';
import { MunicipalityMap } from './components/MunicipalityMap';
import { listSchoolsUseCase } from '@/shared/services/Schools/logic/listPaginatedSchoolsUseCase';
import { getParaibaGeoJsonUseCase } from '@/modules/Dashboard/services/logic/Municipality/getParaibaGeoJsonUseCase';
import { listSchoolsForMapUseCase } from '@/modules/Dashboard/services/logic/School/listSchoolsForMapUseCase';
import { SchoolsTable } from '@/modules/Schools/components/SchoolTables';
import { usePagination } from '@/ui/hooks/usePagination';
import { useState } from 'react';
import { CustomPagination } from '@/ui/components/common/CustomPagination';

const TABLE_PAGE_SIZE = 10;

const MunicipalityDetailsPage = () => {
  const { id: municipioIdIbge } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [tablePage, setTablePage] = useState(1);

  const { data: municipality, isLoading: isLoadingMun } = useQuery({
    queryKey: ['municipality-details', municipioIdIbge],
    queryFn: () => getMunicipalityDetailsUseCase.execute(municipioIdIbge!),
    enabled: !!municipioIdIbge,
  });

  const { data: schoolsResponse, isLoading: isLoadingSchools } = useQuery({
    queryKey: ['schools-table-in-municipality', municipioIdIbge, tablePage],
    queryFn: () =>
      listSchoolsUseCase.execute({
        municipioIdIbge: municipioIdIbge,
        limit: TABLE_PAGE_SIZE,
        page: tablePage,
      }),
    enabled: !!municipioIdIbge,
    placeholderData: keepPreviousData,
  });

  const { data: mapData = [], isLoading: isLoadingMap } = useQuery({
    queryKey: ['schools-for-map', municipioIdIbge],
    queryFn: () =>
      listSchoolsForMapUseCase.execute({ municipioIdIbge: municipioIdIbge }),
    enabled: !!municipioIdIbge,
  });

  const { data: geojsonData } = useQuery({
    queryKey: ['paraiba-geojson'],
    queryFn: getParaibaGeoJsonUseCase.execute,
  });

  const municipalityGeoJson = geojsonData
    ? {
        ...geojsonData,
        features: geojsonData.features.filter(
          (feature: any) => feature?.properties?.id === municipioIdIbge,
        ),
      }
    : null;

  const schoolsForTable = schoolsResponse?.data || [];
  const totalSchools = schoolsResponse?.total || 0;
  const totalPages = Math.ceil(totalSchools / TABLE_PAGE_SIZE);

  const paginationRange = usePagination({
    currentPage: tablePage,
    totalCount: totalSchools,
    pageSize: TABLE_PAGE_SIZE,
  });

  const isLoading = isLoadingMun || isLoadingSchools || isLoadingMap;

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center py-20">
        <Spinner />
      </div>
    );
  }

  if (!municipality) {
    return (
      <div className="text-center font-semibold text-lg text-brand-text-secondary py-20">
        Município não encontrado.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" onClick={() => navigate('/municipios')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para a lista de municípios
        </Button>
      </div>

      <h1 className="text-3xl font-bold text-brand-text-primary">
        {municipality.nome}
      </h1>

      <div className="w-full h-96 rounded-2xl shadow-sm border overflow-hidden">
        <MunicipalityMap
          municipalityGeoJson={municipalityGeoJson}
          schoolsInMunicipality={mapData}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <div className="flex items-center gap-2 mb-2">
            <School className="h-4 w-4 text-brand-text-secondary" />
            <h3 className="font-semibold text-brand-text-secondary">
              Total de Escolas
            </h3>
          </div>
          <p className="text-4xl font-bold text-brand-text-primary pl-6">
            {municipality.totalEscolas}
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-brand-text-secondary" />
            <h3 className="font-semibold text-brand-text-secondary">
              Média de Risco (Infra.)
            </h3>
          </div>
          <div className="pl-6">
            <p className="text-4xl font-bold text-brand-text-primary">
              {(municipality.riscoMedio * 100).toFixed(0)}%
            </p>
            <div className="mt-1">
              <RiskIndicator score={municipality.riscoMedio} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <h2 className="text-xl font-bold text-brand-text-primary">
            Escolas em {municipality.nome}
          </h2>
          <p className="text-sm text-brand-text-secondary">
            Exibindo {schoolsForTable.length} de {totalSchools} escolas
          </p>
        </div>

        {schoolsForTable.length > 0 ? (
          <>
            <SchoolsTable data={schoolsForTable} />
            <div className="mt-6 flex justify-center">
              <CustomPagination
                currentPage={tablePage}
                totalPages={totalPages}
                paginationRange={paginationRange}
                onPageChange={setTablePage}
              />
            </div>
          </>
        ) : (
          <p className="text-brand-text-secondary text-center py-8">
            Nenhuma escola encontrada para este município.
          </p>
        )}
      </div>
    </div>
  );
};

export default MunicipalityDetailsPage;
