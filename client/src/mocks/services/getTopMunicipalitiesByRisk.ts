import { mockSchools } from '../data/school.mock';

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export interface MunicipalityRisk {
  municipio_nome: string;
  risco_medio: number;
}

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const gerarMockTopMunicipios = (): MunicipalityRisk[] => {
  const municipiosMap = new Map<
    string,
    { totalScore: number; count: number }
  >();

  mockSchools.forEach((school) => {
    const data = municipiosMap.get(school.municipio_nome) || {
      totalScore: 0,
      count: 0,
    };
    data.totalScore += school.score_de_risco;
    data.count++;
    municipiosMap.set(school.municipio_nome, data);
  });

  const municipiosComMedia = Array.from(municipiosMap.entries()).map(
    ([nome, data]) => ({
      municipio_nome: nome,
      risco_medio: data.totalScore / data.count,
    }),
  );

  return municipiosComMedia
    .sort((a, b) => b.risco_medio - a.risco_medio)
    .slice(0, 5);
};

export const getTopMunicipalitiesByRisk = async (): Promise<
  MunicipalityRisk[]
> => {
  console.log(`Buscando top municípios por risco... Mocks: ${USE_MOCKS}`);

  if (USE_MOCKS) {
    await delay(400);
    return gerarMockTopMunicipios();
  }

  // const response = await fetch(`${API_BASE_URL}/dashboard/top-municipalities-by-risk`);
  // if (!response.ok) throw new Error('Falha ao buscar top municípios');
  // return response.json();
  return [];
};
