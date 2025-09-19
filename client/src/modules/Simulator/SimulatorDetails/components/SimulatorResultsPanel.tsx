import RiskIndicator from '@/ui/components/common/RiskIndicator';
import Spinner from '@/ui/components/common/Spinner';
import { TrendingDown } from 'lucide-react';

type SimulatorResultsPanelProps = {
  isSimulating: boolean;
  simulationResult: {
    currentScore: number;
    simulatedScore: number;
  } | null;
};

const ResultCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="flex-1 p-4 bg-gray-50 rounded-lg text-center">
    <p className="text-sm font-semibold text-brand-text-secondary">{title}</p>
    {children}
  </div>
);

export const SimulatorResultsPanel = ({
  isSimulating,
  simulationResult,
}: SimulatorResultsPanelProps) => {
  if (isSimulating || !simulationResult) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border sticky top-6 h-64 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const { currentScore, simulatedScore } = simulationResult;
  const reduction = currentScore - simulatedScore;
  const reductionPercentage =
    reduction > 0 ? (reduction / currentScore) * 100 : 0;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border sticky top-6">
      <h2 className="text-xl font-bold text-brand-text-primary mb-4 text-center">
        Impacto no Score de Risco
      </h2>
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Card ANTES */}
        <ResultCard title="Score Atual">
          <p className="text-3xl font-bold text-brand-text-secondary">
            {(currentScore * 100).toFixed(0)}%
          </p>
          <div className="mt-1 flex justify-center">
            <RiskIndicator score={currentScore} />
          </div>
        </ResultCard>

        {/* Card DEPOIS */}
        <ResultCard title="Score Simulado">
          <p className="text-3xl font-bold text-brand-orange-dark">
            {(simulatedScore * 100).toFixed(0)}%
          </p>
          <div className="mt-1 flex justify-center">
            <RiskIndicator score={simulatedScore} />
          </div>
        </ResultCard>
      </div>

      {/* Card de REDUÇÃO */}
      {reduction > 0.001 && (
        <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-green-600" />
            <p className="text-lg font-bold text-green-700">
              Redução de {reductionPercentage.toFixed(1)}%
            </p>
          </div>
          <p className="text-sm text-green-600 pl-7">
            O risco da escola diminuiu significativamente.
          </p>
        </div>
      )}
      {reduction === 0 && (
        <div className="mt-4 p-4 text-center text-brand-text-secondary">
          <p>Selecione uma intervenção para ver o impacto.</p>
        </div>
      )}
    </div>
  );
};
