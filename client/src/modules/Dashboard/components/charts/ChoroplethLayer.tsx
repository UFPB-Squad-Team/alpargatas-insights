import { GeoJSON } from 'react-leaflet';
import { useQuery } from '@tanstack/react-query';
import L from 'leaflet';
import { getMunicipalitiesByRiskCountUseCase } from '../../services/logic/Municipality/getMunicipalitiesByRiskCountUseCase';
import { getParaibaGeoJsonUseCase } from '../../services/logic/Municipality/getParaibaGeoJsonUseCase';
import { MunicipalityRiskCount } from '@/domain/entities/Municipality/Municipality';

const getColor = (count: number) => {
  if (count > 20) return '#963B14';
  if (count > 10) return '#D46419';
  if (count > 5) return '#FFA726';
  if (count > 0) return '#FED7AA';
  return 'transparent';
};

const ChoroplethLayer = () => {
  const { data: riskCountData = [] } = useQuery({
    queryKey: ['municipalities-by-risk-count'],
    queryFn: getMunicipalitiesByRiskCountUseCase.execute,
  });

  const { data: geoJsonData } = useQuery({
    queryKey: ['paraiba-geojson'],
    queryFn: getParaibaGeoJsonUseCase.execute,
  });

  const riskCountMap = new Map<string, MunicipalityRiskCount>(
    riskCountData.map((item) => [item.codigoIbge, item]),
  );

  const styleGeoJson = (feature?: GeoJSON.Feature): L.PathOptions => {
    const municipalityCode = feature?.properties?.id;
    const riskData = municipalityCode
      ? riskCountMap.get(municipalityCode)
      : undefined;
    const schoolCount = riskData?.escolasEmAltoRisco || 0;

    return {
      fillColor: getColor(schoolCount),
      weight: 0.5,
      opacity: 1,
      color: '#D46419',
      fillOpacity: 0.7,
    };
  };

  const onEachFeature = (feature: GeoJSON.Feature, layer: L.Layer) => {
    const municipalityCode = feature.properties?.id;
    const riskData = municipalityCode
      ? riskCountMap.get(municipalityCode)
      : undefined;
    const schoolCount = riskData?.escolasEmAltoRisco || 0;
    const municipalityName = feature.properties?.name;

    if (municipalityName) {
      layer.bindTooltip(`
        <div class="font-sans">
          <strong class="text-base">${municipalityName}</strong><br />
          ${schoolCount} escolas em alto risco
        </div>
      `);

      layer.on({
        mouseover: (e) => {
          const l = e.target;
          l.setStyle({ weight: 0.5, color: '#D46419', fillOpacity: 0.9 });
        },
        mouseout: (e) => {
          const l = e.target;
          (layer as L.GeoJSON).resetStyle(l);
        },
      });
    }
  };

  if (!geoJsonData) {
    return null;
  }

  return (
    <GeoJSON
      key={JSON.stringify(riskCountData)}
      data={geoJsonData}
      style={styleGeoJson}
      onEachFeature={onEachFeature}
    />
  );
};

export default ChoroplethLayer;
