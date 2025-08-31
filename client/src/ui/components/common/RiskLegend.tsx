import { MapPin } from 'lucide-react';

const legendItems = [
  { label: 'Alerta Máximo', color: 'text-orange-800' },
  { label: 'Alto Risco', color: 'text-orange-600' },
  { label: 'Risco Moderado', color: 'text-orange-500' },
  { label: 'Baixo Risco', color: 'text-orange-300' },
];

const RiskLegend = () => {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs mt-2">
      {legendItems.map(({ label, color }) => (
        <div key={label} className="flex items-center gap-1">
          <MapPin className={`w-4 h-4 ${color}`} />
          <span className="text-brand-text-secondary">{label}</span>
        </div>
      ))}
    </div>
  );
};

export default RiskLegend;
