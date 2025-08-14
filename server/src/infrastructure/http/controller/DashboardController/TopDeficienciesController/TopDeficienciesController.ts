import { TopDeficienciesUseCase } from "../../../../../application/UseCases/DashboardUseCases/TopDeficienciesUseCase/TopDeficienciesUseCase";

import { Request, Response } from "express"

export class TopDeficienciesController{
    constructor(
        private topDeficienciesUseCase: TopDeficienciesUseCase
    ){}

    async getTopDeficienciesInSchools(req: Request, res: Response){

        const topDeficienciesInSchools = await this.topDeficienciesUseCase.execute()

        res.status(200).json(topDeficienciesInSchools)
    }
}