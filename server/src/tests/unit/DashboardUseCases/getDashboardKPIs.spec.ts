import { GetDashboardKPIsUseCase } from "../../../application/UseCases/DashboardUseCases/GetDashboardKPIsUseCase/GetDashboardKPIsUseCase";


describe('GetDashboardKPIsUseCase', () => {
  it('Get all KPIs without errors', async () => {
    const mockSchoolRepository = {
      findById: jest.fn().mockResolvedValue(null),
      findByName: jest.fn().mockResolvedValue(null),
      findByUf: jest.fn().mockResolvedValue(null),
      findByDepAdm: jest.fn().mockResolvedValue(null),
      findAllForMap: jest.fn().mockResolvedValue(null),
      findAll: jest.fn().mockResolvedValue([
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
            total_alunos: 450
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
        {
          id: 'esc-002',
          municipioIdIbge: 'mun-002',
          escolaIdInep: 87654321,
          escolaNome: 'Escola Estadual Coronel João Pessoa',
          municipioNome: 'Campina Grande',
          estadoSigla: 'PB',
          dependenciaAdm: 'estadual',
          tipoLocalizacao: 'rural',
          localizacao: {
            type: 'Point',
            coordinates: [-35.9187, -7.2306],
          },
          scoreRisco: 0.45,
          indicadores: {
            total_alunos: 820
          },
          infraestrutura: {
            possui_biblioteca: true,
            possui_laboratorio_informatica: true,
            possui_quadra_esportes: true,
            possui_sala_professores: true,
            possui_refeitorio: true,
            possui_saneamento_basico: true,
            possui_acesso_internet: true,
            possui_energia_eletrica: true,
            possui_agua_potavel: true,
            possui_esgoto: true,
            possui_ar_condicionado: false,
            possui_auditorio: false,
          },
        },
      ]),
      delete: jest.fn(),
      update: jest.fn(),
      save: jest.fn(),
    };

    const mockMunicipalityRepository = {
      findById: jest.fn().mockResolvedValue(null),
      findByName: jest.fn().mockResolvedValue(null),
      findByUf: jest.fn().mockResolvedValue(null),
      findAllForDropdown: jest.fn().mockResolvedValue(null),
      findAll: jest.fn().mockResolvedValue([
        {
          id: 'mun-002',
          nome: 'Cabaceiras',
          populacao: 5489,
          uf: 'PB',
        },
      ]),
      delete: jest.fn(),
      update: jest.fn(),
      save: jest.fn(),
    };

    const getDashboardKPIsUseCase = new GetDashboardKPIsUseCase(
      mockSchoolRepository,
      mockMunicipalityRepository,
    );

    expect(await getDashboardKPIsUseCase.execute()).toEqual({
      schools: 2,
      schoolsWithHighInfraestructureRisk: [
        {
          id: 'esc-001',
          municipioIdIbge: 'mun-002',
          escolaIdInep: 12345678,
          escolaNome: 'Escola Municipal Professora Ana Silva',
          municipioNome: 'João Pessoa',
          estadoSigla: 'PB',
          dependenciaAdm: 'municipal',
          localizacao: {
            type: 'Point',
            coordinates: [-34.8811, -7.1195],
          },
          scoreRisco: 0.82,
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
      ],
      municipalitiesWithMostSchoolsInHighRisk: [],
      lackName: 'possui_ar_condicionado',
    });
  });
});
