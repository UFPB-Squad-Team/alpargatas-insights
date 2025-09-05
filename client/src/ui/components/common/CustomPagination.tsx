import { cn } from '@/shared/lib/utils';
import { DOTS } from '@/ui/hooks/usePagination';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type CustomPaginationProps = {
  paginationRange: (string | number)[];
  currentPage: number;
  onPageChange: (page: number) => void;
  totalPages: number;
};

export const CustomPagination = ({
  paginationRange,
  currentPage,
  onPageChange,
  totalPages,
}: CustomPaginationProps) => {
  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <nav>
      <ul className="flex items-center gap-1">
        <li>
          <button
            onClick={onPrevious}
            disabled={isFirstPage}
            className={cn(
              'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2 gap-1 pl-2.5',
              {
                'pointer-events-none opacity-50': isFirstPage,
                'hover:bg-accent hover:text-accent-foreground': !isFirstPage,
              },
            )}
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Anterior</span>
          </button>
        </li>

        {paginationRange.map((pageNumber, index) => {
          if (pageNumber === DOTS) {
            return (
              <li
                key={`${DOTS}-${index}`}
                className="flex items-center justify-center h-10 w-10"
              >
                ...
              </li>
            );
          }

          return (
            <li key={pageNumber}>
              <button
                onClick={() => onPageChange(pageNumber as number)}
                className={cn(
                  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors h-10 w-10',
                  {
                    'bg-brand-orange-dark text-white hover:bg-brand-orange-dark/90':
                      pageNumber === currentPage,
                    'hover:bg-accent hover:text-accent-foreground':
                      pageNumber !== currentPage,
                  },
                )}
              >
                {pageNumber}
              </button>
            </li>
          );
        })}

        <li>
          <button
            onClick={onNext}
            disabled={isLastPage}
            className={cn(
              'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2 gap-1 pr-2.5',
              {
                'pointer-events-none opacity-50': isLastPage,
                'hover:bg-accent hover:text-accent-foreground': !isLastPage,
              },
            )}
          >
            <span>Próximo</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </li>
      </ul>
    </nav>
  );
};
