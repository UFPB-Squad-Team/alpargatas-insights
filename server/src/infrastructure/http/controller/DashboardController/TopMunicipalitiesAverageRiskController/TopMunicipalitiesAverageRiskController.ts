import z from 'zod';
import { TopMunicipalitiesAverageRiskUseCase } from '../../../../../application/UseCases/DashboardUseCases/TopMunicipalitiesAverageRiskUseCase/TopMunicipalitiesAverageRiskUseCase';

import { Request, Response } from 'express';
import { dependenciaAdministrativa } from '../../../../../domain/enums/enumDependenciaAdministrativa';
import { tipoLocalizacao } from '../../../../../domain/enums/enumTipoLocalizacao';

export class TopMunicipalitiesAverageRiskController {
  constructor(
    private topMunicipalitiesAverageRiskUseCase: TopMunicipalitiesAverageRiskUseCase,
  ) {}

  /**
   * @swagger
   * /api/v1/dashboard/top-municipalities-by-average-risk:
   *   get:
   *     summary: Obtém os municípios com maior risco médio e mais escolas de alto risco
   *     description: Retorna os 5 municípios com maior risco médio que possuem pelo menos 5 escolas de alto risco (score contextualizado >= 0.75)
   *     tags:
   *       - Dashboard
   *     responses:
   *       '200':
   *         description: Lista de municípios obtida com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 municipalitiesWithMostSchoolsInHighRisk:
   *                   type: array
   *                   description: Lista dos 5 municípios com maior risco médio e mais escolas de alto risco
   *                   items:
   *                     type: object
   *                     properties:
   *                       codigoIbge:
   *                         type: string
   *                         description: ID ibge do município
   *                         example: "2501005"
   *                       nome:
   *                         type: string
   *                         description: Nome do município
   *                         example: "Araruna"
   *                       riscoMedio:
   *                         type: number
   *                         description: Risco médio do município
   *                         example: 0.82
   *                       totalEscolas:
   *                         type: integer
   *                         description: Total de escolas no município
   *                         example: 15
   *       '500':
   *         description: Erro interno do servidor
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Não foi possível obter os municípios com maior risco médio"
   */
  async getTopAverageRiskMunicipality(req: Request, res: Response) {
    const querySchema = z
      .object({
        municipioIdIbge: z
          .string()
          .trim()
          .length(7, { message: 'Need  7 caracteres' })
          .optional(),
        dependenciaAdm: z.enum(dependenciaAdministrativa).optional(),
        tipoLocalizacao: z.enum(tipoLocalizacao).optional(),
      })
      .strict();

    const filters = querySchema.parse(req.query);

    const topMunicipalitiesAverageRisk =
      await this.topMunicipalitiesAverageRiskUseCase.execute(filters);

    return res.status(200).json(topMunicipalitiesAverageRisk);
  }
}
