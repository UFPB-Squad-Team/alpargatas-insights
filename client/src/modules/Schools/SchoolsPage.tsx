import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import Spinner from '@/ui/components/common/Spinner';
import DashboardFilters from '../Dashboard/components/custom/DashboardFilters';
import { Input } from '@/ui/components/common/input';
import { Search } from 'lucide-react';
import { useDebounce } from '@/ui/hooks/useDebounce';
import { usePagination } from '@/ui/hooks/usePagination';
import { CustomPagination } from '@/ui/components/common/CustomPagination';
import { SchoolsTable } from './components/SchoolTables';
import { listSchoolsUseCase } from '@/shared/services/Schools/logic/listPaginatedSchoolsUseCase';
import { useFilters } from '@/ui/context/FiltersContext';

const PAGE_SIZE = 25;

const SchoolsPage = () => {
  const [page, setPage] = useState(1);
  const { filters } = useFilters();

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const {
    data: paginatedData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['schools-list', page, debouncedSearchTerm, filters],
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-text-primary">
            Análise de Escolas{' '}
            <span className="text-brand-orange-dark">da Paraíba</span>
          </h1>
          <p className="text-brand-text-secondary">
            Explore, filtre e analise os dados de todas as escolas da rede
            pública.
          </p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-brand-text-primary">
            Exibindo {schoolsOnPage.length} de {totalSchools}
          </p>
          <p className="text-xs text-brand-text-secondary">
            {/* CORREÇÃO: Verificamos o `searchTerm` para a mensagem */}
            {searchTerm || Object.values(filters).some((v) => v)
              ? 'Escolas Filtradas'
              : 'Total de Escolas'}
          </p>
        </div>
      </div>

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
          <div className="flex justify-center items-center h-64">
            <Spinner />
          </div>
        )}
        {isError && (
          <div className="text-center text-red-500">
            Ocorreu um erro ao buscar os dados das escolas.
          </div>
        )}
        {!isLoading && !isError && totalSchools > 0 && (
          <>
            <SchoolsTable data={schoolsOnPage} />
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

export default SchoolsPage;
