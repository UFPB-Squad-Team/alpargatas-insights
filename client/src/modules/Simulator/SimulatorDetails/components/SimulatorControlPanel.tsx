import { School } from '@/domain/entities/School/SchoolProps';
import { Label } from '@/ui/components/common/label';
import { Switch } from '@/ui/components/common/switch';
import {
  Atom,
  BookOpen,
  CheckCircle2,
  Computer,
  LandPlot,
  Recycle,
  Wifi,
} from 'lucide-react';

const infraMap = {
  possui_biblioteca: { label: 'Biblioteca/Leitura', Icon: BookOpen },
  possui_internet_para_alunos: { label: 'Internet para Alunos', Icon: Wifi },
  possui_laboratorio_ciencias: {
    label: 'Laboratório de Ciências',
    Icon: Atom,
  },
  possui_laboratorio_informatica: {
    label: 'Laboratório de Informática',
    Icon: Computer,
  },
  possui_quadra_esportes: { label: 'Quadra de Esportes', Icon: LandPlot },
  possui_saneamento_basico: { label: 'Saneamento Básico', Icon: Recycle },
};

type SimulatorControlPanelProps = {
  schoolInfra: School['infraestrutura'];
  selectedInterventions: string[];
  onInterventionChange: (interventionKey: string, isSelected: boolean) => void;
};

export const SimulatorControlPanel = ({
  schoolInfra,
  selectedInterventions,
  onInterventionChange,
}: SimulatorControlPanelProps) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border h-full">
      <h2 className="text-xl font-bold text-brand-text-primary mb-4 border-b pb-2">
        Painel de Intervenções
      </h2>
      <div className="space-y-4">
        {Object.keys(infraMap).map((key) => {
          const hasFeature = schoolInfra[key] === true;
          const config = infraMap[key as keyof typeof infraMap];

          return (
            <div
              key={key}
              className={`flex items-center justify-between p-3 rounded-lg ${
                hasFeature
                  ? 'bg-gray-100 opacity-60 cursor-not-allowed'
                  : 'hover:bg-gray-50'
              }`}
            >
              <Label
                htmlFor={key}
                className="font-semibold text-brand-text-primary flex items-center gap-3"
              >
                <config.Icon className="h-5 w-5 text-brand-orange-dark" />
                {config.label}
              </Label>
              {hasFeature ? (
                <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Já Possui</span>
                </div>
              ) : (
                <Switch
                  id={key}
                  checked={selectedInterventions.includes(key)}
                  onCheckedChange={(isChecked) =>
                    onInterventionChange(key, isChecked)
                  }
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
