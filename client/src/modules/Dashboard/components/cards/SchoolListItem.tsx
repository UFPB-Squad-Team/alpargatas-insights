import { HighRiskSchool } from '@/shared/mocks/services/getHighRiskSchools';

interface SchoolListItemProps {
  school: HighRiskSchool; 
  rank: number;
}

const getRiskBgClass = (score: number) => {
  if (score >= 0.9) return 'bg-red-700';
  if (score >= 0.75) return 'bg-orange-600';
  if (score >= 0.4) return 'bg-yellow-500';
  return 'bg-gray-400';
};

const SchoolListItem = ({ school, rank }: SchoolListItemProps) => {
  const scorePercentage = (school.score_de_risco * 100).toFixed(0);

  return (
    <div className="flex items-center p-3 space-x-4 border-b border-gray-100 last:border-b-0">
      <div className="flex-none w-6 text-center">
        <span className="text-lg font-bold text-gray-400">{rank}</span>
      </div>
      <div className="flex-grow min-w-0">
        {' '}
        {/* Adicionado min-w-0 para o truncate funcionar corretamente */}
        <p
          className="font-semibold text-sm text-brand-text-primary truncate"
          title={school.escola_nome}
        >
          {/* Usando a propriedade 'escola_nome' do mock antigo */}
          {school.escola_nome}
        </p>
        <p className="text-xs text-brand-text-secondary">
          {/* Usando a propriedade 'municipio_nome' do mock antigo */}
          {school.municipio_nome}
        </p>
      </div>
      <div className="flex-none flex items-center space-x-3 w-28 justify-end">
        <span className="text-sm font-bold text-brand-text-primary">
          {scorePercentage}%
        </span>
        <div className="w-12 h-2 bg-gray-200 rounded-full">
          <div
            className={`h-full rounded-full ${getRiskBgClass(school.score_de_risco)}`}
            style={{ width: `${scorePercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default SchoolListItem;
