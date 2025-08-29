import z from 'zod';
import { HighRiskSchoolUseCase } from '../../../../../application/UseCases/DashboardUseCases/HighRiskSchoolListUseCase/HighRiskSchoolUseCase';

import { Request, Response } from 'express';

export class HighRiskSchoolController {
  constructor(private highRiskSchoolUseCase: HighRiskSchoolUseCase) {}

  async getRiskSchools(req: Request, res: Response) {

    const querySchema = z.object({

      page: z.coerce.number().gt(0, { message: 'Page need be greater than 0' }),

      limit: z.coerce.number().gt(0, { message: 'Limit need be greater than 0' })

    })
    const { page, limit } = querySchema.parse(req.query);
    
    const highRiskSchools = await this.highRiskSchoolUseCase.execute({ page, limit });

    return res.status(200).json(highRiskSchools);
  }
}
