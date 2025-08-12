import { TopMunicipalitiesAverageRiskUseCase } from "../../../../../application/UseCases/DashboardUseCases/TopMunicipalitiesAverageRiskUseCase/TopMunicipalitiesAverageRiskUseCase";

import { Request, Response } from "express"

export class TopMunicipalitiesAverageRiskController{
    constructor(
        private topMunicipalitiesAverageRiskUseCase: TopMunicipalitiesAverageRiskUseCase
    ){}

    async getTopAverageRiskMunicipality(req: Request, res: Response){
        const topMunicipalitiesAverageRisk = await this.topMunicipalitiesAverageRiskUseCase.execute()

        return res.status(200).json(topMunicipalitiesAverageRisk)

    }
}