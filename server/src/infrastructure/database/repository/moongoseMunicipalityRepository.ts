import { PipelineStage } from 'mongoose';
import { Municipality } from '../../../domain/entities/municipality';
import { UF } from '../../../domain/enums/enumUnidadesFederativas';
import { IMunicipalityRepository } from '../../../domain/repositories/municipalityRepository';
import { SchoolModel } from '../../configs/models/moongoseDatabaseSchema';

export class MoongoseMunicipalityRepository implements IMunicipalityRepository {
  async findByIbgeCode(codigoIbge: string): Promise<Municipality | null> {
    const school = await SchoolModel.findOne({
      $expr: {
        $eq: [{ $toString: '$municipioIdIbge' }, String(codigoIbge)],
      },
    });

    if (!school) {
      return null;
    }

    const pipeline = [
      {
        $match: {
          $expr: {
            $eq: [{ $toDouble: '$municipioIdIbge' }, { $toDouble: codigoIbge }],
          },
        },
      },

      {
        $group: {
          _id: {
            nome: '$municipioNome',
            uf: '$estadoSigla',
          },
          totalEscolas: { $sum: 1 },
          riscoMedio: { $avg: '$scoreRisco' },
        },
      },
      {
        $project: {
          _id: 0,
          totalEscolas: 1,
          riscoMedio: { $round: ['$riscoMedio', 2] },
        },
      },
    ];

    const [schoolStats] = await SchoolModel.aggregate(pipeline);

    return {
      id: school.municipioIdIbge,
      codigoIbge: school.municipioIdIbge,
      nome: school.municipioNome,
      uf: school.estadoSigla,
      ...schoolStats,
      ...(!schoolStats && {
        totalEscolas: 0,
        riscoMedio: 0,
        populacao: 0,
        estatisticasInfraestrutura: {},
      }),
    };
  }
  async findByName(name: string): Promise<Municipality | null> {
    const school = await SchoolModel.findOne({ municipioNome: name });

    if (!school) {
      return null;
    }

    const pipeline = [
      {
        $match: { municipioNome: name },
      },

      {
        $group: {
          _id: {
            codigoIbge: '$municipioIdIbge',
            nome: '$municipioNome',
          },
          uf: { $first: '$estadoSigla' },
          totalEscolas: { $sum: 1 },
          riscoMedio: { $avg: '$scoreRisco' },
        },
      },
      {
        $project: {
          _id: 0,
          id: '$_id.codigoIbge',
          codigoIbge: '$_id.codigoIbge',
          nome: '$_id.nome',
          totalEscolas: 1,
          riscoMedio: { $round: ['$riscoMedio', 2] },
        },
      },
    ];

    const [schoolStats] = await SchoolModel.aggregate(pipeline);

    return {
      id: school.municipioIdIbge,
      codigoIbge: school.municipioIdIbge,
      nome: school.municipioNome,
      uf: school.estadoSigla,
      ...schoolStats,
      ...(!schoolStats && {
        totalEscolas: 0,
        riscoMedio: 0,
        populacao: 0,
        estatisticasInfraestrutura: {},
      }),
    };
  }

  async findByUf(uf: UF): Promise<Municipality[]> {
    const pipeline: PipelineStage[] = [
      {
        $match: { estadoSigla: uf },
      },

      {
        $group: {
          _id: {
            codigoIbge: '$municipioIdIbge',
            nome: '$municipioNome',
          },
          uf: { $first: '$estadoSigla' },
          totalEscolas: { $sum: 1 },
          riscoMedio: { $avg: '$scoreRisco' },
        },
      },
      {
        $project: {
          _id: 0,
          id: '$_id.codigoIbge',
          codigoIbge: '$_id.codigoIbge',
          nome: '$_id.nome',
          totalEscolas: 1,
          riscoMedio: { $round: ['$riscoMedio', 2] },
        },
      },

      {
        $sort: { nome: 1 },
      },
    ];

    const municipality =
      await SchoolModel.aggregate<Municipality>(pipeline).exec();

    return municipality;
  }

  async findAll(): Promise<Municipality[]> {
    const pipeline: PipelineStage[] = [
      {
        $match: {
          municipioIdIbge: { $exists: true, $ne: null },

          municipioNome: { $exists: true, $ne: null },
        },
      },

      {
        $group: {
          _id: {
            codigoIbge: '$municipioIdIbge',
            nome: '$municipioNome',
          },
          uf: { $first: '$estadoSigla' },
          totalEscolas: { $sum: 1 },
          riscoMedio: { $avg: '$scoreRisco' },
        },
      },
      {
        $project: {
          _id: 0,
          id: '$_id.codigoIbge',
          codigoIbge: '$_id.codigoIbge',
          nome: '$_id.nome',
          totalEscolas: 1,
          riscoMedio: { $round: ['$riscoMedio', 2] },
        },
      },

      {
        $sort: { nome: 1 },
      },
    ];

    const municipality =
      await SchoolModel.aggregate<Municipality>(pipeline).exec();

    return municipality;
  }

  async findAllForDropdown(
    page: number,
    limit: number = 20,
    term?: string
  ): Promise<{
    municipalities: Pick<Municipality, 'id' | 'nome'>[];
    page: number;
    total: number;
    currentPage: number;
  }> {
  const skip = (page - 1) * limit;


  const matchStage: any = {
    municipioIdIbge: { $exists: true, $ne: null },
    municipioNome: { $exists: true, $ne: null },
  };

  if (term) {
    matchStage.$or = [
      { municipioNome: { $regex: term, $options: "i" } }, 
      { municipioIdIbge: { $regex: term, $options: "i" } },   
      {
        $expr: {
          $regexMatch: {
            input: { $toString: "$municipioIdIbge" },
            regex: term,
            options: "i",
          },
        },
      },
    ];
  }

  const pipeline: PipelineStage[] = [
    { $match: matchStage },
    {
      $group: {
        _id: {
          codigoIbge: "$municipioIdIbge",
          nome: "$municipioNome",
        },
      },
    },
    {
      $project: {
        _id: 0,
        id: "$_id.codigoIbge",
        nome: "$_id.nome",
      },
    },
    { $sort: { nome: 1 } },
    {
      $facet: {
        paginatedResults: [{ $skip: skip }, { $limit: limit }],
        totalCount: [{ $count: "count" }],
      },
    },
  ];

  const [result] = await SchoolModel.aggregate(pipeline).exec();

  const municipalities = result.paginatedResults;
  const total = result.totalCount[0]?.count || 0;
  const pages = Math.ceil(total / limit);

  return {
    municipalities,
    total,
    page: pages,
    currentPage: page,
  };
  }
}
