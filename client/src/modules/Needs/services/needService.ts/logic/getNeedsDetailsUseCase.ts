import { needService } from '../repositories/needRepository';

export const getNeedDetailsUseCase = {
  execute(id: string) {
    return needService.findById(id);
  },
};
