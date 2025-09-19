import { NeedType, SubmitterType, INeed } from '@/domain/entities/Needs/Need';
import { Badge } from '@/ui/components/common/badge';
import { Button } from '@/ui/components/common/button';
import {
  Building,
  HandHeart,
  HardHat,
  School,
  Settings,
  User,
  BookOpen,
} from 'lucide-react';
import React from 'react';

const needTypeMap: Record<
  NeedType,
  { label: string; Icon: React.ElementType; className: string }
> = {
  [NeedType.INFRASTRUCTURE]: {
    label: 'Infraestrutura',
    Icon: HardHat,
    className: 'bg-amber-100 text-amber-800',
  },
  [NeedType.MATERIAL]: {
    label: 'Material Didático',
    Icon: BookOpen,
    className: 'bg-blue-100 text-blue-800',
  },
  [NeedType.HUMAN_RESOURCES]: {
    label: 'Rec. Humanos',
    Icon: User,
    className: 'bg-green-100 text-green-800',
  },
  [NeedType.SOCIAL_ASSISTANCE]: {
    label: 'Apoio Social',
    Icon: HandHeart,
    className: 'bg-pink-100 text-pink-800',
  },
  [NeedType.OTHER]: {
    label: 'Outro',
    Icon: Settings,
    className: 'bg-gray-100 text-gray-800',
  },
};

const submitterTypeMap: Record<SubmitterType, { label: string }> = {
  [SubmitterType.STUDENT]: { label: 'Estudante' },
  [SubmitterType.TEACHER]: { label: 'Educador(a)' },
  [SubmitterType.MANAGER]: { label: 'Gestor(a) Escolar' },
  [SubmitterType.NGO]: { label: 'Organização/ONG' },
  [SubmitterType.COMMUNITY]: { label: 'Comunidade' },
  [SubmitterType.OTHER]: { label: 'Outro' },
};

type NeedCardProps = {
  need: INeed;
  onSelect: (need: INeed) => void;
};

export const NeedCard = ({ need, onSelect }: NeedCardProps) => {
  const typeInfo = needTypeMap[need.type] || needTypeMap.other;
  const submitterInfo =
    submitterTypeMap[need.submitterType] || submitterTypeMap.other;

  const mockSupportCount = (need.id.charCodeAt(5) % 100) + 5; // Gera um número "aleatório" mas consistente

  const handleSupportClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`Apoiando a necessidade: ${need.title}`);
  };
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-between h-full hover:border-brand-orange-light transition-all duration-200">
      <div>
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <Badge
            className={`${typeInfo.className} hover:${typeInfo.className}`}
          >
            <typeInfo.Icon className="h-3 w-3 mr-1.5" />
            {typeInfo.label}
          </Badge>
          <Badge variant="outline">{submitterInfo.label}</Badge>
        </div>
        <h3 className="text-xl font-bold text-brand-text-primary mt-3">
          {need.title}
        </h3>
        <p className="text-brand-text-secondary mt-2 text-sm line-clamp-3 h-[60px]">
          {need.description}
        </p>
      </div>

      <div className="mt-4 pt-4 border-t">
        {need.location && (
          <div className="flex items-center gap-2 text-sm text-brand-text-secondary mb-4">
            {need.location.type === 'school' ? (
              <School className="h-4 w-4" />
            ) : (
              <Building className="h-4 w-4" />
            )}
            <span className="font-semibold">{need.location.name}</span>
          </div>
        )}
        <div className="flex items-center gap-3">
          {' '}
          {/* Aumentamos o gap */}
          <Button onClick={() => onSelect(need)} className="w-full bg-brand-orange-dark hover:bg-brand-orange-contrast">
            Ver Detalhes
          </Button>
          <Button
            variant="outline"
            size="icon" // Transformamos em um botão de ícone
            onClick={handleSupportClick}
            title="Apoiar esta necessidade"
            className="flex-shrink-0" // Impede que o botão encolha
          >
            <HandHeart className="h-4 w-4" />
          </Button>
          {/* Opcional: mostrar o contador de apoios */}
          <span className="text-sm font-bold text-brand-text-secondary w-8 text-center">
            {mockSupportCount}
          </span>
        </div>
      </div>
    </div>
  );
};
