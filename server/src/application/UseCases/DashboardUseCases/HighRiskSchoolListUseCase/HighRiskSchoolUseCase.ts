import { ISchoolRepository } from '../../../../domain/repositories/schoolRepository';
import { AppError } from '../../../../shared/utils/errors/appError';
import { PaginationHighRiskSchoolDTO } from './PaginationHighRiskSchoolDTO';

export class HighRiskSchoolUseCase {
  private readonly HIGH_RISK_THRESHOLD: number = 0.75;
  constructor(private schoolRepository: ISchoolRepository) {}

  async execute({ page, limit, filters }: PaginationHighRiskSchoolDTO) {
    if (page < 1 || limit < 1) {
      throw new AppError('Parameters invalid');
    }

    return await this.schoolRepository.findWithFilters(
      this.HIGH_RISK_THRESHOLD,
      filters,
      page,
      limit,
    );
  }
}
