import { CreateNeedUseCase } from '../../../../application/UseCases/NeedUseCases/CreateNeedUseCase/CreateNeedUseCase';
import { MoongoseNeedRepository } from '../../../database/repository/moongoseNeedRepository';
import { CreateNeedController } from './CreateNeedController/CreateNeedController';

const needRepository = new MoongoseNeedRepository();

const createNeedUseCase = new CreateNeedUseCase(needRepository);

export const createNeedController = new CreateNeedController(createNeedUseCase);
