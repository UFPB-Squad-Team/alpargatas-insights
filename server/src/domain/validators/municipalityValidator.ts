import { MunicipalityProps } from '../entities/municipality';

export class MunicipalityValidator {
  static validate(props: MunicipalityProps) {
    // Esse é um regex que verifica se contem 7 números
    if (!/^\d{7}$/.test(String(props.codigoIbge))) {
      throw new Error('IBGE code need 7 numbers');
    }

    if (props.nome.trim() === '') {
      throw new Error('Name need at least 1 caracteres');
    }

    if (props.totalEscolas < 0) {
      throw new Error('No can be a negative number');
    }
  }
}
