import { useState } from 'react';
import { NeedCard } from './components/NeedCard';
import { useQuery } from '@tanstack/react-query';
import Spinner from '@/ui/components/common/Spinner';
import { CustomPagination } from '@/ui/components/common/CustomPagination';
import { usePagination } from '@/ui/hooks/usePagination';
import { SubmitNeedDialog } from './components/SubmitNeedDialog';
import { INeed } from '@/domain/entities/Needs/Need';
import { listNeedsUseCase } from './services/needService.ts/logic/listNeedsUseCase';
import { Info } from 'lucide-react';
import { NeedDetailsModal } from './components/NeedDetailsModal';

const PAGE_SIZE = 9;

const NeedsPage = () => {
  const [page, setPage] = useState(1);
  const [selectedNeedId, setSelectedNeedId] = useState<string | null>(null);

  const {
    data: paginatedData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['needs-list', page],
    queryFn: () => listNeedsUseCase.execute({ page, limit: PAGE_SIZE }),
  });

  const needs = paginatedData?.data || [];
  const totalNeeds = paginatedData?.total || 0;
  const totalPages = Math.ceil(totalNeeds / PAGE_SIZE);

  const paginationRange = usePagination({
    currentPage: page,
    totalCount: totalNeeds,
    pageSize: PAGE_SIZE,
  });

  const handleSelectNeed = (need: INeed) => {
    setSelectedNeedId(need.id);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-brand-text-primary">
              Mapa de Necessidades{' '}
              <span className="text-brand-orange-dark">e Oportunidades</span>
            </h1>
            <p className="text-brand-text-secondary mt-1">
              Veja as necessidades relatadas pela comunidade e encontre
              oportunidades para ajudar.
            </p>
          </div>
          <SubmitNeedDialog />
        </div>

        <div className="flex items-center gap-2 p-3 text-sm text-sky-800 bg-sky-50 rounded-lg border border-sky-200">
          <Info className="h-5 w-5 flex-shrink-0" />
          <p>
            Este é um mural público. Todas as necessidades aqui foram revisadas
            e aprovadas.
          </p>
        </div>

        {isLoading && (
          <div className="flex justify-center py-20">
            <Spinner />
          </div>
        )}
        {isError && (
          <div className="text-center text-red-500 py-20">
            Ocorreu um erro ao carregar as necessidades.
          </div>
        )}

        {!isLoading && !isError && needs.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {needs.map((need) => (
                <NeedCard
                  key={need.id}
                  need={need}
                  onSelect={handleSelectNeed}
                />
              ))}
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
        {!isLoading && !isError && needs.length === 0 && (
          <div className="text-center text-brand-text-secondary py-20">
            <p>Nenhuma necessidade publicada no momento.</p>
          </div>
        )}
      </div>

      <NeedDetailsModal
        needId={selectedNeedId}
        onOpenChange={() => setSelectedNeedId(null)}
      />
    </>
  );
};

export default NeedsPage;
