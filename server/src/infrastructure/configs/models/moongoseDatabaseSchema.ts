import mongoose, { Schema, Document, Types } from 'mongoose';
import { UF } from '../../../domain/enums/enumUnidadesFederativas';
import { dependenciaAdministrativa } from '../../../domain/enums/enumDependenciaAdministrativa';
import { tipoLocalizacao } from '../../../domain/enums/enumTipoLocalizacao';
import { LocationCoordinates } from '../../../domain/entities/school';
import { randomUUID } from 'node:crypto';

export interface ISchoolDocument extends Document {
  _id: Types.ObjectId;
  municipioIdIbge: string;
  escolaIdInep: number;
  escolaNome: string;
  municipioNome: string;
  estadoSigla: UF;
  dependenciaAdm: dependenciaAdministrativa;
  tipoLocalizacao: tipoLocalizacao;
  localizacao: {
    type: string;
    coordinates: LocationCoordinates;
  };
  scoreRisco: number;
  indicadores: {
    total_alunos: number;
  };
  infraestrutura: Record<string, boolean>;
}

const schoolSchema: Schema = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true },
  municipioIdIbge: { type: String, required: true },
  escolaIdInep: { type: Number, required: true },
  escolaNome: { type: String, required: true },
  municipioNome: { type: String, required: true },
  estadoSigla: { type: String, enum: Object.values(UF), required: true },
  dependenciaAdm: {
    type: String,
    enum: Object.values(dependenciaAdministrativa),
    required: true,
  },
  tipoLocalizacao: {
    type: String,
    enum: Object.values(tipoLocalizacao),
    required: true,
  },
  localizacao: {
    type: { type: String, required: true },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: (coords: [number, number]) => coords.length === 2,
        message: 'Coordinates need two numbers',
      },
    },
  },
  scoreRisco: { type: Number, required: true },
  indicadores: {
    total_alunos: { type: Number, required: true },
  },
  infraestrutura: { type: Map, of: Boolean, default: {} },
});

schoolSchema.index({ localizacao: '2dsphere' });
schoolSchema.index({ escolaIdInep: 1 }, { unique: true });

schoolSchema.index({ escolaNome: 'text', municipioNome: 'text' });
schoolSchema.index({ estadoSigla: 1 });
schoolSchema.index({ dependenciaAdm: 1 });
schoolSchema.index({ municipioIdIbge: 1 });
schoolSchema.index({ scoreRisco: 1 });

export const SchoolModel = mongoose.model<ISchoolDocument>(
  'School',
  schoolSchema,
);
