/**
 * @description Defines the type for a GeoJSON feature collection,
 * aligned with the pb.json file we are using.
 */
export type GeoJsonFeatureCollection = GeoJSON.FeatureCollection<
  GeoJSON.Geometry,
  {
    id: string;
    name: string;
    description: string;
  }
>;
