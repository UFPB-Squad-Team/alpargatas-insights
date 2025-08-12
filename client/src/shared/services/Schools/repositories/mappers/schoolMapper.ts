import { SchoolFromApi, School } from '@/domain/entities/SchoolProps';

export const mapSchoolFromApiToDomain = (apiSchool: SchoolFromApi): School => {
  return {
    id: apiSchool._id,
    inep: apiSchool.escolaIdInep,
    nome: apiSchool.escolaNome,
    dependenciaAdm: apiSchool.dependenciaAdm,
    estado: apiSchool.estadoSigla,
    municipioId: apiSchool.municipioIdIbge,
    municipio: apiSchool.municipioNome,
    localizacaoTipo: apiSchool.tipoLocalizacao,
    coordenadas: apiSchool.localizacao.coordinates,
    totalAlunos: apiSchool.indicadores.total_alunos,
    infraestrutura: apiSchool.infraestrutura, 
    scoreDeRisco: apiSchool.scoreRisco,
  };
};
