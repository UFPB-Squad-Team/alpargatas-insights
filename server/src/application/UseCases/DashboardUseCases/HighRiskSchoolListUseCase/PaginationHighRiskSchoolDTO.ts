import { School } from "../../../../domain/entities/school";

export interface PaginationHighRiskSchoolDTO {
  filters?: Partial<School>
  page: number;
  limit: number;
}
