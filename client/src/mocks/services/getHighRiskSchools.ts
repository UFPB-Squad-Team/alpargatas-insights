import { SchoolProps } from '@/domain/entities/School';
import { mockSchools } from '../data/school.mock';

export type HighRiskSchool = Pick<
  SchoolProps,
  'escola_id_inep' | 'escola_nome' | 'municipio_nome' | 'score_de_risco'
>;

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const getHighRiskSchools = async (
  limit: number = 5,
): Promise<HighRiskSchool[]> => {
  console.log(
    `Buscando ${limit} escolas de maior risco... Mocks: ${USE_MOCKS}`,
  );

  if (USE_MOCKS) {
    await delay(500);

    const sortedSchools = [...mockSchools].sort(
      (a, b) => b.score_de_risco - a.score_de_risco,
    );

    const topSchools = sortedSchools.slice(0, limit).map((school) => ({
      escola_id_inep: school.escola_id_inep,
      escola_nome: school.escola_nome,
      municipio_nome: school.municipio_nome,
      score_de_risco: school.score_de_risco,
    }));

    return topSchools;
  }

  const response = await fetch(
    `${API_BASE_URL}/dashboard/high-risk-schools?limit=${limit}`,
  );
  if (!response.ok) throw new Error('Falha ao buscar escolas de alto risco');
  return response.json();
};
