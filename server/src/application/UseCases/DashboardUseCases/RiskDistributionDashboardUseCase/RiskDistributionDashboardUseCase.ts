import { School } from '../../../../domain/entities/school';
import { ISchoolRepository } from '../../../../domain/repositories/schoolRepository';
import { RiskDistributionDashboardReturnDTO } from './RiskDistributionDashboardReturnDTO';

export class RiskDistributionDashboardUseCase {
  private readonly HIGH_RISK_THRESHOLD = 0.75;

  private readonly LOW_RISK_THRESHOLD = 0.3;

  private readonly MEDIUM_RISK_THRESHOLD = 0.7;

  constructor(private schoolRepository: ISchoolRepository) {}

  async execute(
    filters?: Partial<School>,
  ): Promise<RiskDistributionDashboardReturnDTO> {
    const schools = await this.schoolRepository.getRiskDistribution(
      {
        high: this.HIGH_RISK_THRESHOLD,
        medium: this.MEDIUM_RISK_THRESHOLD,
        low: this.LOW_RISK_THRESHOLD,
      },
      filters,
    );

    const high = schools.high
    const medium = schools.medium
    const low = schools.low

    return {
      schoolsWithHighInfraestructureRisk: high,
      schoolsWithLowInfraestructureRisk: low,
      schoolsWithMediumInfraestructureRisk: medium,
    };
  }
}
