import { useState } from 'react';
import { InterventionCard } from './InterventionCard';
import { BookOpen, Wifi, Recycle } from 'lucide-react'; 

const interventions = [
  {
    key: 'possui_biblioteca',
    title: 'Construir Biblioteca',
    description:
      'Encontre escolas onde uma nova biblioteca geraria o maior impacto.',
    Icon: BookOpen,
  },
  {
    key: 'possui_internet_para_alunos',
    title: 'Internet para Alunos',
    description:
      'Identifique escolas que mais se beneficiariam de acesso à internet para estudantes.',
    Icon: Wifi,
  },
  {
    key: 'possui_saneamento_basico',
    title: 'Saneamento Básico',
    description:
      'Veja o ranking de impacto para a implementação de saneamento básico.',
    Icon: Recycle,
  },
];

export const SimulatorStrategicPlanner = () => {
  const [selectedIntervention, setSelectedIntervention] = useState<
    string | null
  >(null);

  return (
    <div className="space-y-8">
      {/* Seção 1: Seleção da Intervenção */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border">
        <h2 className="text-xl font-bold text-brand-text-primary">
          1. Selecione uma Intervenção Estratégica
        </h2>
        <p className="text-brand-text-secondary mt-1 mb-4">
          Escolha um tipo de investimento para ver o ranking de escolas com
          maior potencial de impacto.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {interventions.map((item) => (
            <InterventionCard
              key={item.key}
              title={item.title}
              description={item.description}
              icon={item.Icon}
              isSelected={selectedIntervention === item.key}
              onClick={() => setSelectedIntervention(item.key)}
            />
          ))}
        </div>
      </div>

      {/* Seção 2: Resultados (Aparece quando uma intervenção é selecionada) */}
      {selectedIntervention && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border animate-in fade-in duration-500">
          <h2 className="text-xl font-bold text-brand-text-primary mb-4">
            2. Ranking de Impacto
          </h2>
          <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <p className="text-brand-text-secondary">
              (Aqui entrarão o mapa e a tabela com o ranking das escolas)
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
