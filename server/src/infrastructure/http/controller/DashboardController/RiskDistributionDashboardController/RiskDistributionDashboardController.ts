import { RiskDistributionDashboardUseCase } from "../../../../../application/UseCases/DashboardUseCases/RiskDistributionDashboardUseCase/RiskDistributionDashboardUseCase";

import { Request, Response } from "express"

export class RiskDistributionDashboardController{
    constructor(
        private riskDistributionDashboardUseCase: RiskDistributionDashboardUseCase
    ){}

    async getRiskDistribution(req: Request, res: Response){

        const riskDistribution = await this.riskDistributionDashboardUseCase.execute()

        res.status(200).json(riskDistribution)
    }
}