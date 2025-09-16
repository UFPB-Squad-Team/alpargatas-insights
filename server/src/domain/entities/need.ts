import { randomUUID } from "node:crypto"
import { NeedStatus } from "../enums/Need/enumNeedStatus"
import { NeedType } from "../enums/Need/enumNeedType"
import { SubmitterType } from "../enums/Need/enumSubmitterType"

/**
 * @description Interface representing a need entry.
 */
export type NeedProps = {
    id: string

    title: string

    description: string

    type: NeedType

    submitterType: SubmitterType

    submitterContact?: { name?: string, email?: string }

    location?: { locationType: 'school' | 'municipality', id: string, name: string }

    status: NeedStatus

    createdAt?: Date

    updatedAt?: Date
}

export class Need{
    public readonly id: string

    public title: string

    public description: string

    public type: NeedType

    public submitterType: SubmitterType

    public submitterContact?: { name?: string, email?: string }

    public location?: { locationType: 'school' | 'municipality', id: string, name: string }

    public status: NeedStatus
    
    public createdAt?: Date

    public updatedAt?: Date


    constructor({ title, description, type, submitterType, submitterContact, location,status, createdAt, updatedAt }: NeedProps, id?: string ){

        this.id = id ?? randomUUID()

        this.title = title.trim()

        this.description = description.trim()

        this.type = type

        this.submitterType = submitterType

        this.submitterContact = submitterContact

        this.location = location

        this.status = status ?? NeedStatus.PENDING

        this.createdAt = createdAt

        this.updatedAt = updatedAt

    }

}