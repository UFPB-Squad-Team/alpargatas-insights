import { Need } from "../../../../domain/entities/need";

export interface ListApprovedNeedOutputDTO{
    needs: Need[]
    page: number
    total: number
    currentPage: number
}