import { useState, useEffect } from 'react';
import SchoolListItem from './SchoolListItem';
import {
  getHighRiskSchools,
  HighRiskSchool,
} from '@/mocks/services/getHighRiskSchools';
import { BadgeAlert } from 'lucide-react';
import Spinner from '@/components/common/Spinner';

interface HighRiskSchoolsListProps {
  onSelectSchool: (school: HighRiskSchool) => void;
}

const HighRiskSchoolsList = ({ onSelectSchool }: HighRiskSchoolsListProps) => {
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
        <Spinner />
      ) : (
        <ul>
          {schools.map((school) => (
            <li
              key={school.escola_id_inep}
              onClick={() => onSelectSchool(school)}
              className="cursor-pointer hover:bg-brand-surface rounded p-2 ease-in-out duration-200"
            >
              <SchoolListItem school={school} index={0} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HighRiskSchoolsList;
