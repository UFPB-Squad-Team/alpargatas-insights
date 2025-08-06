import { School } from 'lucide-react';
import RiskIndicator from '@/components/common/RiskIndicator';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { SchoolForMap } from '@/mocks/services/getSchoolsForMap';

interface CustomPopupProps {
  school: SchoolForMap;
}

const CustomPopup = ({ school }: CustomPopupProps) => {
  return (
    <div className="font-sans w-52 space-y-2 text-sm text-brand-text-primary">
      <p className="font-bold flex items-center gap-1">
        <School className="h-4 w-4 text-brand-orange" />
        {school.escola_nome}
      </p>

      <div className="flex items-center gap-2">
        <RiskIndicator score={school.score_de_risco} />
      </div>

      <Link
        to={`/escolas/${school.escola_id_inep}`}
        className="flex items-center justify-start gap-1 text-brand-orange-contrast hover:text-brand-orange-dark transition-colors font-medium"
      >
        Ver detalhes
        <ArrowUpRight className="h-4 w-4" />
      </Link>
    </div>
  );
};

export default CustomPopup;
