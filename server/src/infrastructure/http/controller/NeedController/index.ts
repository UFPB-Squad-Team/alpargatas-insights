import { CreateNeedUseCase } from '../../../../application/UseCases/NeedUseCases/CreateNeedUseCase/CreateNeedUseCase';
import { ListApprovedNeedUseCase } from '../../../../application/UseCases/NeedUseCases/ListApprovedNeedUseCase/ListApprovedNeedUseCase';
import { MoongoseNeedRepository } from '../../../database/repository/moongoseNeedRepository';
import { CreateNeedController } from './CreateNeedController/CreateNeedController';
import { ListApprovedNeedController } from './ListApprovedNeedController/ListApprovedNeedController';

const needRepository = new MoongoseNeedRepository();

const createNeedUseCase = new CreateNeedUseCase(needRepository);

const listNeedApprovedUseCase = new ListApprovedNeedUseCase(needRepository);

export const createNeedController = new CreateNeedController(createNeedUseCase);

export const listNeedApprovedController = new ListApprovedNeedController(
  listNeedApprovedUseCase,
);
