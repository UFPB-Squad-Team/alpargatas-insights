import { IMunicipalityRepository } from '../../../../domain/repositories/municipalityRepository';
import { ISchoolRepository } from '../../../../domain/repositories/schoolRepository';
import { AppError } from '../../../../shared/utils/errors/appError';
import { GetMunicipalityWithIbgeCodeDTO } from './GetMunicipalityWithIbgeCodeDTO';

export class GetMunicipalityWithIbgeCodeUseCase {
  private readonly HIGH_RISK_THRESHOLD: number = 0.75
  constructor(private municipalityRepository: IMunicipalityRepository, 
    private schoolRepository: ISchoolRepository 
  ) {}

  async execute({ codigoIbge }: GetMunicipalityWithIbgeCodeDTO) {
    if (!codigoIbge || typeof codigoIbge !== 'string') {
      throw new AppError('This code need be a string');
    }

    const municipality =
      await this.municipalityRepository.findByIbgeCode(codigoIbge);

    const schools = await this.schoolRepository.findAll()

    
    const schoolsWithHighInfraestructureRisk = schools
      .filter(
        (school) =>
          school.scoreRiscoContextualizado >= this.HIGH_RISK_THRESHOLD && String(school.municipioIdIbge) === codigoIbge
      )
      .map((school) => ({
        id: school.id,
        escolaIdInep: school.escolaIdInep,
        escolaNome: school.escolaNome,
        municipioNome: school.municipioNome,
        municipioIdIbge: school.municipioIdIbge,
        dependenciaAdm: school.dependenciaAdm,
        tipoLocalizacao: school.tipoLocalizacao,
        estadoSigla: school.estadoSigla,
        scoreRisco: school.scoreRisco,
        scoreRiscoContextualizado: school.scoreRiscoContextualizado,
        infraestrutura: school.infraestrutura,
        localizacao: school.localizacao,
      }));

      const schoolMunicipality = schools
      .filter(
        (school) =>
          school.dependenciaAdm === 'Municipal' && String(school.municipioIdIbge) === codigoIbge
      )
      .map((school) => ({
        id: school.id,
        escolaIdInep: school.escolaIdInep,
        escolaNome: school.escolaNome,
        municipioNome: school.municipioNome,
        municipioIdIbge: school.municipioIdIbge,
        dependenciaAdm: school.dependenciaAdm,
        tipoLocalizacao: school.tipoLocalizacao,
        estadoSigla: school.estadoSigla,
        scoreRisco: school.scoreRisco,
        scoreRiscoContextualizado: school.scoreRiscoContextualizado,
        infraestrutura: school.infraestrutura,
        localizacao: school.localizacao,
      }));

      const schoolsState = schools
      .filter(
        (school) =>
          school.dependenciaAdm === 'Estadual' && String(school.municipioIdIbge) === codigoIbge
      )
      .map((school) => ({
        id: school.id,
        escolaIdInep: school.escolaIdInep,
        escolaNome: school.escolaNome,
        municipioNome: school.municipioNome,
        municipioIdIbge: school.municipioIdIbge,
        dependenciaAdm: school.dependenciaAdm,
        tipoLocalizacao: school.tipoLocalizacao,
        estadoSigla: school.estadoSigla,
        scoreRisco: school.scoreRisco,
        scoreRiscoContextualizado: school.scoreRiscoContextualizado,
        infraestrutura: school.infraestrutura,
        localizacao: school.localizacao,
      }));

      const schoolFederal = schools
      .filter(
        (school) =>
          school.dependenciaAdm === 'Federal' && String(school.municipioIdIbge) === codigoIbge
      )
      .map((school) => ({
        id: school.id,
        escolaIdInep: school.escolaIdInep,
        escolaNome: school.escolaNome,
        municipioNome: school.municipioNome,
        municipioIdIbge: school.municipioIdIbge,
        dependenciaAdm: school.dependenciaAdm,
        tipoLocalizacao: school.tipoLocalizacao,
        estadoSigla: school.estadoSigla,
        scoreRisco: school.scoreRisco,
        scoreRiscoContextualizado: school.scoreRiscoContextualizado,
        infraestrutura: school.infraestrutura,
        localizacao: school.localizacao,
      }));

      const urbans = schools
      .filter(
        (school) =>
          school.tipoLocalizacao === 'Urbana' && String(school.municipioIdIbge) === codigoIbge
      )
      .map((school) => ({
        id: school.id,
        escolaIdInep: school.escolaIdInep,
        escolaNome: school.escolaNome,
        municipioNome: school.municipioNome,
        municipioIdIbge: school.municipioIdIbge,
        dependenciaAdm: school.dependenciaAdm,
        tipoLocalizacao: school.tipoLocalizacao,
        estadoSigla: school.estadoSigla,
        scoreRisco: school.scoreRisco,
        scoreRiscoContextualizado: school.scoreRiscoContextualizado,
        infraestrutura: school.infraestrutura,
        localizacao: school.localizacao,
      }));

      const rural = schools
      .filter(
        (school) =>
          school.tipoLocalizacao === 'Rural' && String(school.municipioIdIbge) === codigoIbge
      )
      .map((school) => ({
        id: school.id,
        escolaIdInep: school.escolaIdInep,
        escolaNome: school.escolaNome,
        municipioNome: school.municipioNome,
        municipioIdIbge: school.municipioIdIbge,
        dependenciaAdm: school.dependenciaAdm,
        tipoLocalizacao: school.tipoLocalizacao,
        estadoSigla: school.estadoSigla,
        scoreRisco: school.scoreRisco,
        scoreRiscoContextualizado: school.scoreRiscoContextualizado,
        infraestrutura: school.infraestrutura,
        localizacao: school.localizacao,
      }));

        const totalSchools = schools
      .filter(
        (school) =>
        String(school.municipioIdIbge) === codigoIbge
      )
      .map((school) => ({
        id: school.id,
        escolaIdInep: school.escolaIdInep,
        escolaNome: school.escolaNome,
        municipioNome: school.municipioNome,
        municipioIdIbge: school.municipioIdIbge,
        dependenciaAdm: school.dependenciaAdm,
        tipoLocalizacao: school.tipoLocalizacao,
        estadoSigla: school.estadoSigla,
        scoreRisco: school.scoreRisco,
        scoreRiscoContextualizado: school.scoreRiscoContextualizado,
        infraestrutura: school.infraestrutura,
        localizacao: school.localizacao,
      }));


    return {
      id: municipality?.id,
      codigoIbge: municipality?.codigoIbge,
      nome: municipality?.nome,
      uf: municipality?.uf,
      riscoMedio:municipality?.riscoMedio,
      totalEscolas: totalSchools.length,
      totalEscolasUrbanas: urbans.length,
      totalEscolasRurais: rural.length,
      totalEscolasMunicipais:schoolMunicipality.length,
      totalEscolasEstaduais: schoolsState.length,
      totalEscolasFederais: schoolFederal.length,
      totalEscolasEmAltoRisco: schoolsWithHighInfraestructureRisk.length,
    }
  }
}
