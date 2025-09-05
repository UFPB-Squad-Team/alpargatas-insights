import { IFeedback } from '../../../../domain/entities/Feedback';
import { FeedbackStatus } from '../../../../domain/enums/Feedback/enumFeedbackStatus';
import { FeedbackType } from '../../../../domain/enums/Feedback/enumFeedbackType';
import { IFeedbackRepository } from '../../../../domain/repositories/feedbackRepository';
import { AppError } from '../../../../shared/utils/errors/appError';
import {
  ICreateFeedbackInputDTO,
  ICreateFeedbackOutputDTO,
} from './DTOs/CreateFeedbackUseCase';

/**
 * @description Use case for creating feedback.
 */
export class CreateFeedbackUseCase {
  constructor(private feedbackRepository: IFeedbackRepository) {}

  /**
   * @description Creates feedback.
   * @param data - Data required to create feedback.
   * @returns The created feedback.
   */
  public async execute(
    data: ICreateFeedbackInputDTO,
  ): Promise<ICreateFeedbackOutputDTO> {
    CreateFeedbackUseCase._validateData(data);

    const feedbackToSave: IFeedback = {
      message: data.message,
      type: data.type,
      page: data.page,
      status: FeedbackStatus.NEW,
    };

    const createdFeedback = await this.feedbackRepository.save(feedbackToSave);

    return {
      id: createdFeedback.id!,
      message: createdFeedback.message,
      type: createdFeedback.type,
      status: createdFeedback.status,
      createdAt: createdFeedback.createdAt!,
    };
  }

  /**
   *
   * @param props - Partial feedback data to validate.
   * @throws Will throw an error if validation fails.
   */
  private static _validateData(props: Partial<IFeedback>) {
    {
      if (!props.message || props.message.trim().length < 10) {
        throw new AppError(
          'The feedback message must be at least 10 characters long.',
        );
      }

      if (!props.type || !Object.values(FeedbackType).includes(props.type)) {
        throw new AppError('The feedback type is invalid.');
      }
    }
  }
}
