import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/ui/components/common/dialog';
import Spinner from '@/ui/components/common/Spinner';
import { useQuery } from '@tanstack/react-query';
import { getNeedDetailsUseCase } from '../services/needService.ts/logic/getNeedsDetailsUseCase';
import { NeedType, SubmitterType } from '@/domain/entities/Needs/Need';
import {
  HardHat,
  BookOpen,
  User,
  HandHeart,
  Settings,
  Badge,
  UserCircle,
  School,
  Building,
} from 'lucide-react';

type NeedDetailsModalProps = {
  needId: string | null;
  onOpenChange: (isOpen: boolean) => void;
};

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

const DetailItem = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | undefined;
}) => {
  if (!value) return null;

  return (
    <div>
      <p className="text-xs font-semibold text-brand-text-secondary flex items-center gap-1.5">
        <Icon className="h-3 w-3" />
        {label}
      </p>
      <p className="font-medium text-brand-text-primary">{value}</p>
    </div>
  );
};

export const NeedDetailsModal = ({
  needId,
  onOpenChange,
}: NeedDetailsModalProps) => {
  const {
    data: needDetails,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['need-details', needId],
    queryFn: () => getNeedDetailsUseCase.execute(needId!),
    enabled: !!needId,
  });

  return (
    <Dialog open={!!needId} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <Spinner />
          </div>
        )}
        {isError && (
          <div className="text-center text-red-500 py-20">
            <h3 className="font-bold text-lg">Erro ao carregar detalhes</h3>
            <p className="text-sm">
              Não foi possível buscar as informações desta necessidade. Tente
              novamente.
            </p>
          </div>
        )}

        {!isLoading && !isError && needDetails && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  className={`${needTypeMap[needDetails.type]?.className}`}
                >
                  {needTypeMap[needDetails.type]?.label || 'Tipo não definido'}
                </Badge>
              </div>
              <DialogTitle className="text-2xl text-left leading-tight">
                {needDetails.title}
              </DialogTitle>
            </DialogHeader>

            <div className="py-4 space-y-6 max-h-[60vh] overflow-y-auto pr-2">
              <div className="prose prose-sm max-w-none text-brand-text-secondary">
                <p>{needDetails.description}</p>
              </div>

              <div className="border-t pt-4 grid grid-cols-2 gap-x-4 gap-y-6">
                <DetailItem
                  icon={UserCircle}
                  label="Relatado por"
                  value={
                    submitterTypeMap[needDetails.submitterType]?.label ||
                    'Não informado'
                  }
                />
                {needDetails.location && (
                  <DetailItem
                    icon={
                      needDetails.location.type === 'school' ? School : Building
                    }
                    label="Local Vinculado"
                    value={needDetails.location.name}
                  />
                )}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
