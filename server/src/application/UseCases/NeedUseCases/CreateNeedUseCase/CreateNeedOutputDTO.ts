import { NeedStatus } from "../../../../domain/enums/Need/enumNeedStatus"
import { NeedType } from "../../../../domain/enums/Need/enumNeedType"
import { SubmitterType } from "../../../../domain/enums/Need/enumSubmitterType"

/**
 * @description DTO for output after creating need.
 */
export interface CreateNeedOutputDTO{

        id: string

        title: string
    
        description: string
    
        type: NeedType
    
        submitterType: SubmitterType
    
        submitterContact?: { name?: string, email?: string }
    
        location?: { locationType: 'school' | 'municipality', id: string, name: string }
    
        status: NeedStatus

        createdAt: Date

        updatedAt: Date
}