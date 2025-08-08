import { useState, useEffect } from 'react';
import Spinner from '@/components/common/Spinner';
import {
  getTopMunicipalitiesByRisk,
  MunicipalityRisk,
} from '@/mocks/services/getTopMunicipalitiesByRisk';
import { Building2 } from 'lucide-react';

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

  const getRiskColor = (score: number) => {
    if (score >= 0.9) return 'bg-orange-900';
    if (score >= 0.75) return 'bg-orange-700';
    if (score >= 0.4) return 'bg-orange-500';
    return 'bg-orange-300';
  };

  return (
    <div className="bg-brand-background p-6 rounded-2xl shadow-sm border border-gray-200">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-brand-orange-light p-2 rounded-lg">
          <Building2 className="h-6 w-6 text-brand-orange-dark" />
        </div>
        <h3 className="font-bold text-lg text-brand-text-primary">
          Municípios Prioritários
        </h3>
      </div>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="space-y-4">
          {data.map((item) => (
            <div key={item.municipio_nome}>
              <div className="flex justify-between items-center mb-1 text-sm">
                <span className="font-medium text-brand-text-primary">
                  {item.municipio_nome}
                </span>
                <span className="font-semibold text-brand-text-secondary">
                  Risco de {(item.risco_medio * 100).toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`${getRiskColor(
                    item.risco_medio,
                  )} h-2.5 rounded-full transition-all duration-500`}
                  style={{ width: `${item.risco_medio * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopMunicipalitiesChart;
