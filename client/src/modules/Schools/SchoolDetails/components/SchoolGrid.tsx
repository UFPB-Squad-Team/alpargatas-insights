import RiskIndicator from '@/ui/components/common/RiskIndicator';
import { BarChart, TrendingUp, Users } from 'lucide-react';
import React from 'react';
import InfoPopover from '@/ui/components/common/InfoPopover';
import { explanations } from '@/shared/config/explanations.config';

type ScoreGridProps = {
  riskScore: number;
  contextualizedScore: number;
  studentCount: number;
};

type StatCardProps = {
  icon: React.ElementType;
  title: string;
  info: { title: string; content: string };
  children: React.ReactNode;
};

const StatCard = ({ icon: Icon, title, info, children }: StatCardProps) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
    <div className="flex items-center justify-between gap-2 mb-2">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-brand-orange-dark" />
        <h3 className="font-semibold text-brand-orange-contrast">{title}</h3>
      </div>
      <InfoPopover title={info.title} content={info.content} />
    </div>
    <div className="pl-6">{children}</div>
  </div>
);

export const ScoreGrid = ({
  riskScore,
  contextualizedScore,
  studentCount,
}: ScoreGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        icon={TrendingUp}
        title="Score de Risco (Infra.)"
        info={explanations.SCHOOL_DETAILS_RISK_SCORE}
      >
        <p className="text-4xl font-bold text-brand-text-primary">
          {riskScore * 100}%
        </p>
        <div className="mt-1">
          <RiskIndicator score={riskScore} />
        </div>
      </StatCard>

      <StatCard
        icon={BarChart}
        title="Score Contextualizado"
        info={explanations.SCHOOL_DETAILS_CONTEXTUALIZED_SCORE}
      >
        <p className="text-4xl font-bold text-brand-text-primary">
          {contextualizedScore * 100}%
        </p>
        <div className="mt-1">
          <RiskIndicator score={contextualizedScore} />
        </div>
      </StatCard>

      <StatCard
        icon={Users}
        title="Alunos Impactados"
        info={explanations.SCHOOL_DETAILS_STUDENT_COUNT}
      >
        <p className="text-4xl font-bold text-brand-text-primary">
          {studentCount}
        </p>
        <p className="text-sm text-brand-text-secondary mt-1">
          Alunos matriculados
        </p>
      </StatCard>
    </div>
  );
};
