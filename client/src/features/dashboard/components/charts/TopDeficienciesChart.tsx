import { useState, useEffect } from 'react';
import { ResponsiveContainer, Treemap, Tooltip } from 'recharts';
import { getTopDeficiencies } from '@/mocks/services/getTopDeficiencies';
import Spinner from '@/components/common/Spinner';
import { SquareChartGantt } from 'lucide-react';

const CustomizedContent = (props: any) => {
  const { x, y, width, height, index, name, escolas_afetadas } = props;
  const color = ['#7C2D12', '#F97316', '#963B14', '#FDBA74', '#B45309'][
    index % 5
  ];

  const fontSize = Math.max(12, Math.min(24, width / 10));

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
        x={x + 10}
        y={y + 10}
        width={width - 20}
        height={height - 20}
      >
        {width > 80 && height > 50 && (
          <div
            className="text-white font-semibold leading-tight flex flex-col justify-center h-full"
            style={{ fontSize: `${fontSize}px` }}
          >
            <p style={{ wordWrap: 'break-word' }}>{name}</p>
            <p
              className="opacity-80 text-sm"
              style={{ fontSize: `${Math.max(12, fontSize * 0.75)}px` }}
            >
              {escolas_afetadas} escolas
            </p>
          </div>
        )}
      </foreignObject>
    </g>
  );
};

const TopDeficienciesChart = () => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getTopDeficiencies();
        const formattedData = result.map((item) => ({
          name: item.carencia,
          size: item.escolas_afetadas, // Usado para o tamanho do retângulo
          escolas_afetadas: item.escolas_afetadas, // Passado para o componente customizado
        }));
        setData(formattedData);
      } catch (error) {
        console.error('Erro ao buscar principais carências:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

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
            data={data}
            dataKey="size"
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
