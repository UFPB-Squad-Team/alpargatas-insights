import { randomUUID } from 'node:crypto';
import { NeedStatus } from '../enums/Need/enumNeedStatus';
import { NeedType } from '../enums/Need/enumNeedType';
import { SubmitterType } from '../enums/Need/enumSubmitterType';
import { NeedValidator } from '../validators/needValidator';

/**
 * @description Interface representing a need entry.
 */
export type NeedProps = {
  title: string;

  description: string;

  type: NeedType;

  submitterType: SubmitterType;

  submitterContact?: { name?: string; email?: string };

  location?: {
    locationType: 'school' | 'municipality';
    id: string;
    name: string;
  };

  status: NeedStatus;

  createdAt?: Date;

  updatedAt?: Date;
};

export class Need {
  public readonly id: string;

  public title: string;

  public description: string;

  public type: NeedType;

  public submitterType: SubmitterType;

  public submitterContact?: { name?: string; email?: string };

  public location?: {
    locationType: 'school' | 'municipality';
    id: string;
    name: string;
  };

  public status: NeedStatus;

  public createdAt?: Date;

  public updatedAt?: Date;

  constructor(props: NeedProps, id?: string) {
    NeedValidator.validate(props);

    this.id = id ?? randomUUID();

    this.title = props.title.trim();

    this.description = props.description.trim();

    this.type = props.type;

    this.submitterType = props.submitterType;

    this.submitterContact = props.submitterContact;

    this.location = props.location;

    this.status = props.status ?? NeedStatus.PENDING;

    this.createdAt = props.createdAt;

    this.updatedAt = props.updatedAt;
  }
}
