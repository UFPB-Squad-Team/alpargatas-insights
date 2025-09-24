import { useFilters } from '@/ui/context/FiltersContext';
import { Switch } from '@/ui/components/common/switch';
import { Label } from '@/ui/components/common/label';
import { Building, Globe } from 'lucide-react';

export const ViewToggle = () => {
  const { filters, updateFilter } = useFilters();

  const isIAView = !!filters.municipioSomaProjetos;

  const handleToggle = (isChecked: boolean) => {
    updateFilter('municipioSomaProjetos', isChecked ? true : undefined);
  };

  return (
    <div className="flex items-center justify-center space-x-4 bg-white p-4 rounded-2xl shadow-sm border">
      <div className="flex items-center gap-2">
        <Globe className={`h-5 w-5 ${!isIAView ? 'text-brand-orange-dark' : 'text-gray-400'}`} />
        <Label htmlFor="view-toggle" className={`font-semibold ${!isIAView ? 'text-brand-text-primary' : 'text-gray-400'}`}>
          Visão Paraíba (Geral)
        </Label>
      </div>
      <Switch
        id="view-toggle"
        checked={isIAView}
        onCheckedChange={handleToggle}
      />
      <div className="flex items-center gap-2">
        <Building className={`h-5 w-5 ${isIAView ? 'text-brand-orange-dark' : 'text-gray-400'}`} />
        <Label htmlFor="view-toggle" className={`font-semibold ${isIAView ? 'text-brand-text-primary' : 'text-gray-400'}`}>
          Visão I.A. (Municípios Impactados)
        </Label>
      </div>
    </div>
  );
};