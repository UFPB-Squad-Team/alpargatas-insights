import { mockSchools } from '../data/school.mock';

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export interface RiskDistribution {
  faixa: 'Alerta Máximo' | 'Alto Risco' | 'Risco Moderado' | 'Baixo Risco';
  quantidade: number;
  cor: string;
}

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const generateRiskDistributionRisk = (): RiskDistribution[] => {
  const distribuicao = {
    'Alerta Máximo': { faixa: 'Alerta Máximo', quantidade: 0, cor: '#7C2D12' },
    'Alto Risco': { faixa: 'Alto Risco', quantidade: 0, cor: '#B45309' },
    'Risco Moderado': {
      faixa: 'Risco Moderado',
      quantidade: 0,
      cor: '#F97316',
    },
    'Baixo Risco': { faixa: 'Baixo Risco', quantidade: 0, cor: '#FDBA74' },
  };

  mockSchools.forEach((school) => {
    if (school.score_de_risco >= 0.9) {
      distribuicao['Alerta Máximo'].quantidade++;
    } else if (school.score_de_risco >= 0.75) {
      distribuicao['Alto Risco'].quantidade++;
    } else if (school.score_de_risco >= 0.4) {
      distribuicao['Risco Moderado'].quantidade++;
    } else {
      distribuicao['Baixo Risco'].quantidade++;
    }
  });
  return Object.values(distribuicao) as RiskDistribution[];
};

export const getRiskDistribution = async (): Promise<RiskDistribution[]> => {
  console.log(`Buscando distribuição de risco... Mocks: ${USE_MOCKS}`);

  if (USE_MOCKS) {
    await delay(600);
    return generateRiskDistributionRisk();
  }

  // const response = await fetch(`${API_BASE_URL}/dashboard/risk-distribution`);
  // if (!response.ok) throw new Error('Falha ao buscar distribuição de risco');
  // return response.json();
  return [];
};
