import RiskIndicator from '@/components/common/RiskIndicator';
import {
  getHighRiskSchools,
  HighRiskSchool,
} from '@/mocks/services/getHighRiskSchools';
import { useState, useEffect } from 'react';

const HighRiskSchoolsList = () => {
  const [schools, setSchools] = useState<HighRiskSchool[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const data = await getHighRiskSchools(5); // Pega as top 5
        setSchools(data);
      } catch (error) {
        console.error('Erro ao buscar escolas de alto risco:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSchools();
  }, []);

  return (
    <div className="bg-brand-background p-6 rounded-2xl shadow-sm border border-gray-200 h-full">
      <h3 className="font-semibold text-brand-text-primary mb-4">
        Atenção Prioritária
      </h3>
      {isLoading ? (
        <p>Carregando lista...</p>
      ) : (
        <ul className="space-y-4">
          {schools.map((school) => (
            <li key={school.escola_id_inep} className="flex flex-col">
              <span className="font-medium text-sm text-brand-text-primary">
                {school.escola_nome}
              </span>
              <span className="text-xs text-brand-text-secondary mb-1">
                {school.municipio_nome}
              </span>
              <RiskIndicator score={school.score_de_risco} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HighRiskSchoolsList;
