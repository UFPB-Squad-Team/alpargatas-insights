import { School } from '../../../domain/entities/school';
import { dependenciaAdministrativa } from '../../../domain/enums/enumDependenciaAdministrativa';
import { UF } from '../../../domain/enums/enumUnidadesFederativas';
import { ISchoolRepository } from '../../../domain/repositories/schoolRepository';
import { SchoolModel } from '../../configs/models/moongoseDatabaseSchema';
import { SchoolMapper } from '../../mapper/schoolMapper';

export class MoongoseSchoolRepository implements ISchoolRepository {
  async findById(id: string): Promise<School | null> {
    const schoolExist = await SchoolModel.findById(id);

    if (!schoolExist) {
      return null;
    }

    return SchoolMapper.toDomain(schoolExist);
  }

  async findByName(name: string): Promise<School | null> {
    const schoolExist = await SchoolModel.findOne({ escolaNome: name });

    if (!schoolExist) {
      return null;
    }

    return SchoolMapper.toDomain(schoolExist);
  }

  async findByIbgeCode(municipioIdIbge: number): Promise<School[]> {
    const pipeline = [
      {
        $match: { municipioIdIbge },
      },
      {
        $project: {
          _id: 1,
          municipioIdIbge: 1,
          escolaIdInep: 1,
          escolaNome: 1,
          municipioNome: 1,
          estadoSigla: 1,
          dependenciaAdm: 1,
          scoreRisco: 1,
        },
      },
    ];

    const schools = await SchoolModel.aggregate(pipeline);

    return SchoolMapper.toDomainManySchools(schools);
  }

  async findByUf(estadoSigla: UF): Promise<School[]> {
    const pipeline = [
      {
        $match: { estadoSigla },
      },
      {
        $project: {
          _id: 1,
          municipioIdIbge: 1,
          escolaIdInep: 1,
          escolaNome: 1,
          municipioNome: 1,
          estadoSigla: 1,
          dependenciaAdm: 1,
          scoreRisco: 1,
          indicadores: 1,
          infraestrutura: 1,
        },
      },
    ];

    const school = await SchoolModel.aggregate(pipeline);

    return SchoolMapper.toDomainManySchools(school);
  }

  async findByDepAdm(
    dependenciaAdm: dependenciaAdministrativa,
  ): Promise<School[]> {
    const pipeline = [
      {
        $match: { dependenciaAdm },
      },
      {
        $project: {
          _id: 1,
          municipioIdIbge: 1,
          escolaIdInep: 1,
          escolaNome: 1,
          municipioNome: 1,
          estadoSigla: 1,
          dependenciaAdm: 1,
          scoreRisco: 1,
          indicadores: 1,
          infraestrutura: 1,
        },
      },
    ];

    const school = await SchoolModel.aggregate(pipeline);

    return SchoolMapper.toDomainManySchools(school);
  }

  async findSearchByTerm(
    term: string,
    page: number,
    limit: number,
  ): Promise<{
    schools: School[];
    total: number;
    page: number;
    currentPage: number;
  }> {
    const regex = new RegExp(term, 'i');

    const query = {
      $or: [
        { escolaNome: regex },
        { municipioNome: regex },
        { municipioIdIbge: regex },
        { estadoSigla: regex },
      ],
    };

    const [school, total] = await Promise.all([
      SchoolModel.find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      SchoolModel.countDocuments(query),
    ]);

    const pages = Math.ceil(total / limit);

    return {
      schools: SchoolMapper.toDomainManySchools(school),
      total,
      page: pages,
      currentPage: page,
    };
  }

  async findAllForMap(): Promise<
    Pick<School, 'id' | 'escolaNome' | 'localizacao' | 'scoreRisco'>[]
  > {
    const pipeline = [
      {
        $project: {
          _id: 1,
          escolaNome: 1,
          localizacao: 1,
          scoreRisco: 1,
        },
      },
      {
        $addFields: {
          id: '$_id',
        },
      },

      {
        $unset: '_id',
      },
    ];

    const school = await SchoolModel.aggregate(pipeline);

    return school;
  }

  async findAll(): Promise<School[]> {
    const pipeline = [
      {
        $project: {
          _id: 1,
          municipioIdIbge: 1,
          escolaIdInep: 1,
          escolaNome: 1,
          municipioNome: 1,
          estadoSigla: 1,
          dependenciaAdm: 1,
          tipoLocalizacao: 1,
          localizacao: 1,
          scoreRisco: 1,
          indicadores: 1,
          infraestrutura: 1,
        },
      },
    ];

    const school = await SchoolModel.aggregate(pipeline);

    return SchoolMapper.toDomainManySchools(school);
  }

  async delete(id: string): Promise<void> {
    await SchoolModel.deleteOne({ id });
  }

  async update({ id, ...school }: School): Promise<void> {
    await SchoolModel.findByIdAndUpdate(id, { $set: school });
  }

  async save({
    municipioIdIbge,
    escolaIdInep,
    escolaNome,
    municipioNome,
    estadoSigla,
    dependenciaAdm,
    tipoLocalizacao,
    localizacao,
    indicadores,
    scoreRisco,
    infraestrutura,
  }: School): Promise<void> {
    await SchoolModel.create({
      municipioIdIbge,
      escolaIdInep,
      escolaNome,
      municipioNome,
      estadoSigla,
      dependenciaAdm,
      tipoLocalizacao,
      localizacao,
      indicadores,
      scoreRisco,
      infraestrutura,
    });
  }
}
