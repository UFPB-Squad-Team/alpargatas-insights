import { useState, useEffect } from 'react';
import KpiCard from './components/KpiCard';
import {
  School,
  Building,
  AlertTriangle,
  Library,
  Radical,
  ArrowBigUpDash,
} from 'lucide-react';
import HighRiskSchoolsList from './components/HighRiskSchoolsList';
// import { getSchoolsForMap, SchoolForMap } from '@/services/apiService';
// import MapChart from './components/MapChart';
import PartnerNeedsCard from './components/PartneerNeedsCard';
import {
  DashboardKpis,
  getDashboardKPIs,
} from '@/mocks/services/getDashboardKPIs';

const DashboardPage = () => {
  const [kpis, setKpis] = useState<DashboardKpis | null>(null);
  // const [mapData, setMapData] = useState<SchoolForMap[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllDashboardData = async () => {
      try {
        const [kpisData] = await Promise.all([getDashboardKPIs()]);
        setKpis(kpisData);
      } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllDashboardData();
  }, []);

  if (isLoading) {
    return <div>Carregando dashboard...</div>; //TODO: Criar um componente de loading mais elaborado
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
              description="Com score de risco superior a 0.75"
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
        {/*COLUNA ESQUERDA (PRINCIPAL)*/}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* 1. O Mapa de Risco */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="font-semibold text-brand-text-primary mb-4">
              Mapa de Risco das Escolas
            </h3>
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

        {/*COLUNA DIREITA (SECUNDÁRIA)*/}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <HighRiskSchoolsList />
          <PartnerNeedsCard />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
