import { needService } from '../repositories/needRepository';

export const createNeedUseCase = {
  execute(payload: Parameters<typeof needService.create>[0]) {
    return needService.create(payload);
  },
};
