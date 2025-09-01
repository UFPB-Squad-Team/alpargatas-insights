import { Button } from '@/ui/components/common/button';
import { Column } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import React from 'react';

type SortableHeaderProps<T> = {
  column: Column<T, unknown>;
  title: string;
  Icon?: React.ElementType;
};

export const SortableHeader = <T,>({
  column,
  title,
  Icon,
}: SortableHeaderProps<T>) => {
  const isSorted = column.getIsSorted();

  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(isSorted === 'asc')}
      className={`-ml-4 font-bold hover:bg-brand-orange-light/20 hover:text-brand-orange-dark ${
        isSorted ? 'text-brand-orange-dark' : ''
      }`}
    >
      {Icon && <Icon className="mr-2 h-4 w-4" />}
      {title}
      <ArrowUpDown className="ml-2 h-4 w-4 opacity-30 group-hover:opacity-100" />
    </Button>
  );
};
