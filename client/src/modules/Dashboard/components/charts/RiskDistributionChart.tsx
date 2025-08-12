
import { RiskDistribution, getRiskDistribution } from '@/shared/mocks/services/getRiskDistribution';
import Spinner from '@/ui/components/common/Spinner';
import { ChartBar } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const RiskDistribuitonChart = () => {
  const [data, setData] = useState<RiskDistribution[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getRiskDistribution();
        setData(result);
      } catch (error) {
        console.error('Erro ao buscar dados de distribuilçao de risco', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="bg-brand-background rounded-2xl flex flex-col h-full">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-brand-orange-light p-2 rounded-lg">
          <ChartBar className="h-6 w-6 text-brand-orange-dark" />
        </div>
        <h3 className="font-bold text-lg text-brand-text-primary">
          Distribuição de Risco
        </h3>
      </div>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
          >
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="faixa"
              axisLine={true}
              tickLine={false}
              fontSize={12}
              width={90}
            />
            <Tooltip cursor={{ fill: '#f8f9fa' }} />
            <Bar dataKey="quantidade" barSize={20} radius={[0, 5, 5, 0]}>
              {data.map((entry) => (
                <Cell key={`cell-${entry.faixa}`} fill={entry.cor} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RiskDistribuitonChart;
