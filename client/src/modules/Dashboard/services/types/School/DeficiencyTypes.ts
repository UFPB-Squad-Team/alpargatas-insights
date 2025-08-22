export type TopDeficienciesApiResponse = {
  topDeficiencies: DeficiencyFromApi[];
};

export type DeficiencyFromApi = {
  deficit: string;
  schools: number;
};

export type Deficiency = {
  carencia: string;
  quantidadeEscolas: number;
};
