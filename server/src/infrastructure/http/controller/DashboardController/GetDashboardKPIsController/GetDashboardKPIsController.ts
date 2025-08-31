import { GetDashboardKPIsUseCase } from '../../../../../application/UseCases/DashboardUseCases/GetDashboardKPIsUseCase/GetDashboardKPIsUseCase';

import { Request, Response } from 'express';

export class GetDashboardKPIsController {
  constructor(private getDashboardKPIsUseCase: GetDashboardKPIsUseCase) {}
  /**
   * @swagger
   * /dashboard/kpis:
   *   get:
   *     summary: Obtém os principais indicadores de desempenho (KPIs) para o dashboard.
   *     description: >
   *       Este endpoint retorna uma coleção de KPIs essenciais, como total de escolas,
   *       maior dependencia estrutural e outras métricas relevantes para o dashboard.
   *     tags:
   *       - Dashboard
   *     responses:
   *       '200':
   *         description: KPIs obtidos com sucesso.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 totalSchools:
   *                   type: integer
   *                   example: 150
   *                 totalSchoolsInHighRisk:
   *                   type: integer
   *                   example: 10
   *                 municipalityWithMostSchoolsInHighRisk:
   *                   type: object
   *                   properties:
   *                     idIbge:
   *                       type: string
   *                     name:
   *                       type: string
   *                     averageRisk:
   *                       type: number
   *                     schoolsCount:
   *                       type: integer
   *                   example:
   *                     idIbge: "2304400"
   *                     name: "Gado Bravo"
   *                     averageRisk: 0.85
   *                     schoolsCount: 5
   *                 topDeficienciesLackName:
   *                   type: string
   *                   example: "possui_livros"
   *       '500':
   *         description: Erro interno do servidor.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Não foi possível obter os dados do dashboard."
   */
  async getKpis(req: Request, res: Response) {
    const getKpis = await this.getDashboardKPIsUseCase.execute();

    res.status(200).json(getKpis);
  }
}
