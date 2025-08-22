import { SchoolProps } from '@/domain/entities/School';
import { mockSchools } from '@/mocks/data/school.mock';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const searchSchools = async (
  searchTerm: string,
): Promise<SchoolProps[]> => {
  console.log(`Buscando por "${searchTerm}"... Mocks: ${USE_MOCKS}`);

  if (USE_MOCKS) {
    await delay(300);
    if (!searchTerm) {
      return [];
    }
    const filteredSchools = mockSchools.filter(
      (school: SchoolProps) =>
        school.escola_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.municipio_nome.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    return filteredSchools;
  }

  const response = await fetch(`${API_BASE_URL}/schools?search=${searchTerm}`);
  if (!response.ok) throw new Error('Falha ao buscar escolas');
  return response.json();
};
