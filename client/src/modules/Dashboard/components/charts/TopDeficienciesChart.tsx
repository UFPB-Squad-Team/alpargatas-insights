import { ResponsiveContainer, Treemap, Tooltip } from 'recharts';
import { SquareChartGantt } from 'lucide-react';
import Spinner from '@/ui/components/common/Spinner';
import { getTopDeficienciesUseCase } from '../../services/logic/School/getTopDeficienciesUseCase';
import { useQuery } from '@tanstack/react-query';
import InfoPopover from '@/ui/components/common/InfoPopover';
import { explanations } from '@/shared/config/explanations.config';

const CustomizedContent = (props: any) => {
  const { x, y, width, height, index, name, value } = props;

  const color = ['#7C2D12', '#F97316', '#963B14', '#FDBA74', '#B45309'][
    index % 5
  ];

  const minWidth = 50;
  const minHeight = 40;
  const rectWidth = Math.max(width, minWidth);
  const rectHeight = Math.max(height, minHeight);

  const fontSize = Math.max(
    10,
    Math.min(18, Math.min(rectWidth, rectHeight) / 5),
  );

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={rectWidth}
        height={rectHeight}
        style={{
          fill: color,
          stroke: '#fff',
          strokeWidth: 2,
        }}
      />

      <foreignObject
        x={x + 5}
        y={y + 5}
        width={rectWidth - 10}
        height={rectHeight - 10}
      >
        <div
          className="flex flex-col items-center justify-center h-full text-white font-semibold"
          style={{
            fontSize: `${fontSize}px`,
            textAlign: 'center',
            overflow: 'hidden',
          }}
        >
          <p
            className="w-full"
            style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}
          >
            {name}
          </p>
          <p style={{ fontSize: `${Math.max(10, fontSize - 2)}px` }}>
            {value} escolas
          </p>
        </div>
      </foreignObject>
    </g>
  );
};

const TopDeficienciesChart = () => {
  const { data: deficiencies = [], isLoading } = useQuery({
    queryKey: ['top-deficiencies'],
    queryFn: getTopDeficienciesUseCase.execute,
  });

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const aspectRatio = deficiencies.length <= 5 ? 1 : 4 / 3;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-brand-orange-light p-2 rounded-lg">
          <SquareChartGantt className="h-6 w-6 text-brand-orange-dark" />
        </div>
        <h3 className="font-bold text-lg text-brand-text-primary">
          Maiores Deficiências nas Escolas
        </h3>
        <InfoPopover
          title={explanations.CHART_TOP_DEFICIENCIES.title}
          content={explanations.CHART_TOP_DEFICIENCIES.content}
        />
      </div>
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <Treemap
            data={deficiencies}
            dataKey="quantidadeEscolas"
            nameKey="carencia"
            aspectRatio={aspectRatio}
            stroke="#fff"
            content={<CustomizedContent />}
          >
            <Tooltip formatter={(value, name) => [`${value} escolas`, name]} />
          </Treemap>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TopDeficienciesChart;
