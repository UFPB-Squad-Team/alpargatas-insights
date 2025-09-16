import { Need } from '../../../../domain/entities/need';
import { INeedRepository } from '../../../../domain/repositories/needRepository';
import { CreateNeedInputDTO } from './CreateNeedInputDTO';
import { CreateNeedOutputDTO } from './CreateNeedOutputDTO';

/**
 * @description Use case for creating need.
 */
export class CreateNeedUseCase {
  constructor(private needRepository: INeedRepository) {}

  /**
   * @description Creates need.
   * @param props - Data required to create need.
   * @returns The created need.
   */
  async execute({
    title,
    description,
    type,
    submitterType,
    submitterContact,
    location,
    status,
  }: CreateNeedInputDTO): Promise<CreateNeedOutputDTO> {
    const need = new Need({
      title,
      description,
      type,
      submitterType,
      submitterContact,
      location,
      status,
    });

    await this.needRepository.save(need);

    return {
      id: need.id,
      title: need.title,
      description: need.description,
      type: need.type,
      submitterType: need.submitterType,
      submitterContact: need.submitterContact,
      location: need.location,
      status: need.status,
      createdAt: need.createdAt!,
      updatedAt: need.updatedAt!,
    };
  }
}
