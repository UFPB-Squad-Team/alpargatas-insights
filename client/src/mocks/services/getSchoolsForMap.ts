import { SchoolProps } from '@/domain/entities/School';
import { mockSchools } from '../data/school.mock';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export type SchoolForMap = Pick<
  SchoolProps,
  'escola_id_inep' | 'escola_nome' | 'localizacao' | 'score_de_risco'
>;

export const getSchoolsForMap = async (): Promise<SchoolForMap[]> => {
  console.log(`Buscando dados para o mapa... Mocks: ${USE_MOCKS}`);

  if (USE_MOCKS) {
    await delay(800);

    const mapData = mockSchools.map((school) => ({
      escola_id_inep: school.escola_id_inep,
      escola_nome: school.escola_nome,
      localizacao: school.localizacao,
      score_de_risco: school.score_de_risco,
    }));
    return mapData;
  }

  const response = await fetch(`${API_BASE_URL}/dashboard/map-data`);
  if (!response.ok) throw new Error('Falha ao buscar dados para o mapa');
  return response.json();
};
