import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import Spinner from '@/ui/components/common/Spinner';
import { usePagination } from '@/ui/hooks/usePagination';
import { listMunicipalitiesUseCase } from '@/shared/services/Municipality/logic/listMunicipalitiesUseCase';
import { Link } from 'react-router-dom';
import { ChevronRight, Map, School, Search } from 'lucide-react';
import { CustomPagination } from '@/ui/components/common/CustomPagination';
import { Input } from '@/ui/components/common/input';
import { useDebounce } from '@/ui/hooks/useDebounce';

const PAGE_SIZE = 20;

const KpiCard = ({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ElementType;
  value: string | number;
  label: string;
}) => (
  <div className="bg-white p-4 rounded-xl shadow-sm border">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-brand-orange-light/20 rounded-lg">
        <Icon className="h-6 w-6 text-brand-orange-dark" />
      </div>
      <div>
        <p className="text-2xl font-bold text-brand-text-primary">{value}</p>
        <p className="text-sm text-brand-text-secondary">{label}</p>
      </div>
    </div>
  </div>
);

const MunicipalitiesPage = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500); 

  const {
    data: paginatedData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['municipalities', page, debouncedSearchTerm],
    queryFn: () =>
      listMunicipalitiesUseCase.execute({
        page,
        limit: PAGE_SIZE,
        searchTerm: debouncedSearchTerm,
      }),
    placeholderData: keepPreviousData,
  });

  const municipalities = paginatedData?.data || [];
  const totalMunicipalities = paginatedData?.total || 0;
  const totalPages = Math.ceil(totalMunicipalities / PAGE_SIZE);

  const paginationRange = usePagination({
    currentPage: page,
    totalCount: totalMunicipalities,
    pageSize: PAGE_SIZE,
  });

  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-brand-text-primary">
          Atlas dos{' '}
          <span className="text-brand-orange-dark">Municípios da Paraíba</span>
        </h1>
        <p className="text-brand-text-secondary mt-1">
          Explore as estatísticas de infraestrutura escolar de cada um dos 223
          municípios.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard
          icon={Map}
          value={totalMunicipalities > 0 ? totalMunicipalities : '...'}
          label="Municípios Mapeados"
        />
        <KpiCard icon={School} value="3.768" label="Escolas Analisadas" />
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar município..."
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
          <div className="text-center text-red-500 h-96 flex items-center justify-center">
            Ocorreu um erro ao buscar os dados.
          </div>
        )}
        {!isLoading && !isError && (
          <>
            <div className="space-y-3">
              {municipalities.length > 0 ? (
                municipalities.map((municipality) => (
                  <Link
                    key={municipality.codigoIbge}
                    to={`/municipios/${municipality.codigoIbge}`}
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-brand-surface transition-colors border group"
                  >
                    <span className="font-bold text-lg text-brand-text-primary group-hover:text-brand-orange-dark">
                      {municipality.nome}
                    </span>
                    <ChevronRight className="h-6 w-6 text-brand-text-secondary transition-transform group-hover:translate-x-1" />
                  </Link>
                ))
              ) : (
                <div className="text-center text-brand-text-secondary py-10">
                  <p>
                    Nenhum município encontrado para "{debouncedSearchTerm}".
                  </p>
                </div>
              )}
            </div>

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
      </div>
    </div>
  );
};

export default MunicipalitiesPage;
