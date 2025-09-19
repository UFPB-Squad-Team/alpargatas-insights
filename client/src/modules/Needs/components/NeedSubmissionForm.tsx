
import { useState } from 'react';
import { Button } from '@/ui/components/common/button';
import { Input } from '@/ui/components/common/input';
import { Label } from '@/ui/components/common/label';
import { RadioGroup, RadioGroupItem } from '@/ui/components/common/radio-group';
import { Textarea } from '@/ui/components/common/textarea';
import { Loader2 } from 'lucide-react';
import { NeedType, SubmitterType } from '@/domain/entities/Needs/Need';

// Os dados para os RadioGroups
const needTypeOptions = [
  { value: NeedType.INFRASTRUCTURE, label: 'Infraestrutura' },
  { value: NeedType.MATERIAL, label: 'Material Didático' },
  { value: NeedType.HUMAN_RESOURCES, label: 'Recursos Humanos' },
  { value: NeedType.SOCIAL_ASSISTANCE, label: 'Apoio Social' },
];

const submitterTypeOptions = [
  { value: SubmitterType.STUDENT, label: 'Estudante' },
  { value: SubmitterType.TEACHER, label: 'Educador(a)' },
  { value: SubmitterType.MANAGER, label: 'Gestor(a)' },
  { value: SubmitterType.COMMUNITY, label: 'Comunidade/ONG' },
];

interface FormData {
  title: string;
  description: string;
  type: NeedType;
  submitterType: SubmitterType;
}

interface NeedSubmissionFormProps {
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
}

export const NeedSubmissionForm = ({
  onSubmit,
  isLoading,
}: NeedSubmissionFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    type: NeedType.INFRASTRUCTURE,
    submitterType: SubmitterType.COMMUNITY,
  });

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      formData.title.trim().length >= 5 &&
      formData.description.trim().length >= 20
    ) {
      onSubmit(formData);
    }
  };

  const isSubmitDisabled =
    formData.title.trim().length < 5 ||
    formData.description.trim().length < 20 ||
    isLoading;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pt-2">
      <div className="space-y-1">
        <Label htmlFor="need-title">Título da Necessidade</Label>
        <Input
          id="need-title"
          placeholder="Ex: Reforma da Quadra de Esportes"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="need-description">Descrição Detalhada</Label>
        <Textarea
          id="need-description"
          placeholder="Descreva a necessidade com o máximo de detalhes possível..."
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={5}
        />
      </div>

      {/* Campo "Tipo de Necessidade" com RadioGroup */}
      <div className="space-y-2">
        <Label>Qual o tipo da necessidade?</Label>
        <RadioGroup
          value={formData.type}
          onValueChange={(value) => handleChange('type', value)}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {needTypeOptions.map((opt) => (
            <div key={opt.value} className="flex items-center space-x-2">
              <RadioGroupItem value={opt.value} id={`type-${opt.value}`} />
              <Label htmlFor={`type-${opt.value}`}>{opt.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Campo "Eu sou..." com RadioGroup */}
      <div className="space-y-2">
        <Label>Eu sou...</Label>
        <RadioGroup
          value={formData.submitterType}
          onValueChange={(value) => handleChange('submitterType', value)}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {submitterTypeOptions.map((opt) => (
            <div key={opt.value} className="flex items-center space-x-2">
              <RadioGroupItem value={opt.value} id={`submitter-${opt.value}`} />
              <Label htmlFor={`submitter-${opt.value}`}>{opt.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          disabled={isSubmitDisabled}
          className="bg-brand-orange-dark hover:bg-brand-orange-contrast"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Enviar para Análise
        </Button>
      </div>
    </form>
  );
};
