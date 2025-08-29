import { MunicipalityRisk } from '@/domain/entities/Municipality/Municipality';
import { apiClient } from '@/shared/lib/axios';
import { mapMunicipalityRiskFromApiToDomain } from '@/shared/services/Municipality/repositories/mappers/municipalityMapper';
import { mapSchoolFromApiToDomain } from '@/shared/services/Schools/repositories/mappers/schoolMapper';
import {
  HighRiskSchool,
  HighRiskSchoolsApiResponse,
  TopMunicipalitiesApiResponse,
} from '../types/Municipality/MunicipalitiesTypes';
import {
  RiskDistribution,
  RiskDistributionFromApi,
} from '../types/School/SchoolTypes';
import {
  Deficiency,
  TopDeficienciesApiResponse,
} from '../types/School/DeficiencyTypes';
import { mapDeficiencyFromApiToDomain } from './mappers/deficiencyMapper';

type DashboardKpisFromApi = {
  schools: number;
  schoolsWithHighInfraestructureRisk: number;
  municipalitiesWithMostAverageRisk: {
    idIbge: string;
    name: string;
    averageRisk: number;
    schoolsCount: number;
    municipioSomaProjetos: number;
  };
  lackName: string;
  bestMunicipalityOpportunity: string;
};

export type DashboardKpis = {
  totalEscolas: number;
  escolasAltoRisco: number;
  municipioMaiorRisco: string;
  principalCarencia: string;
  municipioOportunidade: string;
};

const mapKpisFromApiToDomain = (
  apiData: DashboardKpisFromApi,
): DashboardKpis => {
  return {
    totalEscolas: apiData.schools,
    escolasAltoRisco: apiData.schoolsWithHighInfraestructureRisk,
    municipioMaiorRisco: apiData.municipalitiesWithMostAverageRisk.name,
    principalCarencia: apiData.lackName
      .replace('possui_', '')
      .replace(/_/g, ' '),
    municipioOportunidade: apiData.bestMunicipalityOpportunity,
  };
};

const getKpis = async (): Promise<DashboardKpis> => {
  try {
    const { data } = await apiClient.get<DashboardKpisFromApi>(
      '/api/v1/dashboard/kpis',
    );
    return mapKpisFromApiToDomain(data);
  } catch (error) {
    console.error('Erro no repositório ao buscar KPIs:', error);
    throw error;
  }
};

const getHighRiskSchools = async (): Promise<HighRiskSchool[]> => {
  try {
    const { data } = await apiClient.get<HighRiskSchoolsApiResponse>(
      '/api/v1/dashboard/high-risk-schools',
    );

    const schoolsFromApi = data.schoolsWithHighInfraestructureRisk || [];

    return schoolsFromApi.map(mapSchoolFromApiToDomain);
  } catch (error) {
    console.error(
      'Erro no repositório ao buscar escolas de alto risco:',
      error,
    );
    throw error;
  }
};

const getTopMunicipalitiesByRisk = async (): Promise<MunicipalityRisk[]> => {
  try {
    const { data } = await apiClient.get<TopMunicipalitiesApiResponse>(
      '/api/v1/dashboard/top-municipalities-by-risk',
    );

    const municipalitiesFromApi =
      data.municipalitiesWithMostSchoolsInHighRisk || [];

    return municipalitiesFromApi.map(mapMunicipalityRiskFromApiToDomain);
  } catch (error) {
    console.error('Erro no repositório ao buscar top municípios:', error);
    throw error;
  }
};

const mapRiskDistributionFromApiToDomain = (
  apiData: RiskDistributionFromApi,
): RiskDistribution[] => {
  return [
    {
      faixa: 'Alto Risco',
      quantidade: apiData.schoolsWithHighInfraestructureRisk,
      cor: '#D97706',
    },
    {
      faixa: 'Risco Moderado',
      quantidade: apiData.schoolsWithMediumInfraestructureRisk,
      cor: '#B45309',
    },
    {
      faixa: 'Baixo Risco',
      quantidade: apiData.schoolsWithLowInfraestructureRisk,
      cor: '#9CA3AF',
    },
  ];
};

const getRiskDistribution = async (): Promise<RiskDistribution[]> => {
  try {
    const { data } = await apiClient.get<RiskDistributionFromApi>(
      '/api/v1/dashboard/risk-distribution',
    );
    return mapRiskDistributionFromApiToDomain(data);
  } catch (error) {
    console.error(
      'Erro no repositório ao buscar distribuição de risco:',
      error,
    );
    throw error;
  }
};

const getTopDeficiencies = async (): Promise<Deficiency[]> => {
  try {
    const { data } = await apiClient.get<TopDeficienciesApiResponse>(
      '/api/v1/dashboard/top-deficiencies',
    );

    return data.topDeficiencies.map(mapDeficiencyFromApiToDomain);
  } catch (error) {
    console.error('Erro no repositório ao buscar top deficiências:', error);
    throw error;
  }
};

export const dashboardRepository = {
  getKpis,
  getHighRiskSchools,
  getTopMunicipalitiesByRisk,
  getRiskDistribution,
  getTopDeficiencies,
};
