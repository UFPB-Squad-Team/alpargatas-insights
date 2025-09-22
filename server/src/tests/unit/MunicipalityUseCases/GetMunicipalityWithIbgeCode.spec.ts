import { GetMunicipalityWithIbgeCodeUseCase } from '../../../application/UseCases/MunicipalityUseCases/GetMunicipalityWithIbgeCodeUseCase/GetMunicipalityWithIbgeCodeUseCase';
import { dependenciaAdministrativa } from '../../../domain/enums/enumDependenciaAdministrativa';
import { tipoLocalizacao } from '../../../domain/enums/enumTipoLocalizacao';
import { UF } from '../../../domain/enums/enumUnidadesFederativas';

describe('GetMunicipalityWithIbgeCodeUseCase', () => {
  it('Get municipality without errors', async () => {
    const mockMunicipalityRepository = {
      findByIbgeCode: jest.fn().mockResolvedValue({
        id: '1',
        codigoIbge: '1234567',
        nome: 'Cabaceiros',
        uf: UF.PARAIBA,
        riscoMedio: 0.75,
      }),
      findByName: jest.fn().mockResolvedValue(null),
      findByUf: jest.fn().mockResolvedValue(null),
      findAllForDropdown: jest.fn().mockResolvedValue(null),
      findAll: jest.fn().mockResolvedValue(null),
    };

    const mockSchoolRepository = {
      findById: jest.fn().mockResolvedValue(null),
      findByIbgeCode: jest.fn().mockResolvedValue(null),
      findByName: jest.fn().mockResolvedValue(null),
      findByUf: jest.fn().mockResolvedValue(null),
      findByDepAdm: jest.fn().mockResolvedValue(null),
      findSearchByTerm: jest.fn().mockResolvedValue(null),
      pagination: jest.fn().mockResolvedValue(null),
      findWithFilters: jest.fn().mockResolvedValue(null),
      getRiskDistribution: jest.fn().mockResolvedValue(null),
      findAllForMap: jest.fn().mockResolvedValue(null),
      findAll: jest.fn().mockResolvedValue([
        {
          id: '1',
          municipioIdIbge: '1234567',
          municipioNome: 'Cabaceiros',
          escolaNome: 'Escola mock',
          estadoSigla: UF.PARAIBA,
          dependenciaAdministrativa: dependenciaAdministrativa.ESTADUAL,
          tipoLocalizacao: tipoLocalizacao.URBANA,
          localizacao: { type: 1, coordinates: [0, 0] },
          scoreRiscoContextualizado: 0.8,
          municipioSomaProjetos: 0,
          municipioSomaBeneficiados: 0
        },
      ]),
      delete: jest.fn(),
      update: jest.fn(),
      save: jest.fn(),
    };

    const getMunicipalityWithIbgeCode = new GetMunicipalityWithIbgeCodeUseCase(
      mockMunicipalityRepository,
      mockSchoolRepository,
    );

    const schoolData = {
      codigoIbge: '1234567',
    };

    expect(await getMunicipalityWithIbgeCode.execute(schoolData)).toEqual({
      id: '1',
      codigoIbge: '1234567',
      nome: 'Cabaceiros',
      uf: UF.PARAIBA,
      riscoMedio: 0.75,
      totalEscolas: 1,
      totalEscolasUrbanas: 1,
      totalEscolasRurais: 0,
      totalEscolasMunicipais: 0,
      totalEscolasEstaduais: 0,
      totalEscolasFederais: 0,
      totalEscolasEmAltoRisco: 1,
      totalProjetosDoInstituto: 0,
      totalBeneficiadosDoInstituto: 0
    });
  });

  it('Get a feedback message', async () => {
    const mockMunicipalityRepository = {
      findByIbgeCode: jest.fn().mockResolvedValue(null),
      findByName: jest.fn().mockResolvedValue(null),
      findByUf: jest.fn().mockResolvedValue(null),
      findAllForDropdown: jest.fn().mockResolvedValue(null),
      findAll: jest.fn().mockResolvedValue(null),
    };

    const mockSchoolRepository = {
      findById: jest.fn().mockResolvedValue(null),
      findByIbgeCode: jest.fn().mockResolvedValue(null),
      findByName: jest.fn().mockResolvedValue(null),
      findByUf: jest.fn().mockResolvedValue(null),
      findByDepAdm: jest.fn().mockResolvedValue(null),
      findSearchByTerm: jest.fn().mockResolvedValue(null),
      pagination: jest.fn().mockResolvedValue(null),
      findWithFilters: jest.fn().mockResolvedValue(null),
      getRiskDistribution: jest.fn().mockResolvedValue(null),
      findAllForMap: jest.fn().mockResolvedValue(null),
      findAll: jest.fn().mockResolvedValue([
        {
          id: '1',
          escolaNome: 'Escola mock',
          localizacao: { type: 1, coordinates: [0, 0] },
          scoreRisco: 0.8,
          municipioSomaProjetos: 0,
          municipioSomaBeneficiados: 0
        },
      ]),
      delete: jest.fn(),
      update: jest.fn(),
      save: jest.fn(),
    };

    const getMunicipalityWithIbgeCode = new GetMunicipalityWithIbgeCodeUseCase(
      mockMunicipalityRepository,
      mockSchoolRepository,
    );

    const schoolData = {
      codigoIbge: '1234567',
    };

    expect(await getMunicipalityWithIbgeCode.execute(schoolData)).toEqual({
      id: undefined,
      codigoIbge: undefined,
      nome: undefined,
      uf: undefined,
      riscoMedio: undefined,
      totalEscolas: 0,
      totalEscolasUrbanas: 0,
      totalEscolasRurais: 0,
      totalEscolasMunicipais: 0,
      totalEscolasEstaduais: 0,
      totalEscolasFederais: 0,
      totalEscolasEmAltoRisco: 0,
      totalProjetosDoInstituto: 0,
      totalBeneficiadosDoInstituto: 0
    });
  });
});
