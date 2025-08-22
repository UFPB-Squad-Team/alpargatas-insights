import { ListSchoolsForMapUseCase } from '../../../application/UseCases/SchoolUseCases/ListSchoolsForMapUseCase/ListSchoolsForMapUseCase';

describe('ListSchoolForMapUseCase', () => {
  it('List schools without errors', async () => {
    const mockSchoolRepository = {
      findById: jest.fn().mockResolvedValue(null),
      findByIbgeCode: jest.fn().mockResolvedValue(null),
      findByName: jest.fn().mockResolvedValue(null),
      findByUf: jest.fn().mockResolvedValue(null),
      findByDepAdm: jest.fn().mockResolvedValue(null),
      findSearchByTerm: jest.fn().mockResolvedValue(null),
      findAllForMap: jest.fn().mockResolvedValue([
        {
          id: '1',
          escolaNome: 'Escola mock',
          localizacao: { type: 1, coordinates: [0, 0] },
          scoreRisco: 0.8,
        },
      ]),
      findAll: jest.fn().mockResolvedValue(null),
      delete: jest.fn(),
      update: jest.fn(),
      save: jest.fn(),
    };

    const listSchoolForMapUseCase = new ListSchoolsForMapUseCase(
      mockSchoolRepository,
    );

    expect(await listSchoolForMapUseCase.execute()).toEqual([
      {
        id: '1',
        escolaNome: 'Escola mock',
        localizacao: { type: 1, coordinates: [0, 0] },
        scoreRisco: 0.8,
      },
    ]);
  });
});
