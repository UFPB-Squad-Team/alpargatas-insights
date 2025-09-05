import { MunicipalityDetails } from '@/domain/entities/Municipality/Municipality';
import RiskIndicator from '@/ui/components/common/RiskIndicator';
import {
  AlertTriangle,
  Globe,
  Landmark,
  School,
  TrendingUp,
} from 'lucide-react';
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

type MunicipalityStatsPanelProps = {
  municipality: MunicipalityDetails;
};

const CompositionChart = ({ title, icon: Icon, data }: any) => (
  <div className="flex flex-col items-center w-full">
    <div className="flex items-center gap-2 mb-2">
      <Icon className="h-4 w-4 text-brand-text-secondary" />
      <h4 className="font-semibold text-brand-text-secondary">{title}</h4>
    </div>
    <div className="w-full h-[140px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="45%"
            outerRadius={40}
            innerRadius={25}
          >
            {data.map((entry: any) => (
              <Cell key={`cell-${entry.name}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value, name) => [value, name]} />
          <Legend
            iconType="circle"
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export const MunicipalityStatsPanel = ({
  municipality,
}: MunicipalityStatsPanelProps) => {
  const locationData = [
    {
      name: 'Urbanas',
      value: municipality.totalEscolasUrbanas,
      color: '#EA580C',
    },
    {
      name: 'Rurais',
      value: municipality.totalEscolasRurais,
      color: '#F97316',
    },
  ];

  const dependencyData = [
    {
      name: 'Municipais',
      value: municipality.totalEscolasMunicipais,
      color: '#FB923C',
    },
    {
      name: 'Estaduais',
      value: municipality.totalEscolasEstaduais,
      color: '#FDBA74',
    },
    {
      name: 'Federais',
      value: municipality.totalEscolasFederais,
      color: '#FED7AA',
    },
  ].filter((item) => item.value > 0);

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 divide-y lg:divide-y-0 lg:divide-x">
        <div className="flex flex-col items-center justify-center text-center p-4">
          <School className="h-8 w-8 text-brand-orange-dark mb-2" />
          <p className="text-5xl lg:text-6xl font-bold text-brand-text-primary">
            {municipality.totalEscolas}
          </p>
          <p className="text-base lg:text-lg text-brand-text-secondary">
            Escolas no Município
          </p>
        </div>

        <div className="space-y-6 p-4 pt-6 lg:pt-4 lg:pl-6 col-span-1 lg:col-span-2">
          <h3 className="text-lg font-bold text-brand-text-primary border-b pb-2">
            Detalhes e Composição
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-brand-text-secondary" />
                <h4 className="font-semibold text-brand-text-secondary">
                  Média de Risco
                </h4>
              </div>
              <p className="text-3xl font-bold text-brand-text-primary">
                {(municipality.riscoMedio * 100).toFixed(0)}%
              </p>
              <div className="mt-1">
                <RiskIndicator score={municipality.riscoMedio} />
              </div>
              <div className="flex items-center gap-2 mt-4 text-sm">
                <AlertTriangle className="h-4 w-4 text-orange-700" />
                <p className="text-brand-text-primary">
                  <strong className="font-bold">
                    {municipality.totalEscolasEmAltoRisco}
                  </strong>{' '}
                  escolas em alto risco
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-around">
              <CompositionChart
                title="Localização"
                icon={Globe}
                data={locationData}
              />
              <CompositionChart
                title="Dependência"
                icon={Landmark}
                data={dependencyData}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
