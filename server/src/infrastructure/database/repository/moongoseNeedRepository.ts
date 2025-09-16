import { Need } from '../../../domain/entities/need';
import { NeedStatus } from '../../../domain/enums/Need/enumNeedStatus';
import { INeedRepository } from '../../../domain/repositories/needRepository';
import { NeedModel } from '../../configs/models/moongoseNeedModel';
import { NeedMapper } from '../../mapper/needMapper';

/**
 * @implements INeedRepository
 * @description Mongoose implementation of the Need repository.
 *
 * @method listApproved - Get needs with status 'Approved' and pagination and filters
 * @method save - Saves a need entry to the database.
 */

export class MoongoseNeedRepository implements INeedRepository {
  async listApproved(
    page: number,
    limit: number = 20,
    filters?: Partial<Need>,
  ): Promise<{
    needs: Need[];
    page: number;
    total: number;
    currentPage: number;
  }> {
    const skip = (page - 1) * limit;

    const matchStage: any = { status: { $regex: 'approved', $options: 'i' } };

    const aggregationPipeline: any[] = [];

    if (filters?.type) {
      matchStage.type = filters.type;
    }

    if (filters?.submitterType) {
      matchStage.submitterType = filters.submitterType;
    }

    aggregationPipeline.push({ $match: matchStage });

    if (Object.keys(matchStage).length > 0) {
      aggregationPipeline.push({ $match: matchStage });
    }

    aggregationPipeline.push({
      $facet: {
        paginatedResults: [
          { $sort: { title: 1 } },
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              _id: 0,
              id: { $toString: '$_id' },
              title: 1,
              description: 1,
              type: 1,
              submitterType: 1,
              submitterContact: 1,
              location: 1,
              status: 1,
            },
          },
        ],
        totalCount: [{ $count: 'count' }],
      },
    });

    const [result] = await NeedModel.aggregate(aggregationPipeline);

    const needs = result.paginatedResults;
    const total = result.totalCount[0]?.count || 0;
    const pages = Math.ceil(total / limit);

    return {
      needs,
      page: pages,
      total,
      currentPage: page,
    };
  }

  async save(need: Need): Promise<Need> {
    const newNeed = await NeedModel.create(need);

    return NeedMapper.toDomain(newNeed);
  }
}
