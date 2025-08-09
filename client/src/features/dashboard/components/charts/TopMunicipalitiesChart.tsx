import { useState, useEffect } from 'react';
import Spinner from '@/components/common/Spinner';
import {
  getTopMunicipalitiesByRisk,
  MunicipalityRisk,
} from '@/mocks/services/getTopMunicipalitiesByRisk';
import { Building2 } from 'lucide-react';

const getRiskInfo = (score: number) => {
  if (score >= 0.9) return { color: 'text-orange-900', text: 'Alerta Máximo' };
  if (score >= 0.75) return { color: 'text-orange-700', text: 'Alto Risco' };
  if (score >= 0.4) return { color: 'text-orange-500', text: 'Risco Moderado' };
  return { color: 'text-orange-300', text: 'Baixo Risco' };
};

const TopMunicipalitiesChart = () => {
  const [data, setData] = useState<MunicipalityRisk[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getTopMunicipalitiesByRisk();
        setData(result);
      } catch (error) {
        console.error('Erro ao buscar top municípios:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center justify-center h-full">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="bg-brand-background p-6 rounded-2xl shadow-sm border border-gray-200">
      <div className="flex items-center gap-4 mb-6">
        <div className="bg-brand-orange-light p-2 rounded-lg">
          <Building2 className="h-6 w-6 text-brand-orange-dark" />
        </div>
        <h3 className="font-bold text-lg text-brand-text-primary">
          Municípios Prioritários
        </h3>
      </div>
      <div className="space-y-5">
        {data.map((item) => {
          const riskInfo = getRiskInfo(item.risco_medio);
          const scorePercentage = (item.risco_medio * 100).toFixed(0);

          return (
            <div key={item.municipio_nome}>
              <div className="flex justify-between items-center mb-1 text-sm">
                <span className="font-medium text-brand-text-primary">
                  {item.municipio_nome}
                </span>
                <span className={`font-bold ${riskInfo.color}`}>
                  {riskInfo.text}
                </span>
              </div>

              <div className="relative w-full pt-2">
                <div className="flex w-full h-2 rounded-full overflow-hidden">
                  <div className="bg-orange-300" style={{ width: '40%' }}></div>
                  <div className="bg-orange-500" style={{ width: '35%' }}></div>
                  <div className="bg-orange-700" style={{ width: '15%' }}></div>
                  <div className="bg-orange-900" style={{ width: '10%' }}></div>
                </div>
                <div
                  className="absolute top-0 w-0 h-0"
                  style={{
                    left: `${scorePercentage}%`,
                    borderLeft: '6px solid transparent',
                    borderRight: '6px solid transparent',
                    borderTop: '8px solid #212529',
                    transform: 'translateX(-50%)',
                    transition: 'left 0.3s ease-in-out',
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopMunicipalitiesChart;
