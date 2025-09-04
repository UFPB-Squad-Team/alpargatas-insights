import { PaginatedResponse } from '@/domain/entities/PaginatedResponse';
import {
  MunicipalityDetails,
  MunicipalityDetailsFromApi,
  MunicipalityForFilter,
  MunicipalityForFilterFromApi,
} from '@/domain/entities/Municipality/Municipality';
import { apiClient } from '@/shared/lib/axios';
import {
  mapMunicipalityDetailsFromApiToDomain,
  mapMunicipalityForFilterFromApiToDomain,
} from './mappers/municipalityMapper';

type RawPaginatedMunicipalitiesFromApi = {
  municipalities: MunicipalityForFilterFromApi[];
  total: number;
  currentPage: number;
};

export interface IMunicipalityRepository {
  list(
    page?: number,
    limit?: number,
  ): Promise<PaginatedResponse<MunicipalityForFilter>>;
  findById(id: string): Promise<MunicipalityDetails | null>;
}

const list = async (
  page?: number,
  limit?: number,
): Promise<PaginatedResponse<MunicipalityForFilter>> => {
  try {
    const queryParams = {
      page: page || 1,
      limit: limit || 250,
    };

    const { data: apiResponse } =
      await apiClient.get<RawPaginatedMunicipalitiesFromApi>(
        '/api/v1/municipalities',
        {
          params: queryParams,
        },
      );

    const mappedData = apiResponse.municipalities.map(
      mapMunicipalityForFilterFromApiToDomain,
    );

    return {
      data: mappedData,
      total: apiResponse.total,
      page: apiResponse.currentPage,
      limit: queryParams.limit,
    };
  } catch (error) {
    console.error('Erro no repositório ao buscar lista de municípios:', error);
    throw error;
  }
};

const findById = async (id: string): Promise<MunicipalityDetails | null> => {
  try {
    const { data } = await apiClient.get<MunicipalityDetailsFromApi>(
      `/api/v1/municipalities/${id}`,
    );
    if (!data) return null;
    return mapMunicipalityDetailsFromApiToDomain(data);
  } catch (error) {
    console.error(
      `Erro no repositório ao buscar município com ID ${id}:`,
      error,
    );
    throw error;
  }
};

export const municipalityRepository: IMunicipalityRepository = {
  list,
  findById,
};
