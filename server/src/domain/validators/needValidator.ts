import { AppError } from "../../shared/utils/errors/appError";
import { NeedProps } from "../entities/need";
import { NeedStatus } from "../enums/Need/enumNeedStatus";
import { NeedType } from "../enums/Need/enumNeedType";
import { SubmitterType } from "../enums/Need/enumSubmitterType";

export class NeedValidator{
    static validate(props: NeedProps){
        if(!props.title || props.title.trim() === ''){
            throw new AppError('Title is required and need at least 1 character')
        }

        if(!props.description || props.description.trim() === ''){
            throw new AppError('Description is required and need at least 1 character')
        }

        if(!Object.values(NeedType).includes(props.type)){
            throw new AppError(`Invalid type, must be one of this ${Object.values(NeedType).join('')}`)
        }

        if(!Object.values(NeedStatus).includes(props.status)){
            throw new AppError(`Invalid type, must be one of this ${Object.values(NeedStatus).join('')}`)
        }

        if(!Object.values(SubmitterType).includes(props.submitterType)){
            throw new AppError(`Invalid type, must be one of this ${Object.values(SubmitterType).join('')}`)
        }
    }
}