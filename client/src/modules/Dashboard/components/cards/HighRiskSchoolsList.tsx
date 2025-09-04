import SchoolListItem from './SchoolListItem';
import { BadgeAlert } from 'lucide-react';
import Spinner from '@/ui/components/common/Spinner';
import InfoPopover from '@/ui/components/common/InfoPopover';
import { explanations } from '@/shared/config/explanations.config';
import { HighRiskSchool } from '../../services/types/Municipality/MunicipalitiesTypes';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useFilters } from '@/ui/context/FiltersContext';
import { getHighRiskSchoolsUseCase } from '@/shared/services/Schools/logic/getHighRiskSchoolUseCase';

interface HighRiskSchoolsListProps {
  onSelectSchool: (school: HighRiskSchool) => void;
}

const HighRiskSchoolsList = ({ onSelectSchool }: HighRiskSchoolsListProps) => {
  const { filters } = useFilters();

  const { data: schools = [], isLoading } = useQuery({
    queryKey: ['high-risk-schools', filters],
    queryFn: () => getHighRiskSchoolsUseCase.execute(filters),
    placeholderData: keepPreviousData,
  });

  schools.sort((a, b) => b.scoreDeRisco - a.scoreDeRisco);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col">
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
        <div className="flex-grow flex justify-center items-center h-48">
          <Spinner />
        </div>
      ) : schools.length > 0 ? (
        <ul className="space-y-1">
          {schools.map((school, index) => (
            <li
              key={school.id}
              onClick={() => onSelectSchool(school)}
              className="cursor-pointer rounded-lg hover:bg-gray-50 transition-colors"
            >
              <SchoolListItem school={school} rank={index + 1} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex-grow flex items-center justify-center text-center text-brand-text-secondary">
          <p>
            Nenhuma escola de alto risco encontrada para os filtros
            selecionados.
          </p>
        </div>
      )}
    </div>
  );
};

export default HighRiskSchoolsList;
