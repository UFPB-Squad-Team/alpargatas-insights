import { GetAllSchoolsUseCase } from '../../../../../application/UseCases/SchoolUseCases/GetAllSchoolsUseCase/GetAllSchoolsUseCase';

import { Request, Response } from 'express';

export class GetAllSchoolsController {
  constructor(private getAllSchoolsUseCase: GetAllSchoolsUseCase) {}

  async getAll(req: Request, res: Response) {
    const school = await this.getAllSchoolsUseCase.execute();

    res.status(200).json(school.length > 0 ? school : [])
    }
}
