import { DeficiencyFromApi, Deficiency } from "../../types/School/DeficiencyTypes";

export const mapDeficiencyFromApiToDomain = (
  apiDeficiency: DeficiencyFromApi,
): Deficiency => {
  return {
    carencia: apiDeficiency.deficit
      .replace('Falta de Possui_', '') 
      .replace(/_/g, ' '),             
    quantidadeEscolas: apiDeficiency.schools,
  };
};