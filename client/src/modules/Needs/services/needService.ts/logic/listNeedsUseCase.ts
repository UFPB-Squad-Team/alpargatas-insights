import { needService } from '../repositories/needRepository';

export const listNeedsUseCase = {
  execute(params: Parameters<typeof needService.listApproved>[0]) {
    return needService.listApproved(params);
  },
};
