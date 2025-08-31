import {
  MunicipalityForFilter,
  MunicipalityForFilterFromApi,
} from '@/domain/entities/Municipality/Municipality';
import { apiClient } from '@/shared/lib/axios';
import { mapMunicipalityForFilterFromApiToDomain } from './mappers/municipalityMapper';

export interface IMunicipalityRepository {
  listForFilter(): Promise<MunicipalityForFilter[]>;
}

const listForFilter = async (): Promise<MunicipalityForFilter[]> => {
  try {
    const { data } = await apiClient.get<MunicipalityForFilterFromApi[]>(
      '/api/v1/municipalities',
    );
    return data.map(mapMunicipalityForFilterFromApiToDomain);
  } catch (error) {
    console.error('Erro no repositório ao buscar lista de municípios:', error);
    throw error;
  }
};

export const municipalityRepository: IMunicipalityRepository = {
  listForFilter,
};
