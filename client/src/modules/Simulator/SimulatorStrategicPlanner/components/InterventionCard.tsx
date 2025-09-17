import { cn } from '@/shared/lib/utils';
import React from 'react';

type InterventionCardProps = {
  icon: React.ElementType;
  title: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
};

export const InterventionCard = ({
  icon: Icon,
  title,
  description,
  isSelected,
  onClick,
}: InterventionCardProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col items-center justify-center text-center p-6 rounded-2xl border-2 transition-all duration-200',
        isSelected
          ? 'border-brand-orange-dark bg-brand-orange-light/10 shadow-lg'
          : 'bg-white hover:bg-gray-50 hover:shadow-md border-gray-200',
      )}
    >
      <div
        className={cn(
          'p-3 rounded-full mb-3',
          isSelected ? 'bg-brand-orange-dark' : 'bg-brand-orange-light/20',
        )}
      >
        <Icon
          className={cn(
            'h-8 w-8',
            isSelected ? 'text-white' : 'text-brand-orange-dark',
          )}
        />
      </div>
      <h3 className="font-bold text-lg text-brand-text-primary">{title}</h3>
      <p className="text-sm text-brand-text-secondary mt-1">{description}</p>
    </button>
  );
};
