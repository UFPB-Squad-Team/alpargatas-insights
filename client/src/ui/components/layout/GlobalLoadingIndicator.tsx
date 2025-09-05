import { useIsFetching } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

export const GlobalLoadingIndicator = () => {
  const isFetching = useIsFetching();

  return isFetching > 0 ? (
    <div className="flex items-center gap-2 text-brand-text-secondary animate-pulse">
      <Loader2 className="h-4 w-4 animate-spin" />
      <span className="text-xs font-medium">Atualizando dados...</span>
    </div>
  ) : null;
};
