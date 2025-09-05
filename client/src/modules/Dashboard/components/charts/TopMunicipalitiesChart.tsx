import { Building2 } from 'lucide-react';
import Spinner from '@/ui/components/common/Spinner';
import { useQuery } from '@tanstack/react-query';
import { getTopMunicipalitiesByRiskUseCase } from '../../services/logic/Municipality/getTopMunicipalitiesByRiskUseCase';
import { MunicipalityRisk } from '@/domain/entities/Municipality/Municipality';
import { explanations } from '@/shared/config/explanations.config';
import InfoPopover from '@/ui/components/common/InfoPopover';
import { useFilters } from '@/ui/context/FiltersContext';

const getRiskInfo = (score: number) => {
  if (score >= 0.9) return { color: 'text-orange-900', text: 'Alerta Máximo' };
  if (score >= 0.75) return { color: 'text-orange-700', text: 'Alto Risco' };
  if (score >= 0.4) return { color: 'text-orange-500', text: 'Risco Moderado' };
  return { color: 'text-orange-300', text: 'Baixo Risco' };
};

const TopMunicipalitiesChart = () => {
  const { filters } = useFilters();

  const { data: municipalities = [], isLoading } = useQuery({
    queryKey: ['top-municipalities-by-risk', filters],
    queryFn: () => getTopMunicipalitiesByRiskUseCase.execute(filters),
  });

  const sortedMunicipalities = [...municipalities]
    .sort((a, b) => b.riscoMedio - a.riscoMedio)
    .slice(0, 8);

  return (
    <div className="bg-brand-background p-6 rounded-2xl shadow-sm border border-gray-200">
      <div className="flex items-center gap-4 mb-6">
        <div className="bg-brand-orange-light p-2 rounded-lg">
          <Building2 className="h-6 w-6 text-brand-orange-dark" />
        </div>
        <h3 className="font-bold text-lg text-brand-text-primary">
          Municípios Prioritários
        </h3>
        <InfoPopover
          title={explanations.CHART_TOP_MUNICIPALITIES.title}
          content={explanations.CHART_TOP_MUNICIPALITIES.content}
        />
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <Spinner />
        </div>
      ) : sortedMunicipalities.length > 0 ? (
        <div className="space-y-5">
          {sortedMunicipalities.map((item: MunicipalityRisk) => {
            const riskInfo = getRiskInfo(item.riscoMedio);
            const scorePercentage = (item.riscoMedio * 100).toFixed(0);

            return (
              <div key={item.nome}>
                <div className="flex justify-between items-center mb-1 text-sm">
                  <span className="font-medium text-brand-text-primary">
                    {item.nome}
                  </span>
                  <span className={`font-bold ${riskInfo.color}`}>
                    {riskInfo.text}
                  </span>
                </div>
                <div className="relative w-full pt-2">
                  <div className="flex w-full h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-orange-300"
                      style={{ width: '40%' }}
                    ></div>
                    <div
                      className="bg-orange-500"
                      style={{ width: '35%' }}
                    ></div>
                    <div
                      className="bg-orange-700"
                      style={{ width: '15%' }}
                    ></div>
                    <div
                      className="bg-orange-800"
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
      ) : (
        <div className="flex-grow flex items-center justify-center text-center text-brand-text-secondary">
          <p>Nenhum dado encontrado para os filtros selecionados.</p>
        </div>
      )}
    </div>
  );
};

export default TopMunicipalitiesChart;
