import z from 'zod';
import { GetMunicipalityWithIbgeCodeUseCase } from '../../../../../application/UseCases/MunicipalityUseCases/GetMunicipalityWithIbgeCodeUseCase/GetMunicipalityWithIbgeCodeUseCase';

import { Request, Response } from 'express';

export class GetMunicipalityWithIbgeCodeController {
  constructor(
    private getMunicipalityWithIbgeCodeUseCase: GetMunicipalityWithIbgeCodeUseCase,
  ) {}

  /**
   * @swagger
   * /api/v1/municipalities/{codigoIbge}:
   *   get:
   *     summary: Obtém todos os dados de um município pelo código IBGE
   *     description: Retorna todas as informações de um município específico baseado no código IBGE
   *     tags:
   *       - Municipality
   *     parameters:
   *       - name: codigoIbge
   *         in: path
   *         description: Código IBGE do município (7 caracteres)
   *         required: true
   *         schema:
   *           type: string
   *           pattern: '^[0-9]{7}$'
   *           example: "2501005"
   *     responses:
   *       '200':
   *         description: Município encontrado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               oneOf:
   *                 - type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                       description: ID do município
   *                       example: "2501005"
   *                     nome:
   *                       type: string
   *                       description: Nome do município
   *                       example: "Araruna"
   *                     estadoSigla:
   *                       type: string
   *                       description: Sigla do estado
   *                       example: "PB"
   *                     riscoMedio:
   *                       type: number
   *                       description: Risco médio do município
   *                       example: 0.68
   *                     totalEscolas:
   *                       type: integer
   *                       description: Total de escolas no município
   *                       example: 15
   *
   *                 - type: string
   *                   example: "No have a municipality with this code"
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
   *       '500':
   *         description: Erro interno do servidor
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Não foi possível obter os dados do município"
   */

  async getMunicipalityWithIbgeCode(req: Request, res: Response) {
    const paramSchema = z.object({
      codigoIbge: z
        .string()
        .trim()
        .length(7, { message: 'Need  7 caracteres' }),
    });

    const { codigoIbge } = paramSchema.parse(req.params);

    const municipality = await this.getMunicipalityWithIbgeCodeUseCase.execute({
      codigoIbge,
    });

    res.status(200).json(municipality);
  }
}
