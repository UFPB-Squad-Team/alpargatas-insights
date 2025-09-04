import {
  MapContainer,
  TileLayer,
  GeoJSON,
  useMap,
  LayersControl,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useRef } from 'react';
import { SchoolForMap } from '@/domain/entities/School/SchoolForMap';
import { Button } from '@/ui/components/common/button';
import { Expand, LocateIcon } from 'lucide-react';
import { SchoolMarkersLayer } from './SchoolMarkersLayer';

const MapEffect = ({ geojsonData }: { geojsonData: any }) => {
  const map = useMap();
  useEffect(() => {
    if (geojsonData && geojsonData.features.length > 0) {
      const geoJsonLayer = L.geoJSON(geojsonData);
      map.fitBounds(geoJsonLayer.getBounds());
    }
  }, [geojsonData, map]);
  return null;
};

type MunicipalityMapProps = {
  municipalityGeoJson: any;
  schoolsInMunicipality: SchoolForMap[];
};

export const MunicipalityMap = ({
  municipalityGeoJson,
  schoolsInMunicipality,
}: MunicipalityMapProps) => {
  const mapRef = useRef<L.Map>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const styleGeoJson = () => ({
    fillColor: '#D46419',
    weight: 1.5,
    opacity: 1,
    color: '#963B14',
    fillOpacity: 0.3,
  });

  const handleRecenter = () => {
    const map = mapRef.current;
    if (map && municipalityGeoJson && municipalityGeoJson.features.length > 0) {
      const geoJsonLayer = L.geoJSON(municipalityGeoJson);
      map.fitBounds(geoJsonLayer.getBounds());
    }
  };

  const handleFullscreen = () => {
    const container = containerRef.current;
    if (container) {
      if (!document.fullscreenElement) {
        container.requestFullscreen().catch((err) => {
          alert(`Erro ao tentar entrar em tela cheia: ${err.message}`);
        });
      } else {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div className="relative h-full w-full" ref={containerRef}>
      <MapContainer
        ref={mapRef}
        scrollWheelZoom={true}
        className="h-full w-full bg-white"
        center={[-7.1, -36.8]}
        zoom={8}
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer name="Padrão">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer checked name="Satélite">
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution="&copy; Esri"
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        {municipalityGeoJson && (
          <GeoJSON data={municipalityGeoJson} style={styleGeoJson} />
        )}

        <SchoolMarkersLayer schools={schoolsInMunicipality} />

        <MapEffect geojsonData={municipalityGeoJson} />
      </MapContainer>

      <div className="absolute bottom-12 right-4 z-[1000] flex flex-col gap-2">
        <Button
          size="icon"
          onClick={handleRecenter}
          title="Centralizar no município"
          className="bg-white/80 text-brand-text-primary shadow-lg hover:bg-white backdrop-blur-sm"
        >
          <LocateIcon className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          onClick={handleFullscreen}
          title="Ver em tela cheia"
          className="bg-white/80 text-brand-text-primary shadow-lg hover:bg-white backdrop-blur-sm"
        >
          <Expand className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
