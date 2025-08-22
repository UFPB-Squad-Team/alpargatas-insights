import { SchoolProps } from '@/domain/entities/School';
import { mockSchools } from '../data/school.mock';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export interface DashboardKpis {
  totalEscolas: number;
  escolasAltoRisco: number;
  municipioMaiorRisco: string;
  principalCarencia: string;
}

const gerarMockKPIs = async (): Promise<DashboardKpis> => {
  await delay(300);

  const totalEscolas = mockSchools.length;
  const escolasAltoRisco = mockSchools.filter(
    (school) => school.score_de_risco >= 0.75,
  ).length;

  const municipioMaiorRisco = (() => {
    const riscosPorMunicipio = new Map<string, number[]>();

    for (const escola of mockSchools) {
      const riscos = riscosPorMunicipio.get(escola.municipio_nome) ?? [];
      riscos.push(escola.score_de_risco);
      riscosPorMunicipio.set(escola.municipio_nome, riscos);
    }

    let municipio = '';
    let maiorMedia = -1;

    for (const [nome, riscos] of riscosPorMunicipio.entries()) {
      const media = riscos.reduce((s, r) => s + r, 0) / riscos.length;
      if (media > maiorMedia) {
        maiorMedia = media;
        municipio = nome;
      }
    }

    return municipio;
  })();

  const principalCarencia = (() => {
    type InfraKey = keyof SchoolProps['infraestrutura'];
    const faltas: Record<InfraKey, number> = {
      possui_biblioteca: 0,
      possui_internet: 0,
      possui_agua_potavel: 0,
      possui_saneamento_basico: 0,
      possui_energia_publica: 0,
      possui_quadra_esportes: 0,
      possui_acessibilidade_pcd: 0,
    };

    for (const escola of mockSchools) {
      for (const key in escola.infraestrutura) {
        const typedKey = key as InfraKey;
        if (!escola.infraestrutura[typedKey]) {
          faltas[typedKey]++;
        }
      }
    }

    const [key] = Object.entries(faltas).sort((a, b) => b[1] - a[1])[0];
    return key.replace('possui_', '').replace('_', ' ');
  })();

  return {
    totalEscolas,
    escolasAltoRisco,
    municipioMaiorRisco,
    principalCarencia,
  };
};

export const getDashboardKPIs = async (): Promise<DashboardKpis> => {
  console.log(`Buscando KPIs... Mocks: ${USE_MOCKS}`);

  if (USE_MOCKS) {
    return gerarMockKPIs();
  }

  const response = await fetch(`${API_BASE_URL}/dashboard/kpis`);
  if (!response.ok) throw new Error('Falha ao buscar KPIs do dashboard');
  return response.json();
};
