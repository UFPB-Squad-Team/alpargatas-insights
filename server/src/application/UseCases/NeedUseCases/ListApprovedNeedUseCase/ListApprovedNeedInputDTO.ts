import { Need } from '../../../../domain/entities/need';

export interface ListApprovedNeedInputDTO {
  page: number;
  limit: number;
  filters?: Partial<Need>;
}
