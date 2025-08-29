import { Building2 } from 'lucide-react';
import Spinner from '@/ui/components/common/Spinner';
import { useQuery } from '@tanstack/react-query';
import { getTopMunicipalitiesByRiskUseCase } from '../../services/logic/Municipality/getTopMunicipalitiesByRiskUseCase';
import { MunicipalityRisk } from '@/domain/entities/Municipality/Municipality';

const getRiskInfo = (score: number) => {
  if (score >= 0.9)
    return { color: 'text-risk-critical', text: 'Alerta Máximo' };
  if (score >= 0.75) return { color: 'text-risk-high', text: 'Alto Risco' };
  if (score >= 0.4)
    return { color: 'text-risk-medium', text: 'Risco Moderado' };
  return { color: 'text-risk-low', text: 'Baixo Risco' };
};

const TopMunicipalitiesChart = () => {
  const { data: municipalities = [], isLoading } = useQuery({
    queryKey: ['top-municipalities-by-risk'],
    queryFn: getTopMunicipalitiesByRiskUseCase.execute,
  });

  const sortedMunicipalities = [...municipalities]
    .sort((a, b) => b.riscoMedio - a.riscoMedio)
    .slice(0, 8);

  return (
    <div className="bg-brand-background p-6 rounded-2xl shadow-sm border border-gray-200">
      <div className="flex items-center gap-4 mb-6">
        <div className="bg-brand-primary p-2 rounded-lg">
          <Building2 className="h-6 w-6 text-brand-accent" />
        </div>
        <h3 className="font-bold text-lg text-brand-text-primary">
          Municípios Prioritários
        </h3>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <Spinner />
        </div>
      ) : (
        <div className="space-y-5">
          {sortedMunicipalities.map((item: MunicipalityRisk) => {
            const riskInfo = getRiskInfo(item.riscoMedio);
            const scorePercentage = (item.riscoMedio * 100).toFixed(0);

            return (
              <div key={item.nome}>
                <div className="flex justify-between items-center mb-1 text-sm">
                  <span className="font-medium text-brand-accent">
                    {item.nome}
                  </span>
                  <span className={`font-bold ${riskInfo.color}`}>
                    {riskInfo.text}
                  </span>
                </div>
                <div className="relative w-full pt-2">
                  <div className="flex w-full h-2 rounded-full overflow-hidden">
                    <div className="bg-risk-low" style={{ width: '40%' }}></div>
                    <div
                      className="bg-risk-medium"
                      style={{ width: '35%' }}
                    ></div>
                    <div
                      className="bg-risk-high"
                      style={{ width: '15%' }}
                    ></div>
                    <div
                      className="bg-risk-critical"
                      style={{ width: '10%' }}
                    ></div>
                  </div>
                  <div
                    className="absolute top-0 w-0 h-0"
                    style={{
                      left: `${scorePercentage}%`,
                      borderLeft: '6px solid transparent',
                      borderRight: '6px solid transparent',
                      borderTop: '8px solid #212529',
                      transform: 'translateX(-50%)',
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TopMunicipalitiesChart;
