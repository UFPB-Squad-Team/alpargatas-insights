import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from '@/ui/components/common/Spinner';
import { Search } from 'lucide-react';
import { useDebounce } from '@/ui/hooks/useDebounce';
import { usePagination } from '@/ui/hooks/usePagination';
import { CustomPagination } from '@/ui/components/common/CustomPagination';
import { useFilters } from '@/ui/context/FiltersContext';
import { School } from '@/domain/entities/School/SchoolProps';
import { listSchoolsUseCase } from '@/shared/services/Schools/logic/listPaginatedSchoolsUseCase';
import DashboardFilters from '../../Dashboard/components/custom/DashboardFilters';
import { Input } from '@/ui/components/common/input';
import { SchoolsTable } from '../../Schools/components/SchoolTables';

const PAGE_SIZE = 25;

const SimulatorSchoolSelection = () => {
  const [page, setPage] = useState(1);
  const { filters } = useFilters();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const {
    data: paginatedData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      'schools-list-for-simulator',
      page,
      debouncedSearchTerm,
      filters,
    ],
    queryFn: () =>
      listSchoolsUseCase.execute({
        page,
        limit: PAGE_SIZE,
        searchTerm: debouncedSearchTerm,
        ...filters,
      }),
    placeholderData: keepPreviousData,
  });

  const schoolsOnPage = paginatedData?.data || [];
  const totalSchools = paginatedData?.total || 0;
  const totalPages = Math.ceil(totalSchools / PAGE_SIZE);

  const paginationRange = usePagination({
    currentPage: page,
    totalCount: totalSchools,
    pageSize: PAGE_SIZE,
  });

  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm, filters]);

  const handleSelectSchool = (school: School) => {
    navigate(`/dashboard/simulador/${school.id || school.inep}`);
  };

  return (
    <div className="space-y-6">
      <DashboardFilters />

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por nome, município, inep..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        {isLoading && (
          <div className="flex justify-center items-center h-96">
            <Spinner />
          </div>
        )}
        {isError && (
          <div className="text-center text-red-500 py-10">
            Erro ao carregar os dados.
          </div>
        )}

        {!isLoading && !isError && totalSchools > 0 && (
          <>
            <SchoolsTable
              data={schoolsOnPage}
              onRowClick={handleSelectSchool}
            />
            <div className="mt-8 flex justify-center">
              <CustomPagination
                currentPage={page}
                totalPages={totalPages}
                paginationRange={paginationRange}
                onPageChange={setPage}
              />
            </div>
          </>
        )}
        {!isLoading && !isError && totalSchools === 0 && (
          <div className="text-center text-brand-text-secondary py-10">
            <p>Nenhuma escola encontrada para os filtros aplicados.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimulatorSchoolSelection;
