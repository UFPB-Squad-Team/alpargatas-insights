import { School, SchoolFromApi } from '@/domain/entities/SchoolProps';
import { apiClient } from '@/shared/lib/axios';
import { mapSchoolFromApiToDomain } from './mappers/schoolMapper';
import { PaginatedResponse } from '@/domain/entities/PaginatedResponse';

type PaginatedSchoolFromApi = {
  schools: SchoolFromApi[];
  total: number;
  currentPage: number; // o backend retorna currentPage, vamos mapear para page
  // o backend não retorna o limit, mas podemos adicioná-lo se necessário
};

export interface ISchoolRepository {
  search(
    searchTerm: string,
    page?: number,
    limit?: number,
  ): Promise<PaginatedResponse<School>>;
}

const search = async (
  searchTerm: string,
  page = 1,
  limit = 20, // Aumentando o limite para ter mais resultados
): Promise<PaginatedResponse<School>> => {
  try {
    const { data } = await apiClient.get<PaginatedSchoolFromApi>(
      '/api/v1/schools',
      {
        // ===== CORREÇÃO DA IDA (REQUISIÇÃO) =====
        params: {
          term: searchTerm,
          page,
          limit,
        },
      },
    );

    // ===== CORREÇÃO DA VOLTA (RESPOSTA) =====
    // 1. Pegamos o array de dentro da propriedade 'schools'
    const schoolsFromApi = data.schools;

    // 2. Mapeamos os dados brutos para o nosso modelo de domínio limpo
    const mappedSchools = schoolsFromApi.map(mapSchoolFromApiToDomain);

    // 3. Retornamos o objeto de paginação completo com os dados tratados
    return {
      data: mappedSchools,
      total: data.total,
      page: data.currentPage,
      limit, // Retornamos o limite que usamos na busca
    };
  } catch (error) {
    console.error('Erro no repositório ao buscar escolas:', error);
    throw error;
  }
};

export const schoolRepository: ISchoolRepository = {
  search,
};
