type LocationCoordinates = [number, number];

/**
 * @description Contract that represents the API response for the optimized map endpoint.
 */
export type SchoolForMapFromApi = {
  id: string;
  escolaNome: string;
  localizacao: {
    coordinates: LocationCoordinates;
    type: 'Point';
  };
  scoreRiscoContextualizado: number;
};

/**
 * @description Our internal domain model for map data.
 * This is the type that the MapChart component will receive as a prop.
 */
export type SchoolForMap = {
  id: string;
  nome: string;
  coordenadas: LocationCoordinates;
  scoreRiscoContextualizado: number;
};
