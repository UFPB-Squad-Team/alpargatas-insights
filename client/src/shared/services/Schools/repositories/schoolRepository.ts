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

type PaginatedSchoolFromApi = {
  schools: SchoolFromApi[];
  total: number;
  currentPage: number;
};

export interface ISchoolRepository {
  search(
    searchTerm: string,
    page?: number,
    limit?: number,
  ): Promise<PaginatedResponse<School>>;
  listAll(): Promise<School[]>;
  listForMap(): Promise<SchoolForMap[]>;
}

const listForMap = async (): Promise<SchoolForMap[]> => {
  try {
    const { data } = await apiClient.get<SchoolForMapFromApi[]>(
      '/api/v1/dashboard/map-data',
    );

    return data.map(mapSchoolForMapFromApiToDomain);
  } catch (error) {
    console.error('Erro no repositório ao buscar dados para o mapa:', error);
    throw error;
    // TODO: Implements new errors for this repository
  }
};

const listAll = async (): Promise<School[]> => {
  try {
    const { data } = await apiClient.get<any>('/api/v1/schools/all');

    const schoolsFromApi = Array.isArray(data?.schools) ? data.schools : data;

    if (Array.isArray(schoolsFromApi)) {
      return schoolsFromApi.map(mapSchoolFromApiToDomain);
    }

    return [];
  } catch (error) {
    console.error('Erro no repositório ao buscar todas as escolas:', error);
    throw error;
  }
};

const search = async (
  searchTerm: string,
  page = 1,
  limit = 20,
): Promise<PaginatedResponse<School>> => {
  try {
    const { data } = await apiClient.get<PaginatedSchoolFromApi>(
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

export const schoolRepository: ISchoolRepository = {
  search,
  listForMap,
  listAll,
};
