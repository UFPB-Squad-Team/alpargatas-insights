const legendItems = [
  { label: 'Crítico', color: 'bg-red-600' },
  { label: 'Alto Risco', color: 'bg-orange-500' },
  { label: 'Risco Moderado', color: 'bg-yellow-400' },
  { label: 'Baixo Risco', color: 'bg-gray-400' },
];

const RiskLegend = () => {
  return (
    <div className="flex flex-wrap gap-2 text-xs mt-2">
      {legendItems.map(({ label, color }) => (
        <div key={label} className="flex items-center gap-1">
          <span className={`w-3 h-3 rounded-full ${color}`} />
          <span className="text-gray-600">{label}</span>
        </div>
      ))}
    </div>
  );
};

export default RiskLegend;
