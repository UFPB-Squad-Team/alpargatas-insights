import { GetDashboardKPIsUseCase } from '../../../../../application/UseCases/DashboardUseCases/GetDashboardKPIsUseCase/GetDashboardKPIsUseCase';

import { Request, Response } from 'express';

export class GetDashboardKPIsController {
  constructor(private getDashboardKPIsUseCase: GetDashboardKPIsUseCase) {}

  async getKpis(req: Request, res: Response) {
    const getKpis = await this.getDashboardKPIsUseCase.execute();

    res.status(200).json(getKpis);
  }
}
