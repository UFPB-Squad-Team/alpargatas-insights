import { School } from '../../../../domain/entities/school';

export interface GetAllSchoolsDTO {
  page: number;
  limit: number;
  filters?: Partial<School>;
}
