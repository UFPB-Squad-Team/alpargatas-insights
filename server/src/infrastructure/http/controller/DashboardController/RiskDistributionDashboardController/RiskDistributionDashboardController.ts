import { RiskDistributionDashboardUseCase } from '../../../../../application/UseCases/DashboardUseCases/RiskDistributionDashboardUseCase/RiskDistributionDashboardUseCase';

import { Request, Response } from 'express';

export class RiskDistributionDashboardController {
  constructor(
    private riskDistributionDashboardUseCase: RiskDistributionDashboardUseCase,
  ) {}

    /**
   * @swagger
   * /api/v1/dashboard/risk-distribution:
   *   get:
   *     summary: Obtém a distribuição de risco das escolas
   *     description: Retorna a quantidade de escolas categorizadas por nível de risco (alto, médio e baixo) baseado no score contextualizado
   *     tags:
   *       - Dashboard
   *     responses:
   *       '200':
   *         description: Distribuição de risco obtida com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 schoolsWithHighInfraestructureRisk:
   *                   type: integer
   *                   description: Número de escolas com risco alto (score >= 0.75)
   *                   example: 15
   *                 schoolsWithMediumInfraestructureRisk:
   *                   type: integer
   *                   description: Número de escolas com risco médio (score > 0.3 e <= 0.7)
   *                   example: 42
   *                 schoolsWithLowInfraestructureRisk:
   *                   type: integer
   *                   description: Número de escolas com risco baixo (score <= 0.3)
   *                   example: 23
   *       '500':
   *         description: Erro interno do servidor
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Não foi possível obter a distribuição de risco das escolas"
   */

  async getRiskDistribution(req: Request, res: Response) {
    const riskDistribution =
      await this.riskDistributionDashboardUseCase.execute();

    res.status(200).json(riskDistribution);
  }
}
