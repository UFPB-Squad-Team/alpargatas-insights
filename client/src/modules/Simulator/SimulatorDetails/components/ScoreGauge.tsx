import {
  RadialBar,
  RadialBarChart,
  Legend,
  ResponsiveContainer,
  PolarAngleAxis,
} from 'recharts';

type ScoreGaugeProps = {
  initialScore: number;
  simulatedScore: number;
};

export const ScoreGauge = ({
  initialScore,
  simulatedScore,
}: ScoreGaugeProps) => {
  const data = [
    { name: 'Score Atual', value: initialScore * 100, fill: '#E5E7EB' }, 
    { name: 'Score Simulado', value: simulatedScore * 100, fill: '#D46419' }, 
  ];

  const reduction = initialScore - simulatedScore;

  return (
    <div className="flex flex-col items-center justify-center text-center h-full">
      <div className="w-full h-48">
        <ResponsiveContainer>
          <RadialBarChart
            innerRadius="70%"
            outerRadius="100%"
            data={data}
            startAngle={180}
            endAngle={0}
            barSize={20}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar background dataKey="value" angleAxisId={0} />
            <Legend
              iconSize={10}
              layout="vertical"
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ fontSize: '12px' }}
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-4xl font-bold text-brand-orange-dark -mt-10">
        {(simulatedScore * 100).toFixed(1)}%
      </p>
      <p className="text-sm text-brand-text-secondary">Score Simulado</p>
      {reduction > 0 && (
        <p className="mt-4 font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full">
          Redução de {(reduction * 100).toFixed(1)}%
        </p>
      )}
    </div>
  );
};
