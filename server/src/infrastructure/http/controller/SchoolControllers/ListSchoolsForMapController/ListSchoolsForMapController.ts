import { ListSchoolsForMapUseCase } from '../../../../../application/UseCases/SchoolUseCases/ListSchoolsForMapUseCase/ListSchoolsForMapUseCase';

import { Request, Response } from 'express';

export class ListSchoolsForMapController {
  constructor(private listSchoolsForMapUseCase: ListSchoolsForMapUseCase) {}

  async listSchoolsForMap(req: Request, res: Response) {
    const school = await this.listSchoolsForMapUseCase.execute();

    res.status(200).json(school.length > 0 ? school : []);
  }
}
