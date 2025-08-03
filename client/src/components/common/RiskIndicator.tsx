interface RiskIndicatorProps {
  score: number;
}

const vulnerabilityLevels = [
  { min: 0.9, color: 'bg-red-800', text: 'Crítica' },
  { min: 0.75, color: 'bg-red-500', text: 'Alta Vulnerabilidade' },
  { min: 0.4, color: 'bg-yellow-500', text: 'Vulnerabilidade Moderada' },
  { min: 0, color: 'bg-green-500', text: 'Baixa Vulnerabilidade' },
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
