import { School, SchoolFromApi } from '@/domain/entities/School/SchoolProps.ts';
import {
  SchoolForMap,
  SchoolForMapFromApi,
} from '@/domain/entities/School/SchoolForMap.ts';

/**
 * @description Maps the complete school entity coming from the API
 * to our internal domain model.
 */
export const mapSchoolFromApiToDomain = (apiSchool: SchoolFromApi): School => {
  return {
    id: apiSchool.id,
    inep: apiSchool.escolaIdInep,
    nome: apiSchool.escolaNome,
    municipioId: apiSchool.municipioIdIbge,
    municipio: apiSchool.municipioNome,
    estado: apiSchool.estadoSigla,
    dependenciaAdm: apiSchool.dependenciaAdm,
    localizacaoTipo: apiSchool.tipoLocalizacao,
    coordenadas: apiSchool.localizacao.coordinates,
    totalAlunos: apiSchool.indicadores.total_alunos,
    infraestrutura: apiSchool.infraestrutura,
    scoreDeRisco: apiSchool.scoreRisco,

    projetosNoMunicipio: apiSchool.municipioSomaProjetos,
    beneficiadosNoMunicipio: apiSchool.municipioSomaBeneficiados,
    idebMedioMunicipio: apiSchool.municipioMediaIdeb2023,
    riscoIdebMunicipio: apiSchool.risco_ideb_municipio,
    scoreRiscoContextualizado: apiSchool.scoreRiscoContextualizado,
  };
};

/**
 * @description Maps the optimized school entity for the map coming from the API
 * to our internal domain model.
 */
export const mapSchoolForMapFromApiToDomain = (
  apiSchool: SchoolForMapFromApi,
): SchoolForMap => {
  return {
    id: apiSchool._id,
    nome: apiSchool.escolaNome,
    coordenadas: apiSchool.localizacao.coordinates,
    scoreRiscoContextualizado: apiSchool.scoreRiscoContextualizado,
  };
};
