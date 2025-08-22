import { SearchSchoolsUseCase } from '../../../application/UseCases/SchoolUseCases/SearchSchoolsUseCase/SearchSchoolsUseCase';

describe('SearchSchoolsNameUseCase', () => {
  it('Search schools without errors', async () => {
    const mockSchoolRepository = {
      findById: jest.fn().mockResolvedValue(null),
      findByIbgeCode: jest.fn().mockResolvedValue(null),
      findByName: jest.fn().mockResolvedValue(null),
      findByUf: jest.fn().mockResolvedValue(null),
      findByDepAdm: jest.fn().mockResolvedValue(null),
      findSearchByTerm: jest.fn().mockResolvedValue([
        {
          id: 'esc-001',
          municipioIdIbge: 'mun-002',
          escolaIdInep: 12345678,
          escolaNome: 'Escola Municipal Professora Ana Silva',
          municipioNome: 'João Pessoa',
          estadoSigla: 'PB',
          dependenciaAdm: 'municipal',
          tipoLocalizacao: 'urbana',
          localizacao: {
            type: 'Point',
            coordinates: [-34.8811, -7.1195],
          },
          scoreRisco: 0.82,
          indicadores: {
            total_alunos: 450,
          },
          infraestrutura: {
            possui_biblioteca: false,
            possui_laboratorio_informatica: false,
            possui_quadra_esportes: true,
            possui_sala_professores: true,
            possui_refeitorio: false,
            possui_saneamento_basico: true,
            possui_acesso_internet: false,
            possui_energia_eletrica: true,
            possui_agua_potavel: true,
            possui_ar_condicionado: false,
            possui_esgoto: false,
          },
        },
      ]),
      findAllForMap: jest.fn().mockResolvedValue(null),
      findAll: jest.fn().mockResolvedValue(null),
      delete: jest.fn(),
      update: jest.fn(),
      save: jest.fn(),
    };

    const searchSchoolsNameUseCase = new SearchSchoolsUseCase(
      mockSchoolRepository,
    );

    const schoolData = {
      term: 'Escola Municipal Professora Ana Silva',
      page: 1,
      limit: 10,
    };

    expect(await searchSchoolsNameUseCase.execute(schoolData)).toEqual([
      {
        id: 'esc-001',
        municipioIdIbge: 'mun-002',
        escolaIdInep: 12345678,
        escolaNome: 'Escola Municipal Professora Ana Silva',
        municipioNome: 'João Pessoa',
        estadoSigla: 'PB',
        dependenciaAdm: 'municipal',
        tipoLocalizacao: 'urbana',
        localizacao: {
          type: 'Point',
          coordinates: [-34.8811, -7.1195],
        },
        scoreRisco: 0.82,
        indicadores: {
          total_alunos: 450,
        },
        infraestrutura: {
          possui_biblioteca: false,
          possui_laboratorio_informatica: false,
          possui_quadra_esportes: true,
          possui_sala_professores: true,
          possui_refeitorio: false,
          possui_saneamento_basico: true,
          possui_acesso_internet: false,
          possui_energia_eletrica: true,
          possui_agua_potavel: true,
          possui_ar_condicionado: false,
          possui_esgoto: false,
        },
      },
    ]);
  });

  it('Search schools with term empty error', async () => {
    const mockSchoolRepository = {
      findById: jest.fn().mockResolvedValue(null),
      findByIbgeCode: jest.fn().mockResolvedValue(null),
      findByName: jest.fn().mockResolvedValue(null),
      findByUf: jest.fn().mockResolvedValue(null),
      findByDepAdm: jest.fn().mockResolvedValue(null),
      findSearchByTerm: jest.fn().mockResolvedValue([
        {
          id: 'esc-001',
          municipioIdIbge: 'mun-002',
          escolaIdInep: 12345678,
          escolaNome: 'Escola Municipal Professora Ana Silva',
          municipioNome: 'João Pessoa',
          estadoSigla: 'PB',
          dependenciaAdm: 'municipal',
          tipoLocalizacao: 'urbana',
          localizacao: {
            type: 'Point',
            coordinates: [-34.8811, -7.1195],
          },
          scoreRisco: 0.82,
          indicadores: {
            total_alunos: 450,
          },
          infraestrutura: {
            possui_biblioteca: false,
            possui_laboratorio_informatica: false,
            possui_quadra_esportes: true,
            possui_sala_professores: true,
            possui_refeitorio: false,
            possui_saneamento_basico: true,
            possui_acesso_internet: false,
            possui_energia_eletrica: true,
            possui_agua_potavel: true,
            possui_ar_condicionado: false,
            possui_esgoto: false,
          },
        },
      ]),
      findAllForMap: jest.fn().mockResolvedValue(null),
      findAll: jest.fn().mockResolvedValue(null),
      delete: jest.fn(),
      update: jest.fn(),
      save: jest.fn(),
    };

    const searchSchoolsNameUseCase = new SearchSchoolsUseCase(
      mockSchoolRepository,
    );

    const schoolData = {
      term: '',
      page: 1,
      limit: 10,
    };

    await expect(
      searchSchoolsNameUseCase.execute(schoolData),
    ).rejects.toMatchObject({
      message: 'Term is required',
      statusCode: 400,
    });
  });

  it('Search schools with page error', async () => {
    const mockSchoolRepository = {
      findById: jest.fn().mockResolvedValue(null),
      findByIbgeCode: jest.fn().mockResolvedValue(null),
      findByName: jest.fn().mockResolvedValue(null),
      findByUf: jest.fn().mockResolvedValue(null),
      findByDepAdm: jest.fn().mockResolvedValue(null),
      findSearchByTerm: jest.fn().mockResolvedValue([
        {
          id: 'esc-001',
          municipioIdIbge: 'mun-002',
          escolaIdInep: 12345678,
          escolaNome: 'Escola Municipal Professora Ana Silva',
          municipioNome: 'João Pessoa',
          estadoSigla: 'PB',
          dependenciaAdm: 'municipal',
          tipoLocalizacao: 'urbana',
          localizacao: {
            type: 'Point',
            coordinates: [-34.8811, -7.1195],
          },
          scoreRisco: 0.82,
          indicadores: {
            total_alunos: 450,
          },
          infraestrutura: {
            possui_biblioteca: false,
            possui_laboratorio_informatica: false,
            possui_quadra_esportes: true,
            possui_sala_professores: true,
            possui_refeitorio: false,
            possui_saneamento_basico: true,
            possui_acesso_internet: false,
            possui_energia_eletrica: true,
            possui_agua_potavel: true,
            possui_ar_condicionado: false,
            possui_esgoto: false,
          },
        },
      ]),
      findAllForMap: jest.fn().mockResolvedValue(null),
      findAll: jest.fn().mockResolvedValue(null),
      delete: jest.fn(),
      update: jest.fn(),
      save: jest.fn(),
    };

    const searchSchoolsNameUseCase = new SearchSchoolsUseCase(
      mockSchoolRepository,
    );

    const schoolData = {
      term: 'Escola Municipal Professora Ana Silva',
      page: 0,
      limit: 10,
    };

    await expect(
      searchSchoolsNameUseCase.execute(schoolData),
    ).rejects.toMatchObject({
      message: 'Parameters invalid',
      statusCode: 400,
    });
  });

  it('Searc schools with limit error', async () => {
    const mockSchoolRepository = {
      findById: jest.fn().mockResolvedValue(null),
      findByIbgeCode: jest.fn().mockResolvedValue(null),
      findByName: jest.fn().mockResolvedValue(null),
      findByUf: jest.fn().mockResolvedValue(null),
      findByDepAdm: jest.fn().mockResolvedValue(null),
      findSearchByTerm: jest.fn().mockResolvedValue([
        {
          id: 'esc-001',
          municipioIdIbge: 'mun-002',
          escolaIdInep: 12345678,
          escolaNome: 'Escola Municipal Professora Ana Silva',
          municipioNome: 'João Pessoa',
          estadoSigla: 'PB',
          dependenciaAdm: 'municipal',
          tipoLocalizacao: 'urbana',
          localizacao: {
            type: 'Point',
            coordinates: [-34.8811, -7.1195],
          },
          scoreRisco: 0.82,
          indicadores: {
            total_alunos: 450,
          },
          infraestrutura: {
            possui_biblioteca: false,
            possui_laboratorio_informatica: false,
            possui_quadra_esportes: true,
            possui_sala_professores: true,
            possui_refeitorio: false,
            possui_saneamento_basico: true,
            possui_acesso_internet: false,
            possui_energia_eletrica: true,
            possui_agua_potavel: true,
            possui_ar_condicionado: false,
            possui_esgoto: false,
          },
        },
      ]),
      findAllForMap: jest.fn().mockResolvedValue(null),
      findAll: jest.fn().mockResolvedValue(null),
      delete: jest.fn(),
      update: jest.fn(),
      save: jest.fn(),
    };

    const searchSchoolsNameUseCase = new SearchSchoolsUseCase(
      mockSchoolRepository,
    );

    const schoolData = {
      term: 'Escola Municipal Professora Ana Silva',
      page: 1,
      limit: 0,
    };

    await expect(
      searchSchoolsNameUseCase.execute(schoolData),
    ).rejects.toMatchObject({
      message: 'Parameters invalid',
      statusCode: 400,
    });
  });
});
