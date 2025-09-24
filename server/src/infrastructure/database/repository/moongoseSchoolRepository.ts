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

  async findByIbgeCode(municipioIdIbge: string): Promise<School[]> {
    const pipeline = [
      {
        $match: {
          $expr: {
            $eq: [
              { $toDouble: '$municipioIdIbge' },
              { $toDouble: municipioIdIbge },
            ],
          },
        },
      },
      {
        $project: {
          id: { $toString: '$_id' },
          municipioIdIbge: 1,
          escolaIdInep: 1,
          escolaNome: 1,
          municipioNome: 1,
          estadoSigla: 1,
          dependenciaAdm: 1,
          scoreRisco: 1,
          municipioSomaProjetos: 1,
          municipioSomaBeneficiados: 1,
          municipioMediaIdeb2023: 1,
          riscoIdebMunicipio: 1,
          scoreRiscoContextualizado: 1,
          indicadores: 1,
          infraestrutura: 1,
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
          id: { $toString: '$_id' },
          municipioIdIbge: 1,
          escolaIdInep: 1,
          escolaNome: 1,
          municipioNome: 1,
          estadoSigla: 1,
          dependenciaAdm: 1,
          scoreRisco: 1,
          municipioSomaProjetos: 1,
          municipioSomaBeneficiados: 1,
          municipioMediaIdeb2023: 1,
          riscoIdebMunicipio: 1,
          scoreRiscoContextualizado: 1,
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
          id: { $toString: '$_id' },
          municipioIdIbge: 1,
          escolaIdInep: 1,
          escolaNome: 1,
          municipioNome: 1,
          estadoSigla: 1,
          dependenciaAdm: 1,
          scoreRisco: 1,
          municipioSomaProjetos: 1,
          municipioSomaBeneficiados: 1,
          municipioMediaIdeb2023: 1,
          riscoIdebMunicipio: 1,
          scoreRiscoContextualizado: 1,
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
    const query = {
      $or: [
        { $text: { $search: `"${term}"` } },
        { municipioIdIbge: { $regex: term, $options: 'i' } },
        { estadoSigla: term.toUpperCase() },
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

  async pagination(
    page: number,
    limit: number = 20,
    filters?: Partial<School>,
    term?: string,
    threshold: number = 0.75,
  ): Promise<{
    schools: School[];
    total: number;
    page: number;
    currentPage: number;
  }> {
    const skip = (page - 1) * limit;

    const matchStage: any = {};

    const aggregationPipeline: any[] = [];

    if (filters?.municipioIdIbge) {
      matchStage.municipioIdIbge = +filters.municipioIdIbge;
    }

    if (filters?.dependenciaAdm) {
      matchStage.dependenciaAdm = filters.dependenciaAdm;
    }

    if (filters?.tipoLocalizacao) {
      matchStage.tipoLocalizacao = filters.tipoLocalizacao;
    }

    if (term) {
      matchStage.$or = [
        { estadoSigla: term.toUpperCase() },
        { escolaNome: { $regex: term, $options: 'i' } },
        { municipioNome: { $regex: term, $options: 'i' } },
        {
          $expr: {
            $regexMatch: {
              input: { $toString: '$municipioIdIbge' },
              regex: term,
              options: 'i',
            },
          },
        },
      ];
    }

    aggregationPipeline.push({ $match: matchStage });

    if (Object.keys(matchStage).length > 0) {
      aggregationPipeline.push({ $match: matchStage });
    }

    if (filters?.municipioSomaProjetos !== undefined) {
      aggregationPipeline.push({
        $match: {
          municipioSomaProjetos: {
            $exists: true,
            $ne: null,
            $nin: [null, undefined, '', NaN],
          },
        },
      });
    }

    aggregationPipeline.push({
      $facet: {
        paginatedResults: [
          { $sort: { escolaNome: 1 } },
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              id: { $toString: '$_id' },
              municipioIdIbge: 1,
              escolaIdInep: 1,
              escolaNome: 1,
              municipioNome: 1,
              estadoSigla: 1,
              dependenciaAdm: 1,
              tipoLocalizacao: 1,
              localizacao: 1,
              scoreRisco: 1,
              scoreRiscoContextualizado: 1,
              indicadores: 1,
              infraestrutura: 1,
            },
          },
        ],
        totalCount: [{ $count: 'count' }],
      },
    });

    const [result] = await SchoolModel.aggregate(aggregationPipeline);

    const schools = result.paginatedResults;
    const total = result.totalCount[0]?.count || 0;
    const pages = Math.ceil(total / limit);

    return {
      schools: SchoolMapper.toDomainManySchools(schools),
      total,
      page: pages,
      currentPage: page,
    };
  }

  async findWithFilters(
    riskTrheshold: number,
    filters?: Partial<School>,
    page?: number,
    limit?: number,
  ): Promise<School[]> {
    const aggregationPipeline: any[] = [
      {
        $match: {
          scoreRiscoContextualizado: { $gte: riskTrheshold },
        },
      },
    ];

    if (filters?.municipioIdIbge) {
      aggregationPipeline.push({
        $match: {
          $expr: {
            $eq: [
              { $toString: '$municipioIdIbge' },
              String(filters.municipioIdIbge),
            ],
          },
        },
      });
    }

    if (filters?.dependenciaAdm) {
      aggregationPipeline.push({
        $match: {
          dependenciaAdm: filters.dependenciaAdm,
        },
      });
    }

    if (filters?.tipoLocalizacao) {
      aggregationPipeline.push({
        $match: {
          tipoLocalizacao: filters.tipoLocalizacao,
        },
      });
    }

    if (filters?.municipioSomaProjetos !== undefined) {
      aggregationPipeline.push({
        $match: {
          municipioSomaProjetos: {
            $exists: true,
            $ne: null,
            $nin: [null, undefined, '', NaN],
          },
        },
      });
    }

    if (page && limit) {
      aggregationPipeline.push(
        { $skip: (page - 1) * limit },
        { $limit: limit },
      );
    }

    const schools = await SchoolModel.aggregate(aggregationPipeline).exec();

    return SchoolMapper.toDomainManySchools(schools);
  }

  async getRiskDistribution(
    thresholds: { high: number; medium: number; low: number },
    filters?: Partial<School>,
  ): Promise<{ high: number, medium: number, low: number }> {
    const matchConditions: any = {};

  
    const aggregationPipeline: any[] = [
      {
        $match: {
          scoreRiscoContextualizado: { $ne: null },
        },
      },
    ];


    if (filters?.municipioIdIbge) {
      aggregationPipeline.push({
        $match: {
          $expr: {
            $eq: [
              { $toString: '$municipioIdIbge' },
              String(filters.municipioIdIbge),
            ],
          },
        },
      });
    }

    if (filters?.dependenciaAdm) {
      aggregationPipeline.push({
        $match: {
          dependenciaAdm: filters.dependenciaAdm,
        },
      });
    }

    if (filters?.tipoLocalizacao) {
      aggregationPipeline.push({
        $match: {
          tipoLocalizacao: filters.tipoLocalizacao,
        },
      });
    }

    if (filters?.municipioSomaProjetos !== undefined) {
      aggregationPipeline.push({
        $match: {
          municipioSomaProjetos: {
            $exists: true,
            $ne: null,
            $nin: [null, undefined, '', NaN],
          },
        },
      });
    }


    aggregationPipeline.push({ $match: matchConditions });

    
    aggregationPipeline.push({
      $facet: {
        highRisk: [
          { $match: { scoreRiscoContextualizado: { $gte: thresholds.high } } },
          { $count: 'count' },
        ],
        mediumRisk: [
          { $match: { scoreRiscoContextualizado: { $gt: thresholds.low, $lt: thresholds.high } } },
          { $count: 'count' },
        ],
        lowRisk: [
          { $match: { scoreRiscoContextualizado: { $lte: thresholds.low } } },
          { $count: 'count' },
        ],
      },
    });

    const [results] = await SchoolModel.aggregate(aggregationPipeline).exec();

      
    return {
      high: results.highRisk[0]?.count || 0,
      medium: results.mediumRisk[0]?.count || 0,
      low: results.lowRisk[0]?.count || 0,
    };
  }

  async findAllForMap(
    filters?: Partial<School>,
  ): Promise<
    Pick<
      School,
      'id' | 'escolaNome' | 'localizacao' | 'scoreRiscoContextualizado'
    >[]
  > {
    const matchStage: any = {};

    if (filters?.municipioIdIbge) {
      matchStage.$expr = {
        $eq: [
          { $toString: '$municipioIdIbge' },
          String(filters.municipioIdIbge),
        ],
      };
    }

    if (filters?.dependenciaAdm)
      matchStage.dependenciaAdm = filters.dependenciaAdm;

    if (filters?.tipoLocalizacao)
      matchStage.tipoLocalizacao = filters.tipoLocalizacao;


    const pipeline: any[] = [];

    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage });
    }

    if (filters?.municipioSomaProjetos !== undefined) {
      pipeline.push({
        $match: {
          municipioSomaProjetos: {
            $exists: true,
            $ne: null,
            $nin: [null, undefined, '', NaN],
          },
        },
      });
    }

    pipeline.push({
      $project: {
        _id: 0,
        id: { $toString: '$_id' },
        escolaNome: 1,
        localizacao: 1,
        scoreRiscoContextualizado: 1,
      },
    });

    const schools = await SchoolModel.aggregate(pipeline);
    return schools;
  }

  async findAll(): Promise<School[]> {
    const pipeline = [
      {
        $project: {
          id: { $toString: '$_id' },
          municipioIdIbge: 1,
          escolaIdInep: 1,
          escolaNome: 1,
          municipioNome: 1,
          estadoSigla: 1,
          dependenciaAdm: 1,
          tipoLocalizacao: 1,
          localizacao: 1,
          scoreRisco: 1,
          municipioSomaProjetos: 1,
          municipioSomaBeneficiados: 1,
          municipioMediaIdeb2023: 1,
          riscoIdebMunicipio: 1,
          scoreRiscoContextualizado: 1,
          indicadores: 1,
          infraestrutura: 1,
        },
      },
    ];

    const school = await SchoolModel.aggregate(pipeline);

    return SchoolMapper.toDomainManySchools(school);
  }

  async delete(id: string): Promise<void> {
    await SchoolModel.deleteOne({ _id: id });
  }

  async update({ id, ...school }: School): Promise<void> {
    await SchoolModel.updateOne({ _id: id }, { $set: school });
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
    scoreRiscoContextualizado,
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
      scoreRiscoContextualizado,
      infraestrutura,
    });
  }
}
