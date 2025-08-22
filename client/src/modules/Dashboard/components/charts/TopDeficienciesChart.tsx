import { ResponsiveContainer, Treemap, Tooltip } from 'recharts';
import { SquareChartGantt } from 'lucide-react';
import Spinner from '@/ui/components/common/Spinner';
import { getTopDeficienciesUseCase } from '../../services/logic/School/getTopDeficienciesUseCase';
import { useQuery } from '@tanstack/react-query';

const CustomizedContent = (props: any) => {
  const { x, y, width, height, index, name, value } = props;

  const color = ['#7C2D12', '#F97316', '#963B14', '#FDBA74', '#B45309'][
    index % 5
  ];
  const fontSize = Math.max(10, Math.min(18, width / 8));

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: color,
          stroke: '#fff',
          strokeWidth: 2,
        }}
      />

      <foreignObject
        x={x + 5}
        y={y + 5}
        width={width - 10}
        height={height - 10}
      >
        <div
          className="flex flex-col items-center justify-center h-full text-white font-semibold"
          style={{
            fontSize: `${fontSize}px`,
            textAlign: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Nome da carência */}
          {width > 40 && height > 30 && (
            <p
              className="truncate w-full"
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {name}
            </p>
          )}

          {/* Sempre renderiza o número de escolas */}
          <p className="opacity-80 text-xs">{value} escolas</p>
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

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-brand-orange-light p-2 rounded-lg">
          <SquareChartGantt className="h-6 w-6 text-brand-orange-dark" />
        </div>
        <h3 className="font-bold text-lg text-brand-text-primary">
          Maiores Deficiências nas Escolas
        </h3>
      </div>
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <Treemap
            data={deficiencies}
            dataKey="quantidadeEscolas"
            nameKey="carencia"
            aspectRatio={4 / 3}
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
