import { GetMunicipalityStatisticsUseCase } from '../../../../../application/UseCases/MunicipalityUseCases/GetMunicipalityStatisticsUseCase/GetMunicipalityStatisticsUseCase';
import z from 'zod';

import { Request, Response } from 'express';

export class GetMunicipalityStatisticsController {
  constructor(
    private getMunicipalityStatisticsUseCase: GetMunicipalityStatisticsUseCase,
  ) {}

   /**
   * @swagger
   * /api/v1/municipalities/{municipioIdIbge}/statistics:
   *   get:
   *     summary: Obtém estatísticas de um município específico
   *     description: Retorna o total de escolas e o risco médio de um município baseado no código IBGE
   *     tags:
   *       - Municipality
   *     parameters:
   *       - name: municipioIdIbge
   *         in: path
   *         description: Código IBGE do município (7 caracteres)
   *         required: true
   *         schema:
   *           type: string
   *           pattern: '^[0-9]{7}$'
   *           example: "2501005"
   *     responses:
   *       '200':
   *         description: Estatísticas do município obtidas com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 ibgeCode:
   *                   type: string
   *                   description: Código IBGE do município
   *                   example: "2501005"
   *                 totalSchools:
   *                   type: integer
   *                   description: Total de escolas no município
   *                   example: 15
   *                 averageRisk:
   *                   type: number
   *                   format: float
   *                   description: Risco médio das escolas do município (0 a 1)
   *                   example: 0.65
   *       '400':
   *         description: Parâmetro inválido
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Need 7 caracteres"
   *       '404':
   *         description: Município não encontrado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "No have schools registered in this municipality"
   *       '500':
   *         description: Erro interno do servidor
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Não foi possível obter as estatísticas do município"
   */

  async getStatistics(req: Request, res: Response) {
    const paramSchema = z.object({
      municipioIdIbge: z
        .string()
        .trim()
        .length(7, { message: 'Need 7 caracteres' }),
    });

    const { municipioIdIbge } = paramSchema.parse(req.params);

    const municipality = await this.getMunicipalityStatisticsUseCase.execute({
      municipioIdIbge,
    });

    res.status(200).json(municipality);
  }
}
