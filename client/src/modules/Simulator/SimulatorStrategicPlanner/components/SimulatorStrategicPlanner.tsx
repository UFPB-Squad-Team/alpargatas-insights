import { useState } from 'react';
import { InterventionCard } from './InterventionCard';
import { ArrowDown, BookOpen, LandPlot, Wifi } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { School } from '@/domain/entities/School/SchoolProps';
import { SchoolsTable } from '@/modules/Schools/components/SchoolTables';

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
    key: 'possui_quadra_esporte',
    title: 'Esporte para Todos',
    description:
      'Veja o ranking de impacto para a implementação de projetos que envolvem esportes nas escolas ou região.',
    Icon: LandPlot,
  },
];

const mockRankedSchools: (School & {
  simulatedScore: number;
  scoreReduction: number;
})[] = [
  {
    id: '1',
    nome: 'EMEF SITIO LOGRADOURO',
    municipio: 'Gurinhém',
    scoreDeRisco: 0.92,
    simulatedScore: 0.78,
    scoreReduction: 0.14,
    inep: 1,
    dependenciaAdm: 'Municipal',
    localizacaoTipo: 'Rural',
    totalAlunos: 50,
    ...({} as any),
  },
  {
    id: '2',
    nome: 'ESC MUL PEDRO BANDEIRA',
    municipio: 'Conceição',
    scoreDeRisco: 0.88,
    simulatedScore: 0.75,
    scoreReduction: 0.13,
    inep: 2,
    dependenciaAdm: 'Municipal',
    localizacaoTipo: 'Rural',
    totalAlunos: 80,
    ...({} as any),
  },
  {
    id: '3',
    nome: 'EMEIF ANNA ELISA SOBREIRA',
    municipio: 'Alagoa Grande',
    scoreDeRisco: 0.85,
    simulatedScore: 0.73,
    scoreReduction: 0.12,
    inep: 3,
    dependenciaAdm: 'Municipal',
    localizacaoTipo: 'Urbana',
    totalAlunos: 120,
    ...({} as any),
  },
  {
    id: '4',
    nome: 'GRUPO ESCOLAR MANOEL LUIZ',
    municipio: 'Serra Branca',
    scoreDeRisco: 0.82,
    simulatedScore: 0.71,
    scoreReduction: 0.11,
    inep: 4,
    dependenciaAdm: 'Estadual',
    localizacaoTipo: 'Urbana',
    totalAlunos: 200,
    ...({} as any),
  },
  {
    id: '5',
    nome: 'EMEF JOSE ANTONIO MOREIRA',
    municipio: 'Bom Jesus',
    scoreDeRisco: 0.8,
    simulatedScore: 0.7,
    scoreReduction: 0.1,
    inep: 5,
    dependenciaAdm: 'Municipal',
    localizacaoTipo: 'Rural',
    totalAlunos: 35,
    ...({} as any),
  },
];

const rankingColumns: ColumnDef<
  School & { simulatedScore: number; scoreReduction: number }
>[] = [
  { accessorKey: 'nome', header: 'Escola' },
  { accessorKey: 'municipio', header: 'Município' },
  {
    accessorKey: 'scoreDeRisco',
    header: 'Score Atual',
    cell: (info) => `${((info.getValue() as number) * 100).toFixed(0)}%`,
  },
  {
    accessorKey: 'simulatedScore',
    header: 'Score Simulado',
    cell: (info) => `${((info.getValue() as number) * 100).toFixed(0)}%`,
  },
  {
    accessorKey: 'scoreReduction',
    header: 'Redução de Risco',
    cell: (info) => (
      <div className="flex items-center gap-1 font-bold text-green-600">
        <ArrowDown className="h-4 w-4" />
        <span>{((info.getValue() as number) * 100).toFixed(1)}%</span>
      </div>
    ),
  },
];

export const SimulatorStrategicPlanner = () => {
  const [selectedIntervention, setSelectedIntervention] = useState<
    string | null
  >(null);

  return (
    <div className="space-y-8">
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

      {selectedIntervention && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border animate-in fade-in duration-500">
          <h2 className="text-xl font-bold text-brand-text-primary mb-4">
            2. Ranking de Impacto para:{' '}
            <span className="text-brand-orange-dark">
              {interventions.find((i) => i.key === selectedIntervention)?.title}
            </span>
          </h2>
          <SchoolsTable data={mockRankedSchools} columns={rankingColumns} />
        </div>
      )}
    </div>
  );
};
