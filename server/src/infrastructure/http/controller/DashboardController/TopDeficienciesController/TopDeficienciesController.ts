import z from 'zod';
import { TopDeficienciesUseCase } from '../../../../../application/UseCases/DashboardUseCases/TopDeficienciesUseCase/TopDeficienciesUseCase';

import { Request, Response } from 'express';
import { dependenciaAdministrativa } from '../../../../../domain/enums/enumDependenciaAdministrativa';
import { tipoLocalizacao } from '../../../../../domain/enums/enumTipoLocalizacao';

export class TopDeficienciesController {
  constructor(private topDeficienciesUseCase: TopDeficienciesUseCase) {}

  /**
   * @swagger
   * /api/v1/dashboard/top-deficiencies:
   *   get:
   *     summary: Obtém as principais deficiências nas escolas de alto risco
   *     description: Retorna as deficiências mais comuns nas escolas com score de risco superior a 0.75, ordenadas por frequência
   *     tags:
   *       - Dashboard
   *     responses:
   *       '200':
   *         description: Lista de deficiências obtida com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 topDeficiencies:
   *                   type: array
   *                   description: Lista das deficiências mais comuns em escolas de alto risco
   *                   items:
   *                     type: object
   *                     properties:
   *                       deficit:
   *                         type: string
   *                         description: Nome da deficiência formatada
   *                         example: "possui_biblioteca"
   *                       schools:
   *                         type: integer
   *                         description: Número de escolas que possuem esta deficiência
   *                         example: 25
   *       '500':
   *         description: Erro interno do servidor
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Não foi possível obter as deficiências das escolas"
   */

  async getTopDeficienciesInSchools(req: Request, res: Response) {

    const querySchema = z.object({
      municipioIdIbge: z.string().trim().length(7, { message: 'Need  7 caracteres' }).optional(),
      dependenciaAdm: z.enum(dependenciaAdministrativa).optional(),
      tipoLocalizacao: z.enum(tipoLocalizacao).optional()
    }).strict()

    const filters = querySchema.parse(req.query)

    const topDeficienciesInSchools =
      await this.topDeficienciesUseCase.execute(filters);

    res.status(200).json(topDeficienciesInSchools);
  }
}
