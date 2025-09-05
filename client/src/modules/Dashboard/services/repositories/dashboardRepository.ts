import {
  MunicipalityRisk,
  MunicipalityRiskCount,
  MunicipalityRiskCountFromApi,
} from '@/domain/entities/Municipality/Municipality';
import { apiClient } from '@/shared/lib/axios';
import {
  mapMunicipalityRiskCountFromApiToDomain,
  mapMunicipalityRiskFromApiToDomain,
} from '@/shared/services/Municipality/repositories/mappers/municipalityMapper';
import { mapSchoolFromApiToDomain } from '@/shared/services/Schools/repositories/mappers/schoolMapper';
import {
  HighRiskSchool,
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
import { GeoJsonFeatureCollection } from '@/domain/entities/Municipality/GeoJson';
import { FiltersOptions } from '@/shared/services/Schools/repositories/schoolRepository';
import { IFilterState } from '@/ui/context/FiltersContext';
import { SchoolFromApi } from '@/domain/entities/School/SchoolProps';

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

type MunicipalitiesByRiskCountApiResponse = {
  schoolsWithHighRiskPerMunicipality: MunicipalityRiskCountFromApi[];
};

const getKpis = async (filters?: FiltersOptions): Promise<DashboardKpis> => {
  try {
    const { data } = await apiClient.get<DashboardKpisFromApi>(
      '/api/v1/dashboard/kpis',
      {
        params: {
          municipioIdIbge: filters?.municipioIdIbge,
          dependenciaAdm: filters?.dependenciaAdm,
          tipoLocalizacao: filters?.tipoLocalizacao,
        },
      },
    );
    return mapKpisFromApiToDomain(data);
  } catch (error) {
    console.error('Erro no repositório ao buscar KPIs:', error);
    throw error;
  }
};

const getHighRiskSchools = async (
  filters?: IFilterState,
): Promise<HighRiskSchool[]> => {
  try {
    const { data: schoolsFromApi } = await apiClient.get<SchoolFromApi[]>(
      '/api/v1/dashboard/high-risk-schools',
      {
        params: {
          ...filters,
          page: 1,
          limit: 5,
        },
      },
    );

    return schoolsFromApi ? schoolsFromApi.map(mapSchoolFromApiToDomain) : [];
  } catch (error) {
    console.error(
      'Erro no repositório ao buscar escolas de alto risco:',
      error,
    );
    throw error;
  }
};

const getTopMunicipalitiesByRisk = async (
  filters?: FiltersOptions,
): Promise<MunicipalityRisk[]> => {
  try {
    const { data } = await apiClient.get<TopMunicipalitiesApiResponse>(
      '/api/v1/dashboard/top-municipalities-by-risk',
      {
        params: {
          municipioIdIbge: filters?.municipioIdIbge,
          dependenciaAdm: filters?.dependenciaAdm,
          tipoLocalizacao: filters?.tipoLocalizacao,
        },
      },
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
      cor: '#B45309',
    },
    {
      faixa: 'Risco Moderado',
      quantidade: apiData.schoolsWithMediumInfraestructureRisk,
      cor: '#F97316',
    },
    {
      faixa: 'Baixo Risco',
      quantidade: apiData.schoolsWithLowInfraestructureRisk,
      cor: '#FDBA74',
    },
  ];
};

const getRiskDistribution = async (
  filters?: FiltersOptions,
): Promise<RiskDistribution[]> => {
  try {
    const { data } = await apiClient.get<RiskDistributionFromApi>(
      '/api/v1/dashboard/risk-distribution',
      {
        params: {
          municipioIdIbge: filters?.municipioIdIbge,
          dependenciaAdm: filters?.dependenciaAdm,
          tipoLocalizacao: filters?.tipoLocalizacao,
        },
      },
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

const getTopDeficiencies = async (
  filters?: FiltersOptions,
): Promise<Deficiency[]> => {
  try {
    const { data } = await apiClient.get<TopDeficienciesApiResponse>(
      '/api/v1/dashboard/top-deficiencies',
      {
        params: {
          municipioIdIbge: filters?.municipioIdIbge,
          dependenciaAdm: filters?.dependenciaAdm,
          tipoLocalizacao: filters?.tipoLocalizacao,
        },
      },
    );

    return data.topDeficiencies.map(mapDeficiencyFromApiToDomain);
  } catch (error) {
    console.error('Erro no repositório ao buscar top deficiências:', error);
    throw error;
  }
};

const getParaibaGeoJson = async (): Promise<GeoJsonFeatureCollection> => {
  try {
    const response = await fetch('/pb.json');
    if (!response.ok) {
      throw new Error('Falha ao carregar o arquivo GeoJSON da Paraíba');
    }
    return await response.json();
  } catch (error) {
    console.error('Erro no repositório ao buscar GeoJSON:', error);
    throw error;
  }
};

const getMunicipalitiesByRiskCount = async (
  filters?: FiltersOptions,
): Promise<MunicipalityRiskCount[]> => {
  try {
    const { data } = await apiClient.get<MunicipalitiesByRiskCountApiResponse>(
      '/api/v1/dashboard/municipalities-by-risk-count',
      {
        params: {
          municipioIdIbge: filters?.municipioIdIbge,
          dependenciaAdm: filters?.dependenciaAdm,
          tipoLocalizacao: filters?.tipoLocalizacao,
        },
      },
    );
    const municipalitiesFromApi = data.schoolsWithHighRiskPerMunicipality || [];
    return municipalitiesFromApi.map(mapMunicipalityRiskCountFromApiToDomain);
  } catch (error) {
    console.error(
      'Erro no repositório ao buscar contagem de escolas por município:',
      error,
    );
    throw error;
  }
};

export const dashboardRepository = {
  getKpis,
  getHighRiskSchools,
  getTopMunicipalitiesByRisk,
  getRiskDistribution,
  getTopDeficiencies,
  getParaibaGeoJson,
  getMunicipalitiesByRiskCount,
};
