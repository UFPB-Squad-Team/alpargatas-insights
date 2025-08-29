const legendItems = [
  { label: 'Alerta Máximo', color: 'bg-risk-critical' },
  { label: 'Alto Risco', color: 'bg-risk-high' },
  { label: 'Risco Moderado', color: 'bg-risk-medium' },
  { label: 'Baixo Risco', color: 'bg-risk-low' },
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
