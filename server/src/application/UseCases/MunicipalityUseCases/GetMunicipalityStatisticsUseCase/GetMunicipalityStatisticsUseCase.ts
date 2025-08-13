import { ISchoolRepository } from '../../../../domain/repositories/schoolRepository';
import { HTTPSTATUS } from '../../../../shared/config/http';
import { AppError } from '../../../../shared/utils/errors/appError';
import { GetMunicipalityStatisticsDTO } from './GetMunicipalityStatisticsDTO';
import { ReturnStatisticsFromMunicipalityDTO } from './ReturnStatistiscDTO';

export class GetMunicipalityStatisticsUseCase {
  constructor(private schoolRepository: ISchoolRepository) {}

  async execute({
    municipioIdIbge,
  }: GetMunicipalityStatisticsDTO): Promise<ReturnStatisticsFromMunicipalityDTO> {
    if (!municipioIdIbge || typeof municipioIdIbge !== 'string') {
      throw new AppError('This code need be a string');
    }

    const schools = await this.schoolRepository.findByIbgeCode(municipioIdIbge);

    if (schools.length === 0) {
      throw new AppError(
        'No have schools registered in this municipality',
        HTTPSTATUS.NOT_FOUND,
      );
    }

    const totalSchools = schools.length;

    const municipalityTotalRisk = schools.reduce<number>(
      (sum, school) => sum + school.scoreRisco,
      0,
    );

    const averageRisk = municipalityTotalRisk / totalSchools;

    return {
      ibgeCode: municipioIdIbge,
      totalSchools,
      averageRisk,
    };
  }
}
