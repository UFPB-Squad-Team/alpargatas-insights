import { useQuery } from '@tanstack/react-query';
import { useState, useMemo, useEffect } from 'react';
import Spinner from '@/ui/components/common/Spinner';
import DashboardFilters from '../Dashboard/components/custom/DashboardFilters';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/ui/components/common/pagination';
import { Input } from '@/ui/components/common/input';
import { Search } from 'lucide-react';
import { listAllSchoolsUseCase } from '@/shared/services/Schools/logic/listPaginatedSchoolsUseCase';
import { SchoolsTable } from './components/SchoolTables';
// import { usePagination } from '@/ui/hooks/usePagination';
import { useDebounce } from '@/ui/hooks/useDebounce';

const PAGE_SIZE = 50;

const SchoolsPage = () => {
  const [page, setPage] = useState(1);
  const [globalFilter, setGlobalFilter] = useState('');

  const {
    data: allSchools = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['schools-all-list'],
    queryFn: listAllSchoolsUseCase.execute,
  });

  const debouncedFilter = useDebounce(globalFilter, 300);

  useEffect(() => {
    setPage(1);
  }, [debouncedFilter]);

  const filteredSchools = useMemo(() => {
    if (!globalFilter) return allSchools;
    const filterText = globalFilter.toLowerCase();
    return allSchools.filter((school) =>
      [school.nome, school.municipio, school.inep.toString()].some((value) =>
        String(value).toLowerCase().includes(filterText),
      ),
    );
  }, [allSchools, globalFilter]);

  const totalSchools = filteredSchools.length;
  const totalPages = Math.ceil(totalSchools / PAGE_SIZE);

  const schoolsDataOnPage = useMemo(() => {
    const startIndex = (page - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    return filteredSchools.slice(startIndex, endIndex);
  }, [filteredSchools, page]);

  /**const paginationRange = usePagination({
    currentPage: page,
    totalCount: totalSchools,
    pageSize: PAGE_SIZE,
  });
  **/

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
            Exibindo {schoolsDataOnPage.length} de {totalSchools}
          </p>
          <p className="text-xs text-brand-text-secondary">
            {globalFilter ? 'Escolas Filtradas' : 'Total de Escolas'}
          </p>
        </div>
      </div>

      <DashboardFilters />

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar na tabela por nome, município, inep..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
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
            <SchoolsTable
              data={schoolsDataOnPage}
              globalFilter={globalFilter}
            />
            <div className="mt-6 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setPage((old) => Math.max(old - 1, 1));
                      }}
                      className={
                        page <= 1 ? 'pointer-events-none opacity-50' : ''
                      }
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <span className="px-4 py-2 text-sm">
                      Página {page} de {totalPages}
                    </span>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setPage((old) => Math.min(old + 1, totalPages));
                      }}
                      className={
                        page >= totalPages
                          ? 'pointer-events-none opacity-50'
                          : ''
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </>
        )}
        {!isLoading && !isError && totalSchools === 0 && (
          <div className="text-center text-brand-text-secondary py-10">
            <p>Nenhuma escola encontrada para o filtro atual.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchoolsPage;
