import { useState, useEffect } from 'react';
import SchoolListItem from './SchoolListItem';
import {
  getHighRiskSchools,
  HighRiskSchool,
} from '@/mocks/services/getHighRiskSchools';
import { BadgeAlert } from 'lucide-react';

const HighRiskSchoolsList = () => {
  const [schools, setSchools] = useState<HighRiskSchool[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const data = await getHighRiskSchools(5);
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
    <div className="bg-brand-background p-6 rounded-2xl shadow-sm border border-gray-200">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-brand-orange-light p-2 rounded-lg">
          <BadgeAlert className="h-6 w-6 text-brand-orange-dark" />
        </div>
        <h3 className="font-bold text-lg text-brand-text-primary">
          Atenção Prioritária
        </h3>
      </div>
      {isLoading ? (
        <p>Carregando lista...</p> //TODO: Criar um componente de loading mais elaborado
      ) : (
        <ul className="space-y-3">
          {schools.map((school, index) => (
            <SchoolListItem
              key={school.escola_id_inep}
              school={school}
              index={index}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default HighRiskSchoolsList;
