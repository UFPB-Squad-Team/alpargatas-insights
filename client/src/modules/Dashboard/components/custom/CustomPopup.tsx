import { Link } from 'react-router-dom';
import { ArrowUpRight, School } from 'lucide-react';
import { SchoolForMap } from '@/domain/entities/School/SchoolForMap';

interface CustomPopupProps {
  school: SchoolForMap;
}

const getRiskInfo = (score: number) => {
  if (score >= 0.9) return { color: 'text-risk-critical', text: 'Alerta Máximo' };
  if (score >= 0.75) return { color: 'text-risk-high', text: 'Alto Risco' };
  if (score >= 0.4) return { color: 'text-risk-medium', text: 'Risco Moderado' };
  return { color: 'text-risk-low', text: 'Baixo Risco' };
};

const CustomPopup = ({ school }: CustomPopupProps) => {
  const riskInfo = getRiskInfo(school.scoreRiscoContextualizado);
  const scorePercentage = (school.scoreRiscoContextualizado * 100).toFixed(0);

  return (
    <div className="font-sans w-60 space-y-4 text-sm text-brand-primary">
      <div className="flex items-center gap-2">
        <School className="h-5 w-5 text-brand-secondary flex-shrink-0" />
        <p className="font-bold text-base leading-tight">{school.nome}</p>
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <span className={`text-xs font-bold ${riskInfo.color}`}>
            {riskInfo.text}
          </span>
          <span className="text-xs font-semibold text-brand-text-secondary">
            Score: {scorePercentage}%
          </span>
        </div>
        <div className="relative w-full pt-2">
          <div className="flex w-full h-2 rounded-full overflow-hidden">
            <div className="bg-risk-low" style={{ width: '40%' }}></div>
            <div className="bg-risk-medium" style={{ width: '35%' }}></div>
            <div className="bg-risk-high" style={{ width: '15%' }}></div>
            <div className="bg-risk-critical" style={{ width: '10%' }}></div>
          </div>
          <div
            className="absolute top-0 w-0 h-0"
            style={{
              left: `${scorePercentage}%`,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '8px solid #1E3A8A', 
              transform: 'translateX(-50%)',
              transition: 'left 0.3s ease-in-out',
            }}
          ></div>
        </div>
      </div>

      <Link
        to={`/escolas/${school.id}`}
        className="flex items-center justify-center gap-2 bg-brand-accent hover:bg-brand-primary !text-brand-text-primary !text-bold transition-colors py-2 px-4 rounded-lg w-full"
      >
        Ver Detalhes da Escola
        <ArrowUpRight className="h-4 w-4" />
      </Link>
    </div>
  );
};

export default CustomPopup;
