import { MunicipalitiesByRiskCountUseCase } from '../../../../../application/UseCases/DashboardUseCases/MunicipalitiesByRiskCountUseCase/MunicipalitiesByRiskCountUseCase';

import { Request, Response } from 'express';

export class MunicipalitiesByRiskCountController {
  constructor(
    private municipalitiesByRiskCountUseCase: MunicipalitiesByRiskCountUseCase,
  ) {}

  /**
   * @swagger
   * /api/v1/dashboard/municipalities-by-risk-count:
   *   get:
   *     summary: Obtém os municípios com maior número de escolas de alto risco
   *     description: Retorna os 10 municípios com mais escolas com score de risco contextualizado superior a 0.75, ordenados por quantidade
   *     tags:
   *       - Dashboard
   *     responses:
   *       '200':
   *         description: Lista de municípios com escolas de alto risco obtida com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 schoolsWithHighRiskPerMunicipality:
   *                   type: array
   *                   description: Lista dos 10 municípios com mais escolas de alto risco
   *                   items:
   *                     type: object
   *                     properties:
   *                       idIbge:
   *                         type: string
   *                         description: Código IBGE do município
   *                         example: "2501005"
   *                       name:
   *                         type: string
   *                         description: Nome do município
   *                         example: "Araruna"
   *                       schoolCount:
   *                         type: integer
   *                         description: Número de escolas de alto risco no município
   *                         example: 8
   *       '500':
   *         description: Erro interno do servidor
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Não foi possível obter os dados dos municípios com escolas de alto risco"
   */

  async getMunicipalitiesWithMostRiskSchools(req: Request, res: Response) {
    const municipalitiesWithMostRiskSchools =
      await this.municipalitiesByRiskCountUseCase.execute();

    res.status(200).json(municipalitiesWithMostRiskSchools);
  }
}
