import RiskIndicator from '@/components/common/RiskIndicator';
import { HighRiskSchool } from '@/mocks/services/getHighRiskSchools';

interface SchoolListItemProps {
  school: HighRiskSchool;
  index: number;
}

const SchoolListItem = ({ school, index }: SchoolListItemProps) => {
  const bgColor = index % 2 === 0 ? 'bg-brand-surface' : 'bg-white';

  return (
    <li
      className={`
    relative
    flex justify-between items-center p-3 rounded-lg border
    ${bgColor}
    shadow-sm hover:bg-brand-surface cursor-pointer transition-colors duration-200
    before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:rounded-t-lg
    even:before:bg-brand-orange-light odd:before:bg-brand-orange-dark
  `}
    >
      <div>
        <p className="font-semibold text-sm text-brand-text-primary">
          {school.escola_nome}
        </p>
        <p className="text-xs text-brand-text-secondary">
          {school.municipio_nome}
        </p>
      </div>
      <RiskIndicator score={school.score_de_risco} />
    </li>
  );
};

export default SchoolListItem;
