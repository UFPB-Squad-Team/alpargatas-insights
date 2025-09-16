import { INeedRepository } from '../../../../domain/repositories/needRepository';
import { AppError } from '../../../../shared/utils/errors/appError';
import { ListApprovedNeedInputDTO } from './ListApprovedNeedInputDTO';
import { ListApprovedNeedOutputDTO } from './ListApprovedNeedOutputDTO';

export class ListApprovedNeedUseCase {
  constructor(private needRepositoy: INeedRepository) {}

  async execute({
    page,
    limit,
    filters,
  }: ListApprovedNeedInputDTO): Promise<ListApprovedNeedOutputDTO> {
    if (page <= 0 || limit <= 0) {
      throw new AppError('Page and limit need be positive and greater than 0');
    }

    const needsWithApprovedStatusAndPagination =
      await this.needRepositoy.listApproved(page, limit, filters);

    return {
      needs: needsWithApprovedStatusAndPagination.needs,
      page: needsWithApprovedStatusAndPagination.page,
      total: needsWithApprovedStatusAndPagination.total,
      currentPage: needsWithApprovedStatusAndPagination.currentPage,
    };
  }
}
