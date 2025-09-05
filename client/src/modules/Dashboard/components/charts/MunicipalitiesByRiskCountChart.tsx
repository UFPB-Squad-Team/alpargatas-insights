import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { BarChart3 } from 'lucide-react';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from 'recharts';

import Spinner from '@/ui/components/common/Spinner';
import InfoPopover from '@/ui/components/common/InfoPopover';
import { explanations } from '@/shared/config/explanations.config';
import { getMunicipalitiesByRiskCountUseCase } from '../../services/logic/Municipality/getMunicipalitiesByRiskCountUseCase';
import { useFilters } from '@/ui/context/FiltersContext';

const BAR_COLORS = ['#963B14', '#D46419', '#FFA726'];

const MunicipalitiesByRiskCountChart = () => {
  const { filters } = useFilters();

  const { data: municipalities = [], isLoading } = useQuery({
    queryKey: ['municipalities-by-risk-count', filters],
    queryFn: () => getMunicipalitiesByRiskCountUseCase.execute(filters),
    placeholderData: keepPreviousData,
  });

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const sortedData = [...municipalities]
    .sort((a, b) => b.escolasEmAltoRisco - a.escolasEmAltoRisco)
    .slice(0, 10);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-brand-orange-light p-2 rounded-lg">
          <BarChart3 className="h-6 w-6 text-brand-orange-dark" />
        </div>
        <h3 className="font-bold text-lg text-brand-text-primary">
          Municípios com Mais Escolas em Risco
        </h3>
        <InfoPopover
          title={explanations.CHART_MUNICIPALITIES_BY_RISK_COUNT.title}
          content={explanations.CHART_MUNICIPALITIES_BY_RISK_COUNT.content}
        />
      </div>

      {sortedData.length > 0 ? (
        <div className="flex-grow">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sortedData}
              layout="vertical"
              margin={{ top: 5, right: 20, left: 5, bottom: 5 }}
              barCategoryGap="20%"
            >
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="nome"
                width={100}
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: '#f8f9fa' }}
                formatter={(value) => [`${value} escolas`, 'Quantidade']}
              />
              <Bar
                dataKey="escolasEmAltoRisco"
                barSize={20}
                radius={[0, 5, 5, 0]}
              >
                {sortedData.map((_entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={BAR_COLORS[index % BAR_COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex-grow flex items-center justify-center text-center text-brand-text-secondary">
          <p>
            Nenhum município com escolas de alto risco encontrado para os
            filtros selecionados.
          </p>
        </div>
      )}
    </div>
  );
};

export default MunicipalitiesByRiskCountChart;
