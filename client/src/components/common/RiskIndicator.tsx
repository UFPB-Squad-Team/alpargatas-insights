interface RiskIndicatorProps {
  score: number;
}

const vulnerabilityLevels = [
  { min: 0.9, color: 'bg-red-700', text: 'Alerta Máximo' },
  { min: 0.75, color: 'bg-orange-500', text: 'Alto Risco' },
  { min: 0.4, color: 'bg-yellow-500', text: 'Risco Moderado' },
  { min: 0, color: 'bg-gray-300', text: 'Baixo Risco' },
];

const RiskIndicator = ({ score }: RiskIndicatorProps) => {
  const { color, text } =
    vulnerabilityLevels.find((level) => score >= level.min) ??
    vulnerabilityLevels[vulnerabilityLevels.length - 1];

  return (
    <div className="flex items-center gap-2">
      <span className={`h-2 w-2 rounded-full ${color}`} />
      <span className="text-xs text-gray-600">{text}</span>
    </div>
  );
};

export default RiskIndicator;
