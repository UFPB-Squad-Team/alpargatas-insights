import { GetMunicipalityStatisticsUseCase } from '../../../../../application/UseCases/MunicipalityUseCases/GetMunicipalityStatisticsUseCase/GetMunicipalityStatisticsUseCase';
import z from 'zod';

import { Request, Response } from 'express';

export class GetMunicipalityStatisticsController {
  constructor(
    private getMunicipalityStatisticsUseCase: GetMunicipalityStatisticsUseCase,
  ) {}

  async getStatistics(req: Request, res: Response) {
    const paramSchema = z.object({
      municipioIdIbge: z
        .string()
        .trim()
        .length(7, { message: 'Need 7 caracteres' }),
    });

    const { municipioIdIbge } = paramSchema.parse(req.params);

    const municipality = await this.getMunicipalityStatisticsUseCase.execute({
      municipioIdIbge,
    });

    res.status(200).json(municipality);
  }
}
