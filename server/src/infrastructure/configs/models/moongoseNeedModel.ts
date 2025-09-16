import { model, Schema, Types, Document } from 'mongoose';
import { NeedType } from '../../../domain/enums/Need/enumNeedType';
import { SubmitterType } from '../../../domain/enums/Need/enumSubmitterType';
import { NeedStatus } from '../../../domain/enums/Need/enumNeedStatus';

/**
 * @description Mongoose schema and model for Need.
 */

export interface INeedDocument extends Document {
  _id: Types.ObjectId;

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
}
const needSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: Object.values(NeedType), required: true },
    submitterType: {
      type: String,
      enum: Object.values(SubmitterType),
      required: true,
    },
    submitterContact: {
      name: { type: String, required: false },
      email: { type: String, required: false },
    },

    location: {
      locationType: {
        type: String,
        enum: ['school', 'municipality'],
        required: false,
      },
      id: { type: String, required: false },
      name: { type: String, required: false },
    },
    status: {
      type: String,
      enum: Object.values(NeedStatus),
      default: NeedStatus.PENDING,
      required: true,
    },
  },
  { timestamps: true },
);

export const NeedModel = model<INeedDocument>('Need', needSchema);
