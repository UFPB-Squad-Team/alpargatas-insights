import { School, SchoolFromApi } from '@/domain/entities/School/SchoolProps';
import { apiClient } from '@/shared/lib/axios';
import {
  mapSchoolForMapFromApiToDomain,
  mapSchoolFromApiToDomain,
} from './mappers/schoolMapper';
import { PaginatedResponse } from '@/domain/entities/PaginatedResponse';
import {
  SchoolForMap,
  SchoolForMapFromApi,
} from '@/domain/entities/School/SchoolForMap';

type RawPaginatedSchoolFromApi = {
  schools: SchoolFromApi[];
  total: number;
  currentPage: number;
};

export type FiltersOptions = {
  municipioIdIbge?: string;
  dependenciaAdm?: string;
  tipoLocalizacao?: string;
};

type ListOrSearchParams = {
  page?: number;
  limit?: number;
  searchTerm?: string;
  municipioIdIbge?: string;
  dependenciaAdm?: string;
  tipoLocalizacao?: string;
};

type SimulateRiskScoreParams = {
  schoolId: string;
  interventions: string[];
};

type SimulateRiskScoreResponse = {
  currentScore: number;
  simulatedScore: number;
  scoreReduction: number;
};

export interface ISchoolRepository {
  search(
    searchTerm: string,
    page?: number,
    limit?: number,
  ): Promise<PaginatedResponse<School>>;
  listOrSearch(params: ListOrSearchParams): Promise<PaginatedResponse<School>>;
  listForMap(filters: FiltersOptions): Promise<SchoolForMap[]>;
  findById(id: string): Promise<School | null>;
  simulateRiskScore(params: SimulateRiskScoreParams): Promise<SimulateRiskScoreResponse>;
}

const listForMap = async (filters: FiltersOptions): Promise<SchoolForMap[]> => {
  try {
    const { data } = await apiClient.get<SchoolForMapFromApi[]>(
      '/api/v1/dashboard/map-data',
      {
        params: {
          municipioIdIbge: filters.municipioIdIbge,
          dependenciaAdm: filters.dependenciaAdm,
          tipoLocalizacao: filters.tipoLocalizacao,
        },
      },
    );

    return data.map(mapSchoolForMapFromApiToDomain);
  } catch (error) {
    console.error('Erro no repositório ao buscar dados para o mapa:', error);
    throw error;
  }
};

const listOrSearch = async (
  params: ListOrSearchParams,
): Promise<PaginatedResponse<School>> => {
  try {
    const apiParams: Record<string, any> = {
      page: params.page,
      limit: params.limit,
      term: params.searchTerm,
      municipioIdIbge: params.municipioIdIbge,
      dependenciaAdm: params.dependenciaAdm,
      tipoLocalizacao: params.tipoLocalizacao,
    };

    Object.keys(apiParams).forEach((key) => {
      if (
        apiParams[key] === undefined ||
        apiParams[key] === null ||
        apiParams[key] === ''
      ) {
        delete apiParams[key];
      }
    });

    const { data: apiResponse } =
      await apiClient.get<RawPaginatedSchoolFromApi>('/api/v1/schools/all', {
        params: apiParams,
      });

    const mappedData = apiResponse.schools.map(mapSchoolFromApiToDomain);

    return {
      data: mappedData,
      total: apiResponse.total,
      page: apiResponse.currentPage,
      limit: params.limit || mappedData.length,
    };
  } catch (error) {
    console.error('Erro no repositório ao buscar escolas:', error);
    throw error;
  }
};

const search = async (
  searchTerm: string,
  page = 1,
  limit = 20,
): Promise<PaginatedResponse<School>> => {
  try {
    const { data } = await apiClient.get<RawPaginatedSchoolFromApi>(
      '/api/v1/schools',
      {
        params: {
          term: searchTerm,
          page,
          limit,
        },
      },
    );

    const schoolsFromApi = data.schools;

    const mappedSchools = schoolsFromApi.map(mapSchoolFromApiToDomain);

    return {
      data: mappedSchools,
      total: data.total,
      page: data.currentPage,
      limit,
    };
  } catch (error) {
    console.error('Erro no repositório ao buscar escolas:', error);
    throw error;
  }
};

const findById = async (id: string): Promise<School | null> => {
  try {
    const { data } = await apiClient.get<SchoolFromApi>(
      `/api/v1/schools/${id}`,
    );
    if (!data) return null;
    return mapSchoolFromApiToDomain(data);
  } catch (error) {
    console.error(`Erro no repositório ao buscar escola com ID ${id}:`, error);
    throw error;
  }
};

const simulateRiskScore = async (
  params: SimulateRiskScoreParams,
): Promise<SimulateRiskScoreResponse> => {
  console.log('Simulando score para a escola:', params.schoolId);
  console.log('Com as seguintes intervenções:', params.interventions);

  const mockResponse: SimulateRiskScoreResponse = {
    currentScore: 0.85, 
    simulatedScore: 0.85 - params.interventions.length * 0.07,
    scoreReduction: params.interventions.length * 0.07,
  };

  await new Promise(resolve => setTimeout(resolve, 1000));

  return mockResponse;
};

export const schoolRepository: ISchoolRepository = {
  search,
  listForMap,
  listOrSearch,
  findById,
  simulateRiskScore
};
