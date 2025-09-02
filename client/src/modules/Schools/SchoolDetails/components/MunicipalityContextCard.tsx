import { Button } from '@/ui/components/common/button';
import { Map } from 'lucide-react';
import { Link } from 'react-router-dom';

type MunicipalityContextCardProps = {
  municipalityName: string;
  municipalityId: number;
};

export const MunicipalityContextCard = ({
  municipalityName,
  municipalityId,
}: MunicipalityContextCardProps) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 text-center">
      <h2 className="text-xl font-bold text-brand-text-primary mb-2">
        Análise do Município
      </h2>
      <p className="text-brand-text-secondary max-w-2xl mx-auto">
        Esta escola está localizada em <span className='text-brand-orange-dark font-bold'>{municipalityName}</span>. Para
        uma análise aprofundada com todas as estatísticas e escolas da região,
        visite a página dedicada ao município.
      </p>
      <Button asChild className="mt-4 bg-brand-orange-dark hover:bg-brand-orange-contrast">
        <Link to={`/municipios/${municipalityId}`}>
          <Map className="mr-2 h-4 w-4" />
          Ver Análise de {municipalityName}
        </Link>
      </Button>
    </div>
  );
};
