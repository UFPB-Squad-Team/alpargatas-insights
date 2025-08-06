import { useState, useEffect } from 'react';
import KpiCard from './components/KpiCard';
import {
  School,
  Building,
  AlertTriangle,
  Library,
  Radical,
  ArrowBigUpDash,
  Map,
} from 'lucide-react';
import HighRiskSchoolsList from './components/HighRiskSchoolsList';
import PartnerNeedsCard from './components/PartneerNeedsCard';
import {
  DashboardKpis,
  getDashboardKPIs,
} from '@/mocks/services/getDashboardKPIs';
import {
  getSchoolsForMap,
  SchoolForMap,
} from '@/mocks/services/getSchoolsForMap';
import MapChart from './components/MapChart';
import Spinner from '@/components/common/Spinner';
import RiskLegend from '@/components/common/RiskLegend';

const DashboardPage = () => {
  const [kpis, setKpis] = useState<DashboardKpis | null>(null);
  const [mapData, setMapData] = useState<SchoolForMap[]>([]);
  const [selectedSchoolId, setSelectedSchoolId] = useState<
    string | null | number
  >(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllDashboardData = async () => {
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
    return <Spinner />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {kpis && (
          <>
            <KpiCard
              title="Total de Escolas"
              value={kpis.totalEscolas}
              icon={School}
              icon_secondary={Radical}
              description="Escolas públicas ativas na Paraíba"
            />
            <KpiCard
              title="Escolas em Alto Risco"
              value={kpis.escolasAltoRisco}
              icon={AlertTriangle}
              icon_secondary={Radical}
              description="Com score de risco superior a 75%."
            />
            <KpiCard
              title="Município Destaque"
              value={kpis.municipioMaiorRisco}
              icon={Building}
              icon_secondary={ArrowBigUpDash}
              description="Com a maior média de risco"
            />
            <KpiCard
              title="Principal Carência"
              value={kpis.principalCarencia}
              icon={Library}
              icon_secondary={ArrowBigUpDash}
              description="Infraestrutura mais ausente"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* COLUNA ESQUERDA (PRINCIPAL) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* 1. O Mapa de Risco */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-brand-orange-light p-2 rounded-lg">
                <Map className="h-6 w-6 text-brand-orange-dark" />
              </div>
              <h3 className="font-bold text-lg text-brand-text-primary">
                Mapa de Riscos das Escolas na Paraíba
              </h3>
            </div>
            {isLoading ? (
              <div className="h-[500px] w-full flex justify-center items-center bg-gray-200 rounded-lg">
                <Spinner />
              </div>
            ) : (
              <MapChart schools={mapData} selectedSchoolId={selectedSchoolId} />
            )}
            <RiskLegend />
          </div>

          {/* Container para os gráficos inferiores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 2. Gráfico de Distribuição de Risco (Placeholder) */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 h-64">
              <h3 className="font-semibold text-brand-text-primary">
                Distribuição de Risco
              </h3>
            </div>
            {/* 3. Gráfico de Principais Carências (Placeholder) */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 h-64">
              <h3 className="font-semibold text-brand-text-primary">
                Principais Carências (Alto Risco)
              </h3>
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA (SECUNDÁRIA) */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <HighRiskSchoolsList
            onSelectSchool={(school) =>
              setSelectedSchoolId(school.escola_id_inep)
            }
          />
          <PartnerNeedsCard />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
