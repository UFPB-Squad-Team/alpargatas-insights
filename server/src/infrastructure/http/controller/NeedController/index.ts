import { CreateNeedUseCase } from '../../../../application/UseCases/NeedUseCases/CreateNeedUseCase/CreateNeedUseCase';
import { ListApprovedNeedUseCase } from '../../../../application/UseCases/NeedUseCases/ListApprovedNeedUseCase/ListApprovedNeedUseCase';
import { ListNeedDetailsUseCase } from '../../../../application/UseCases/NeedUseCases/ListNeedDetailsUseCase/ListNeedDetailsUseCase';
import { MoongoseNeedRepository } from '../../../database/repository/moongoseNeedRepository';
import { CreateNeedController } from './CreateNeedController/CreateNeedController';
import { ListApprovedNeedController } from './ListApprovedNeedController/ListApprovedNeedController';
import { ListNeedDetailsController } from './ListNeedDetailsController/ListNeedDetailsController';

const needRepository = new MoongoseNeedRepository();

const createNeedUseCase = new CreateNeedUseCase(needRepository);

const listNeedApprovedUseCase = new ListApprovedNeedUseCase(needRepository);

const listNeedDetailsUseCase = new ListNeedDetailsUseCase(needRepository)

export const createNeedController = new CreateNeedController(createNeedUseCase);

export const listNeedApprovedController = new ListApprovedNeedController(
  listNeedApprovedUseCase,
);

export const listNeedDetailsController = new ListNeedDetailsController(listNeedDetailsUseCase)
