import { SchoolProps } from '@/domain/entities/School';
import { mockSchools } from '../data/school.mock';

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export interface TopDeficiency {
  carencia: string;
  escolas_afetadas: number;
}

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

const generateMockTopDeficiencies = (): TopDeficiency[] => {
  const highRiskSchools = mockSchools.filter(
    (school) => school.score_de_risco >= 0.75,
  );

  type InfraKey = keyof SchoolProps['infraestrutura'];
  const deficiencyMap: Record<InfraKey, number> = {
    possui_biblioteca: 0,
    possui_internet: 0,
    possui_agua_potavel: 0,
    possui_saneamento_basico: 0,
    possui_energia_publica: 0,
    possui_quadra_esportes: 0,
    possui_acessibilidade_pcd: 0,
  };

  highRiskSchools.forEach((school) => {
    for (const key in school.infraestrutura) {
      const typedKey = key as InfraKey;
      if (!school.infraestrutura[typedKey]) {
        deficiencyMap[typedKey]++;
      }
    }
  });

  const deficiencyNames: Record<InfraKey, string> = {
    possui_biblioteca: 'Falta de Biblioteca',
    possui_internet: 'Falta de Internet',
    possui_agua_potavel: 'Falta de Água Potável',
    possui_saneamento_basico: 'Falta de Saneamento',
    possui_energia_publica: 'Falta de Energia',
    possui_quadra_esportes: 'Falta de Quadra',
    possui_acessibilidade_pcd: 'Falta de Acessibilidade',
  };

  return Object.entries(deficiencyMap)
    .map(([key, value]) => ({
      carencia: deficiencyNames[key as InfraKey],
      escolas_afetadas: value,
    }))
    .sort((a, b) => b.escolas_afetadas - a.escolas_afetadas)
    .slice(0, 5);
};

export const getTopDeficiencies = async (): Promise<TopDeficiency[]> => {
  console.log(`Buscando principais carências... Mocks: ${USE_MOCKS}`);

  if (USE_MOCKS) {
    await delay(750);
    return generateMockTopDeficiencies();
  }

  // const response = await fetch(`${API_BASE_URL}/dashboard/top-deficiencies`);
  // if (!response.ok) throw new Error('Falha ao buscar principais carências');
  // return response.json();
  return []; // Fallback para quando não for mock
};
