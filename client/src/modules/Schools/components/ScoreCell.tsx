import RiskIndicator from '@/ui/components/common/RiskIndicator';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/ui/components/common/tooltip';

type ScoreCellProps = {
  score: number;
};

export const ScoreCell = ({ score }: ScoreCellProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="cursor-help inline-block">
          <RiskIndicator score={score} />
        </div>
      </TooltipTrigger>
      <TooltipContent side="top" align="start">
        <p className="text-sm font-semibold">
          Score de Risco (Infraestrutura):{' '}
          <span className="font-mono text-brand-orange-dark">
            {score * 100}
          </span>
        </p>
      </TooltipContent>
    </Tooltip>
  );
};
