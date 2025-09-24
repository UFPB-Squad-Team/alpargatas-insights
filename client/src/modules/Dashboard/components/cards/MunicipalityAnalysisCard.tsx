import { explanations } from '@/shared/config/explanations.config';
import { getMunicipalityDetailsUseCase } from '@/shared/services/Municipality/logic/getMunicipalityDetailsUseCase';
import { Button } from '@/ui/components/common/button';
import InfoPopover from '@/ui/components/common/InfoPopover';
import Spinner from '@/ui/components/common/Spinner';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Building, Globe, Radar } from 'lucide-react';
import { Link } from 'react-router-dom';

const CompositionBar = ({
  title,
  icon: Icon,
  value1,
  label1,
  value2,
  label2,
}: any) => {
  const total = value1 + value2;
  const percent1 = total > 0 ? (value1 / total) * 100 : 0;
  const percent2 = total > 0 ? (value2 / total) * 100 : 0;

  return (
    <div>
      <p className="text-sm font-semibold text-brand-text-primary mb-2 flex items-center gap-2">
        <Icon className="h-4 w-4" />
        {title}
      </p>
      <div className="w-full bg-gray-200 rounded-full h-2.5 flex overflow-hidden">
        <div
          className="bg-brand-orange-dark h-2.5"
          style={{ width: `${percent1}%` }}
        ></div>
        <div
          className="bg-brand-orange-light h-2.5"
          style={{ width: `${percent2}%` }}
        ></div>
      </div>
      <div className="flex justify-between mt-1 text-xs text-brand-text-secondary">
        <span>
          {value1} {label1}
        </span>
        <span>
          {value2} {label2}
        </span>
      </div>
    </div>
  );
};

const MunicipalAnalysisCard = ({
  municipalityId,
}: {
  municipalityId: string;
}) => {
  const { data: municipality, isLoading } = useQuery({
    queryKey: ['municipality-details-for-dashboard', municipalityId],
    queryFn: () => getMunicipalityDetailsUseCase.execute(municipalityId),
    enabled: !!municipalityId,
  });

  if (isLoading)
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner />
      </div>
    );
  if (!municipality)
    return (
      <div className="h-full flex items-center justify-center">
        Erro ao carregar dados.
      </div>
    );

  return (
    <div className="h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-brand-orange-light p-2 rounded-lg">
            <Radar className="h-6 w-6 text-brand-orange-dark" />
          </div>
          <h3 className="font-bold text-lg text-brand-text-primary">
            Mapa de Riscos das Escolas na Paraíba
          </h3>
          <InfoPopover
            title={explanations.MUNICIPALITY_ANALYSIS_OVERVIEW.title}
            content={explanations.MUNICIPALITY_ANALYSIS_OVERVIEW.content}
          />
        </div>
        <div className="space-y-4 mt-4">
          <CompositionBar
            title="Composição por Localização"
            icon={Globe}
            value1={municipality.totalEscolasUrbanas}
            label1="Urbanas"
            value2={municipality.totalEscolasRurais}
            label2="Rurais"
          />
          <CompositionBar
            title="Composição por Dependência"
            icon={Building}
            value1={municipality.totalEscolasMunicipais}
            label1="Municipais"
            value2={municipality.totalEscolasEstaduais}
            label2="Estaduais"
          />
        </div>
      </div>
      <Button asChild className="mt-4 w-full bg-brand-orange-dark hover:bg-brand-orange-contrast">
        <Link to={`/dashboard/municipios/${municipalityId}`}>
          Ver Análise Completa <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
};

export default MunicipalAnalysisCard;
