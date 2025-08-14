import { ISchoolRepository } from '../../../../domain/repositories/schoolRepository';
import { RiskDistributionDashboardReturnDTO } from './RiskDistributionDashboardReturnDTO';

export class RiskDistributionDashboardUseCase {
  private readonly HIGH_RISK_THRESHOLD = 0.75;

  private readonly LOW_RISK_THRESHOLD = 0.3;

  private readonly MEDIUM_RISK_THRESHOLD = 0.7;

  constructor(private schoolRepository: ISchoolRepository) {}

  async execute(): Promise<RiskDistributionDashboardReturnDTO> {
    const schools = await this.schoolRepository.findAll();

    let highRiskCount = 0;
    let lowRiskCount = 0;
    let mediumRiskCount = 0;

    for (const school of schools) {
      if (school.scoreRisco >= this.HIGH_RISK_THRESHOLD) {
        highRiskCount++;
      } else if (school.scoreRisco <= this.LOW_RISK_THRESHOLD) {
        lowRiskCount++;
      } else if (school.scoreRisco <= this.MEDIUM_RISK_THRESHOLD) {
        mediumRiskCount++;
      }
    }

    return {
      schoolsWithHighInfraestructureRisk: highRiskCount,
      schoolsWithLowInfraestructureRisk: lowRiskCount,
      schoolsWithMediumInfraestructureRisk: mediumRiskCount,
    };
  }
}
