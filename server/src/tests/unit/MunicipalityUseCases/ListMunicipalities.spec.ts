import { ListMunicipalitiesUseCase } from '../../../application/UseCases/MunicipalityUseCases/ListMunicipalitiesUseCase/ListMunicipalitiesUseCase';

describe('ListMunicipalitiesUseCase', () => {
  it('List municipality without errors', async () => {
    const mockMunicipalityRepository = {
      findById: jest.fn().mockResolvedValue(null),
      findByIbgeCode: jest.fn().mockResolvedValue(null),
      findByName: jest.fn().mockResolvedValue(null),
      findByUf: jest.fn().mockResolvedValue(null),
      findAllForDropdown: jest.fn().mockResolvedValue([
        {
          id: '1',
          nome: 'Municipio mock',
        },
      ]),
      findAll: jest.fn().mockResolvedValue(null),
      delete: jest.fn(),
      update: jest.fn(),
      save: jest.fn(),
    };

    const listMunicipalitiesUseCase = new ListMunicipalitiesUseCase(
      mockMunicipalityRepository,
    );

    expect(await listMunicipalitiesUseCase.execute()).toEqual([
      {
        id: '1',
        nome: 'Municipio mock',
      },
    ]);
  });

  it('List a empty array', async () => {
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

    const listMunicipalitiesUseCase = new ListMunicipalitiesUseCase(
      mockMunicipalityRepository,
    );

    expect(await listMunicipalitiesUseCase.execute()).toEqual([]);
  });
});
