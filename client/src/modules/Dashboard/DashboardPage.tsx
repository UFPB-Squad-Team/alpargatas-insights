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
  Medal,
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

  if (isLoadingKpis || isLoadingMap) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis && (
          <>
            <KpiCard
              title="Total de Escolas"
              value={kpis.totalEscolas}
              icon={School}
              icon_secondary={Layers}
              description="Escolas públicas ativas na Paraíba"
            />
            <KpiCard
              title="Escolas em Alto Risco"
              value={kpis.escolasAltoRisco}
              icon={AlertTriangle}
              icon_secondary={ShieldAlert}
              description="Com score contextualizado superior a 75"
            />
            <KpiCard
              title="Município Destaque"
              value={kpis.municipioMaiorRisco}
              icon={Building}
              icon_secondary={Medal}
              description="Com a maior média de risco contextualizado"
            />
            <KpiCard
              title="Município de Oportunidade"
              value={kpis.municipioOportunidade}
              icon={Target}
              icon_secondary={Lightbulb}
              description="Maior risco com menor nº de projetos do IA"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-brand-primary p-2 rounded-lg">
                <Map className="h-6 w-6 text-brand-accent" />
              </div>
              <h3 className="font-bold text-lg text-brand-primary">
                Mapa de Riscos das Escolas na Paraíba
              </h3>
            </div>
            <MapChart schools={mapData} selectedSchoolId={selectedSchoolId} />
            <RiskLegend />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-96">
              <RiskDistributionChart />
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-96">
              <TopDeficienciesChart />
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 flex flex-col gap-6">
          <HighRiskSchoolsList
            onSelectSchool={(school) =>
              setSelectedSchoolId(school.escola_id_inep)
            }
          />
          <TopMunicipalitiesChart />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
