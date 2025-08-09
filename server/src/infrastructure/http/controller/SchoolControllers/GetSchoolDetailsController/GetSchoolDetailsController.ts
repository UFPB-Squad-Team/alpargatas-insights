import { GetSchoolDetailsUseCase } from '../../../../../application/UseCases/SchoolUseCases/GetSchoolDetailsUseCase/GetSchoolDetailsUseCase';

import z from 'zod';

import { Request, Response } from 'express';

export class GetSchoolDetailsController {
  constructor(private getSchoolDetailsUseCase: GetSchoolDetailsUseCase) {}

  async getDetails(req: Request, res: Response) {
    const paramSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramSchema.parse(req.params);

    const details = await this.getSchoolDetailsUseCase.execute({ id });

    res.status(200).json(details)
  }
}
