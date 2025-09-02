import { School } from '@/domain/entities/School/SchoolProps';
import {
  BookOpen,
  Droplets,
  Zap,
  Wifi,
  PersonStanding,
  Recycle,
  ShieldCheck,
  ShieldOff,
  LandPlot,
} from 'lucide-react';
import React from 'react';
import InfoPopover from '@/ui/components/common/InfoPopover';
import { explanations } from '@/shared/config/explanations.config';

type InfraXRayProps = {
  infrastructure: School['infraestrutura'];
};

const infraMap = {
  possui_acessibilidade_pcd: {
    label: 'Acessibilidade (PCD)',
    Icon: PersonStanding,
  },
  possui_agua_potavel: { label: 'Água Potável', Icon: Droplets },
  possui_biblioteca: { label: 'Biblioteca/Leitura', Icon: BookOpen },
  possui_energia_publica: { label: 'Energia da Rede Pública', Icon: Zap },
  possui_internet: { label: 'Acesso à Internet', Icon: Wifi },
  possui_quadra_esportes: { label: 'Quadra de Esportes', Icon: LandPlot },
  possui_saneamento_basico: { label: 'Saneamento Básico', Icon: Recycle },
};

const InfraItem = ({
  label,
  Icon,
  hasItem,
}: {
  label: string;
  Icon: React.ElementType;
  hasItem: boolean;
}) => (
  <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-lg border">
    {hasItem ? (
      <ShieldCheck className="h-6 w-6 text-lime-600 flex-shrink-0" />
    ) : (
      <ShieldOff className="h-6 w-6 text-orange-800 flex-shrink-0" />
    )}
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-brand-text-secondary" />
        <span className="font-semibold text-brand-text-primary">{label}</span>
      </div>
      <span
        className={`text-sm ml-6 ${
          hasItem ? 'text-green-700' : 'text-red-700'
        }`}
      >
        {hasItem ? 'Possui' : 'Não Possui'}
      </span>
    </div>
  </div>
);

export const InfrastructureXRay = ({ infrastructure }: InfraXRayProps) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xl font-bold text-brand-text-primary">
          Raio-X da Infraestrutura
        </h2>
        <InfoPopover
          title={explanations.SCHOOL_DETAILS_INFRA_XRAY.title}
          content={explanations.SCHOOL_DETAILS_INFRA_XRAY.content}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.keys(infraMap).map((key) => {
          const itemConfig = infraMap[key as keyof typeof infraMap];
          const hasItem = infrastructure[key] === true;

          return (
            <InfraItem
              key={key}
              label={itemConfig.label}
              Icon={itemConfig.Icon}
              hasItem={hasItem}
            />
          );
        })}
      </div>
    </div>
  );
};
