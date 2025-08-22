import { GetMunicipalityStatisticsUseCase } from '../../../application/UseCases/MunicipalityUseCases/GetMunicipalityStatisticsUseCase/GetMunicipalityStatisticsUseCase';
import { UF } from '../../../domain/enums/enumUnidadesFederativas';
import { HTTPSTATUS } from '../../../shared/config/http';

describe('GetMunicipalityStatisticsUseCase', () => {
  it('Get statistics without errors', async () => {
    const mockSchoolRepository = {
      findById: jest.fn().mockResolvedValue(null),
      findByIbgeCode: jest.fn().mockResolvedValue([
        {
          id: '1',
          municipioIdIbge: '1234567',
          escolaIdInep: 12345678,
          escolaNome: 'Escola de Diego Antonio',
          municipioNome: 'Cabaceiros',
          estadoSigla: UF.PARAIBA,
          scoreRisco: 0.75,
        },
        {
          id: '2',
          municipioIdIbge: 1234567,
          escolaIdInep: 12345676,
          escolaNome: 'Escola de Neves',
          municipioNome: 'Cabaceiros',
          estadoSigla: UF.PARAIBA,
          scoreRisco: 0.1,
        },
      ]),
      findByName: jest.fn().mockResolvedValue(null),
      findByUf: jest.fn().mockResolvedValue(null),
      findByDepAdm: jest.fn().mockResolvedValue(null),
      findSearchByTerm: jest.fn().mockResolvedValue(null),
      findAllForMap: jest.fn().mockResolvedValue(null),
      findAll: jest.fn().mockResolvedValue(null),
      delete: jest.fn(),
      update: jest.fn(),
      save: jest.fn(),
    };

    const getMunicipalityStatisticsUseCase =
      new GetMunicipalityStatisticsUseCase(mockSchoolRepository);

    const schoolData = {
      municipioIdIbge: '1234567',
    };

    expect(await getMunicipalityStatisticsUseCase.execute(schoolData)).toEqual({
      ibgeCode: '1234567',
      totalSchools: 2,
      averageRisk: 0.425,
    });
  });
  it('Get a not found error', async () => {
    const mockSchoolRepository = {
      findById: jest.fn().mockResolvedValue(null),
      findByIbgeCode: jest.fn().mockResolvedValue([]),
      findByName: jest.fn().mockResolvedValue(null),
      findByUf: jest.fn().mockResolvedValue(null),
      findByDepAdm: jest.fn().mockResolvedValue(null),
      findSearchByTerm: jest.fn().mockResolvedValue(null),
      findAllForMap: jest.fn().mockResolvedValue(null),
      findAll: jest.fn().mockResolvedValue(null),
      delete: jest.fn(),
      update: jest.fn(),
      save: jest.fn(),
    };

    const getMunicipalityStatisticsUseCase =
      new GetMunicipalityStatisticsUseCase(mockSchoolRepository);

    const schoolData = {
      municipioIdIbge: '1234567',
    };

    await expect(
      getMunicipalityStatisticsUseCase.execute(schoolData),
    ).rejects.toMatchObject({
      message: 'No have schools registered in this municipality',
      statusCode: HTTPSTATUS.NOT_FOUND,
    });
  });
});
