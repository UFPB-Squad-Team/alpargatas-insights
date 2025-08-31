import { GetSchoolDetailsUseCase } from '../../../../../application/UseCases/SchoolUseCases/GetSchoolDetailsUseCase/GetSchoolDetailsUseCase';
import z from 'zod';
import { Request, Response } from 'express';
import { Types } from 'mongoose';

export class GetSchoolDetailsController {
  constructor(private getSchoolDetailsUseCase: GetSchoolDetailsUseCase) {}

  /**
   * @swagger
   * /schools/{id}:
   *   get:
   *     summary: Obtém os principais indicadores da escola selecionada.
   *     description: >
   *       Este endpoint retorna uma os indicadores de uma escola.
   *     tags:
   *       - School
   *     parameters:
   *       - name: id
   *         in: path
   *         description: Id especifíco da escola
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       '200':
   *         description: Escola obtida com sucesso.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                       id:
   *                         type: string
   *                         example: "689ea6a3907a03b7b821a66f"
   *                       municipioIdIbge:
   *                         type: integer
   *                         example: 2501005
   *                       escolaIdInep:
   *                         type: integer
   *                         example: 25125710
   *                       escolaNome:
   *                         type: string
   *                         example: "EMEF MANOEL FRANCISCO MARTINIANO"
   *                       municipioNome:
   *                         type: string
   *                         example: "Araruna"
   *                       estadoSigla:
   *                         type: string
   *                         example: "PB"
   *                       dependenciaAdm:
   *                         type: string
   *                         example: "Municipal"
   *                       tipoLocalizacao:
   *                         type: string
   *                         example: "Rural"
   *                       localizacao:
   *                         type: object
   *                         properties:
   *                           coordinates:
   *                             type: array
   *                             items:
   *                               type: number
   *                             example: [-35.76372927005763, -6.565843414933229]
   *                           type:
   *                             type: string
   *                             example: "Point"
   *                       scoreRisco:
   *                         type: number
   *                         example: 0.55
   *                       scoreRiscoContextualizado:
   *                         type: number
   *                         example: 0.55
   *                       indicadores:
   *                         type: object
   *                         properties:
   *                           total_alunos:
   *                             type: integer
   *                             example: 17
   *                       infraestrutura:
   *                         type: object
   *                         properties:
   *                           possui_acessibilidade_pcd:
   *                             type: boolean
   *                             example: true
   *                           possui_agua_potavel:
   *                             type: boolean
   *                             example: true
   *                           possui_biblioteca:
   *                             type: boolean
   *                             example: false
   *                           possui_energia_publica:
   *                             type: boolean
   *                             example: true
   *                           possui_internet:
   *                             type: boolean
   *                             example: true
   *                           possui_quadra_esportes:
   *                             type: boolean
   *                             example: false
   *                           possui_saneamento_basico:
   *                             type: boolean
   *                             example: false
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
  async getDetails(req: Request, res: Response) {
    const paramSchema = z.object({
      id: z.string().refine((val) => Types.ObjectId.isValid(val), {
        message: 'Invalid MongoDB ObjectId',
      }),
    });

    const { id } = paramSchema.parse(req.params);

    const details = await this.getSchoolDetailsUseCase.execute({ id });

    res.status(200).json(details);
  }
}
