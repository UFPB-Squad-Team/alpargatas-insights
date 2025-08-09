import z from 'zod';
import { SearchSchoolsUseCase } from '../../../../../application/UseCases/SchoolUseCases/SearchSchoolsUseCase/SearchSchoolsUseCase';

import { Request, Response } from 'express';

export class SearchSchoolsController {
  constructor(private searchSchoolsUseCase: SearchSchoolsUseCase) {}

  async searchSchools(req: Request, res: Response) {
    const querySchema = z.object({
      term: z.string().min(1, { message: 'Term need min 1 caracter' }),
      page: z.number().gt(0, { message: 'Page need be greater than 0' }),
      limit: z.number().gt(0, { message: 'Limit need be greater than 0' }),
    });

    const { term, page, limit } = querySchema.parse(req.query)

    const searchResult = await this.searchSchoolsUseCase.execute({ term, page, limit })

    res.status(200).json(searchResult)
  }
}
