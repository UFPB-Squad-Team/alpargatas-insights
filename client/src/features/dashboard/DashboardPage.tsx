import { useState, useEffect } from 'react';
import KpiCard from './components/cards/KpiCard';
import { School, Building, AlertTriangle, Library, Map } from 'lucide-react';
import HighRiskSchoolsList from './components/cards/HighRiskSchoolsList';
import {
  DashboardKpis,
  getDashboardKPIs,
} from '@/mocks/services/getDashboardKPIs';
import {
  getSchoolsForMap,
  SchoolForMap,
} from '@/mocks/services/getSchoolsForMap';
import MapChart from './components/charts/MapChart';
import Spinner from '@/components/common/Spinner';
import RiskLegend from '@/components/common/RiskLegend';
import { useDashboard } from '@/context/DashboardContext';
import TopDeficienciesChart from './components/charts/TopDeficienciesChart';
import RiskDistributionChart from './components/charts/RiskDistributionChart';
import TopMunicipalitiesChart from './components/charts/TopMunicipalitiesChart';

const DashboardPage = () => {
  const [kpis, setKpis] = useState<DashboardKpis | null>(null);
  const [mapData, setMapData] = useState<SchoolForMap[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { selectedSchoolId, setSelectedSchoolId } = useDashboard();

  useEffect(() => {
    const fetchAllDashboardData = async () => {
      setIsLoading(true);
      try {
        const [kpisData, schoolsData] = await Promise.all([
          getDashboardKPIs(),
          getSchoolsForMap(),
        ]);
        setKpis(kpisData);
        setMapData(schoolsData);
      } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllDashboardData();
  }, []);

  if (isLoading) {
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
              description="Escolas públicas ativas na Paraíba"
            />
            <KpiCard
              title="Escolas em Alto Risco"
              value={kpis.escolasAltoRisco}
              icon={AlertTriangle}
              description="Com score de risco superior a 0.75"
            />
            <KpiCard
              title="Município Destaque"
              value={kpis.municipioMaiorRisco}
              icon={Building}
              description="Com a maior média de risco"
            />
            <KpiCard
              title="Principal Carência"
              value={kpis.principalCarencia}
              icon={Library}
              description="Infraestrutura mais ausente"
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
