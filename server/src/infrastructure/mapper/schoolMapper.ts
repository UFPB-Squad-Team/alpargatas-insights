import { School } from "../../domain/entities/school";
import { ISchoolDocument } from "../configs/models/moongoseDatabaseSchema";

export class SchoolMapper{
    static toDomain(schoolDoc: ISchoolDocument): School{
        return new School({
            municipioIdIbge: schoolDoc.municipioIdIbge,
            escolaIdInep: schoolDoc.escolaIdInep,
            escolaNome: schoolDoc.escolaNome,
            municipioNome: schoolDoc.municipioNome,
            estadoSigla: schoolDoc.estadoSigla,
            dependenciaAdm: schoolDoc.dependenciaAdm,
            tipoLocalizacao: schoolDoc.tipoLocalizacao,
            localizacao: schoolDoc.localizacao,
            scoreRisco: schoolDoc.scoreRisco,
            indicadores: schoolDoc.indicadores,
            infraestrutura: schoolDoc.infraestrutura
        }, schoolDoc._id)
    }

    static toDomainManySchools(schoolDoc: ISchoolDocument[]):School[]{
       return schoolDoc.map((school) => new School({
        municipioIdIbge: school.municipioIdIbge,
        escolaIdInep: school.escolaIdInep,
        escolaNome: school.escolaNome,
        municipioNome: school.municipioNome,
        estadoSigla: school.estadoSigla,
        dependenciaAdm: school.dependenciaAdm,
        tipoLocalizacao: school.tipoLocalizacao,
        localizacao: school.localizacao,
        scoreRisco: school.scoreRisco,
        indicadores: school.indicadores,
        infraestrutura: school.infraestrutura
       }, school._id))
    }
}