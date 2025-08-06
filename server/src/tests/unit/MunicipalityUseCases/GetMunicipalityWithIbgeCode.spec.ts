import { GetMunicipalityWithIbgeCodeUseCase } from '../../../application/UseCases/MunicipalityUseCases/GetMunicipalityWithIbgeCodeUseCase/GetMunicipalityWithIbgeCodeUseCase';
import { UF } from '../../../domain/enums/enumUnidadesFederativas';

describe('GetMunicipalityWithIbgeCodeUseCase', () => {
  it('Get municipality without errors', async () => {
    const mockMunicipalityRepository = {
      findById: jest.fn().mockResolvedValue(null),
      findByIbgeCode: jest.fn().mockResolvedValue({
        id: '1',
        codigoIbge: 1234567,
        nome: 'Cabaceiros',
        uf: UF.PARAIBA,
        riscoMedio: 0.75,
      }),
      findByName: jest.fn().mockResolvedValue(null),
      findByUf: jest.fn().mockResolvedValue(null),
      findAllForDropdown: jest.fn().mockResolvedValue(null),
      findAll: jest.fn().mockResolvedValue(null),
      delete: jest.fn(),
      update: jest.fn(),
      save: jest.fn(),
    };

    const getMunicipalityWithIbgeCode = new GetMunicipalityWithIbgeCodeUseCase(
      mockMunicipalityRepository,
    );

    const schoolData = {
      codigoIbge: 1234567,
    };

    expect(await getMunicipalityWithIbgeCode.execute(schoolData)).toEqual({
      id: '1',
      codigoIbge: 1234567,
      nome: 'Cabaceiros',
      uf: UF.PARAIBA,
      riscoMedio: 0.75,
    });
  });

  it('Get a feedback message', async () => {
    const mockMunicipalityRepository = {
      findById: jest.fn().mockResolvedValue(null),
      findByIbgeCode: jest.fn().mockResolvedValue(null),
      findByName: jest.fn().mockResolvedValue(null),
      findByUf: jest.fn().mockResolvedValue(null),
      findAllForDropdown: jest.fn().mockResolvedValue(null),
      findAll: jest.fn().mockResolvedValue(null),
      delete: jest.fn(),
      update: jest.fn(),
      save: jest.fn(),
    };

    const getMunicipalityWithIbgeCode = new GetMunicipalityWithIbgeCodeUseCase(
      mockMunicipalityRepository,
    );

    const schoolData = {
      codigoIbge: 1234567,
    };

    expect(await getMunicipalityWithIbgeCode.execute(schoolData)).toEqual(
      'No have a municipality with this code',
    );
  });
});
