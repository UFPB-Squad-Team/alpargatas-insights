import z from 'zod';
import { Request, Response } from 'express';
import { CreateFeedbackUseCase } from '../../../../../application/UseCases/Feedback/CreateFeedbackUseCase/CreateFeedbackUseCase';
import { FeedbackType } from '../../../../../domain/enums/Feedback/enumFeedbackType';

/**
 * @description Controller for creating feedback.
 * @route POST /feedback
 * @body {string} message - The feedback message.
 * @body {FeedbackType} type - The type of feedback.
 * @body {string} [page] - The page where the feedback was given.
 */
export class CreateFeedbackController {
  constructor(private createFeedbackUseCase: CreateFeedbackUseCase) {}

  /**
   * @swagger
   * /api/v1/feedback:
   *   post:
   *     summary: Register a new user feedback.
   *     description: Creates a new feedback entry in the system based on the data sent by the user. Used by the floating feedback button on the platform.
   *     tags:
   *       - Feedback
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - message
   *               - type
   *             properties:
   *               message:
   *                 type: string
   *                 description: The content of the feedback message. Must have at least 10 characters.
   *                 example: "I found the map visualization of municipalities a bit slow on my phone."
   *               type:
   *                 type: string
   *                 description: The feedback category.
   *                 enum: [bug, suggestion, praise, other]
   *                 example: "suggestion"
   *               page:
   *                 type: string
   *                 description: (Optional) The URL of the page from where the feedback was submitted.
   *                 example: "/schools/25125710"
   *     responses:
   *       '201':
   *         description: Feedback successfully created.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                   example: "64f7b4b3a1b2c3d4e5f6a7b8"
   *                 message:
   *                   type: string
   *                   example: "I found the map visualization of municipalities a bit slow on my phone."
   *                 type:
   *                   type: string
   *                   example: "suggestion"
   *                 status:
   *                   type: string
   *                   example: "new"
   *                 page:
   *                   type: string
   *                   example: "/schools/25125710"
   *                 createdAt:
   *                   type: string
   *                   format: date-time
   *                   example: "2025-09-05T12:30:00.000Z"
   *       '400':
   *         description: Validation error. The submitted data is invalid.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "The feedback message must have at least 10 characters."
   *       '500':
   *         description: Internal server error.
   */
  async handle(req: Request, res: Response): Promise<Response> {
    const bodySchema = z.object({
      message: z.string(),
      type: z.enum(FeedbackType),
      page: z.string().optional(),
    });

    const validatedBody = bodySchema.parse(req.body);

    const feedback = await this.createFeedbackUseCase.execute(validatedBody);

    return res.status(201).json(feedback);
  }
}
