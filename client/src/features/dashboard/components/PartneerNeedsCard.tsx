import { Megaphone } from 'lucide-react';

const PartnerNeedsCard = () => {
  return (
    <div className="bg-brand-background p-6 rounded-2xl shadow-sm border border-gray-200">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-brand-orange-light p-2 rounded-lg">
          <Megaphone className="h-6 w-6 text-brand-orange-dark" />
        </div>
        <h3 className="font-bold text-lg text-brand-text-primary">
          Necessidades dos Parceiros
        </h3>
      </div>
      <div className="text-center p-4 border-2 border-dashed rounded-lg">
        <p className="text-sm text-brand-text-secondary">
          Módulo 3 (Em breve):
        </p>
        <p className="text-xs text-brand-text-secondary mt-1">
          Um canal direto para escolas e comunidades reportarem suas
          necessidades urgentes.
        </p>
      </div>
    </div>
  );
};

export default PartnerNeedsCard;
