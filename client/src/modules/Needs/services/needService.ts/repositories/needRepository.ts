import {
  NeedType,
  INeed,
  PaginatedNeedsResponse,
} from '@/domain/entities/Needs/Need';
import { PaginatedResponse } from '@/domain/entities/PaginatedResponse';
import { apiClient } from '@/shared/lib/axios';

interface CreateNeedPayload {
  title: string;
  description: string;
  type: NeedType;
  submitterType: string;
}

interface ListNeedsParams {
  page?: number;
  limit?: number;
  type?: NeedType;
}

export const needService = {
  /**
   * Fetches the list of approved needs, paginated.
   */
  async listApproved(
    params: ListNeedsParams,
  ): Promise<PaginatedResponse<INeed>> {
    const { data: apiResponse } = await apiClient.get<PaginatedNeedsResponse>(
      '/api/v1/list/needsApproved',
      {
        params,
      },
    );

    return {
      data: apiResponse.needs,
      total: apiResponse.total,
      page: apiResponse.currentPage,
      limit: params.limit || apiResponse.needs.length,
    };
  },

  /**
   * Creates a new need.
   */
  async create(payload: CreateNeedPayload): Promise<INeed> {
    const { data } = await apiClient.post<INeed>('/api/v1/needs', payload);
    return data;
  },

  /**
   * Busca os detalhes completos de uma única necessidade pelo seu ID.
   */
  async findById(id: string): Promise<INeed> {
    const { data } = await apiClient.get<INeed>(`/api/v1/needs/${id}`);
    return data;
  },
};
