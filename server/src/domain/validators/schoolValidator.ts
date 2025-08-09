import { SchoolProps } from '../entities/school';

export class SchoolValidator {
  static validate(props: SchoolProps) {
    if (!/^\d{8}$/.test(String(props.escolaIdInep))) {
      throw new Error('The Inep code need be exactly 8 numbers');
    }

    if (props.escolaNome.trim() === '') {
      throw new Error('Name must contain at least 1 character');
    }

    if (!(props.scoreRisco >= 0 && props.scoreRisco <= 1)) {
      throw new Error('Score need be between 0 and 1');
    }

    if (props.municipioNome.trim() === '') {
      throw new Error('Municipality name must contain at least 1 character');
    }
  }
}
