import { Need } from "../entities/need";

export interface INeedRepository{
    listApproved(page: number, limit: number, filters?: Partial<Need>): Promise<{
        needs: Need[],
        page: number,
        total: number,
        currentPage: number
    }>
    save(need: Need): Promise<Need>
    
}