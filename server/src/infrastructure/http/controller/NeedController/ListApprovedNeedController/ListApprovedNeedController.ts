import z from 'zod';
import { ListApprovedNeedUseCase } from '../../../../../application/UseCases/NeedUseCases/ListApprovedNeedUseCase/ListApprovedNeedUseCase';

import { Request, Response } from 'express';
import { NeedType } from '../../../../../domain/enums/Need/enumNeedType';
import { SubmitterType } from '../../../../../domain/enums/Need/enumSubmitterType';

export class ListApprovedNeedController {
  constructor(private listApprovedNeedUseCase: ListApprovedNeedUseCase) {}

  async listApprovedNeeds(req: Request, res: Response) {
    const querySchema = z.object({
      page: z.coerce.number().gt(0, { message: 'Page need be greater than 0' }),
      limit: z.coerce
        .number()
        .gt(0, { message: 'Limit need be greater than 0' }),
      type: z.enum(NeedType).optional(),
      submitterType: z.enum(SubmitterType).optional(),
    });

    const { page, limit, ...filters } = querySchema.parse(req.query);

    const listApprovedNeedUseCase = await this.listApprovedNeedUseCase.execute({
      page,
      limit,
      filters,
    });

    res.status(200).json(listApprovedNeedUseCase);
  }
}
