import { Municipality } from '../../../../domain/entities/municipality';

export interface TopMunicipalitiesAverageRiskDTO {
  municipalitiesWithMostSchoolsInHighRisk: Pick<
    Municipality,
    'codigoIbge' | 'nome' | 'riscoMedio' | 'totalEscolas'
  >;
}
