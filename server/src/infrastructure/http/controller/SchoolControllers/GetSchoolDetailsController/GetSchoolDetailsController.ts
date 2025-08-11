import { GetSchoolDetailsUseCase } from '../../../../../application/UseCases/SchoolUseCases/GetSchoolDetailsUseCase/GetSchoolDetailsUseCase';
import z from 'zod';
import { Request, Response } from 'express';
import { Types } from 'mongoose';

export class GetSchoolDetailsController {
  constructor(private getSchoolDetailsUseCase: GetSchoolDetailsUseCase) {}

  async getDetails(req: Request, res: Response) {
    const paramSchema = z.object({
      id: z.string().refine((val) => Types.ObjectId.isValid(val), {
        message: 'Invalid MongoDB ObjectId',
      }),
    });

    const { id } = paramSchema.parse(req.params);

    const details = await this.getSchoolDetailsUseCase.execute({ id });

    res.status(200).json(details);
  }
}
