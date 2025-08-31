import { useState, useEffect } from 'react';
import SchoolListItem from './SchoolListItem';
import { BadgeAlert } from 'lucide-react';
import {
  HighRiskSchool,
  getHighRiskSchools,
} from '@/shared/mocks/services/getHighRiskSchools';
import Spinner from '@/ui/components/common/Spinner';
import InfoPopover from '@/ui/components/common/InfoPopover';
import { explanations } from '@/shared/config/explanations.config';

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
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-brand-orange-light p-2 rounded-lg">
          <BadgeAlert className="h-6 w-6 text-brand-orange-dark" />
        </div>
        <h3 className="font-bold text-lg text-brand-text-primary">
          Atenção Prioritária
        </h3>
        <InfoPopover
          title={explanations.HIGH_RISK_SCHOOLS_LIST.title}
          content={explanations.HIGH_RISK_SCHOOLS_LIST.content}
        />
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <Spinner />
        </div>
      ) : (
        <ul className="space-y-1">
          {schools.map(
            (
              school,
              index, 
            ) => (
              <li
                key={school.escola_id_inep} 
                onClick={() => onSelectSchool(school)}
                className="cursor-pointer rounded-lg hover:bg-gray-50 transition-colors"
              >
                <SchoolListItem
                  school={school}
                  rank={index + 1} 
                />
              </li>
            ),
          )}
        </ul>
      )}
    </div>
  );
};

export default HighRiskSchoolsList;
