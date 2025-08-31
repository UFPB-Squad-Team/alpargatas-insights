import KpiCard from './components/cards/KpiCard';
import {
  School,
  Building,
  AlertTriangle,
  Map,
  Target,
  Layers,
  Lightbulb,
  ShieldAlert,
  TrendingDown,
  FileSearch,
} from 'lucide-react';
import HighRiskSchoolsList from './components/cards/HighRiskSchoolsList';
import MapChart from './components/charts/MapChart';
import { useDashboard } from '@/ui/context/DashboardContext';
import TopDeficienciesChart from './components/charts/TopDeficienciesChart';
import RiskDistributionChart from './components/charts/RiskDistributionChart';
import TopMunicipalitiesChart from './components/charts/TopMunicipalitiesChart';
import RiskLegend from '@/ui/components/common/RiskLegend';
import Spinner from '@/ui/components/common/Spinner';
import { listSchoolsForMapUseCase } from './services/logic/School/listSchoolsForMapUseCase';
import { useQuery } from '@tanstack/react-query';
import { getDashboardKPIsUseCase } from './services/logic/getDashboardKPIsUseCase';
import DashboardFilters from './components/custom/DashboardFilters';
import { explanations } from '@/shared/config/explanations.config';
import InfoPopover from '@/ui/components/common/InfoPopover';
import MunicipalitiesByRiskCountChart from './components/charts/MunicipalitiesByRiskCountChart';

const DashboardPage = () => {
  const { data: kpis, isLoading: isLoadingKpis } = useQuery({
    queryKey: ['dashboard-kpis'],
    queryFn: getDashboardKPIsUseCase.execute,
  });

  const { data: mapData = [], isLoading: isLoadingMap } = useQuery({
    queryKey: ['schools-for-map'],
    queryFn: () => listSchoolsForMapUseCase.execute(),
  });

  const { selectedSchoolId, setSelectedSchoolId } = useDashboard();

  const isLoading = isLoadingKpis || isLoadingMap;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardFilters />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis && (
          <>
            <KpiCard
              title="Total de Escolas"
              value={kpis.totalEscolas}
              icon={School}
              icon_secondary={Layers}
              description="Escolas públicas ativas na Paraíba"
              info={explanations.KPI_TOTAL_ESCOLAS}
            />
            <KpiCard
              title="Escolas em Alto Risco"
              value={kpis.escolasAltoRisco}
              icon={AlertTriangle}
              icon_secondary={ShieldAlert}
              description="Com score de infraestrutura superior a 0.75"
              info={explanations.KPI_ESCOLAS_ALTO_RISCO}
            />
            <KpiCard
              title="Município em Alerta"
              value={kpis.municipioMaiorRisco}
              icon={Building}
              icon_secondary={TrendingDown}
              description="Com a maior média de risco de infraestrutura"
              info={explanations.KPI_MUNICIPIO_MAIOR_RISCO}
            />
            <KpiCard
              title="Desafio Socioeconômico"
              value={kpis.municipioOportunidade}
              icon={Target}
              icon_secondary={Lightbulb}
              description="Município com maior desafio socioeconômico (INSE)"
              info={explanations.KPI_DESAFIO_SOCIOECONOMICO}
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-brand-orange-light p-2 rounded-lg">
                <Map className="h-6 w-6 text-brand-orange-dark" />
              </div>
              <h3 className="font-bold text-lg text-brand-text-primary">
                Mapa de Riscos das Escolas na Paraíba
              </h3>
              <InfoPopover
                title={explanations.CHART_MAP_RISK.title}
                content={explanations.CHART_MAP_RISK.content}
              />
            </div>
            <MapChart schools={mapData} selectedSchoolId={selectedSchoolId} />
            <RiskLegend />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-96">
              <RiskDistributionChart />
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-96">
              <div className="h-full flex items-start justify-start text-gray-300">
                <MunicipalitiesByRiskCountChart />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-96 lg:h-[450px]">
            <TopDeficienciesChart />
          </div>
        </div>

        <div className="lg:col-span-1 flex flex-col gap-6">
          <HighRiskSchoolsList
            onSelectSchool={(school) =>
              setSelectedSchoolId(school.escola_id_inep)
            }
          />
          <TopMunicipalitiesChart />

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-80 flex flex-col">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-gray-100 p-2 rounded-lg">
                <FileSearch className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="font-bold text-lg text-gray-400">
                Análise Detalhada
              </h3>
            </div>
            <div className="flex-1 h-full flex flex-col items-center justify-center text-center text-gray-400 border-2 border-dashed rounded-lg p-4">
              <p className="font-medium">Em Breve</p>
              <p className="text-xs mt-1">
                Clique em um município na lista acima para ver a análise
                detalhada dos fatores de risco.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
