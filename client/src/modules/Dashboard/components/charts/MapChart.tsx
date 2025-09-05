import { MapContainer, TileLayer, LayersControl } from 'react-leaflet';
import L from 'leaflet';
import { useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import '@changey/react-leaflet-markercluster/dist/styles.min.css';
import { SchoolForMap } from '@/domain/entities/School/SchoolForMap';
import ChoroplethLayer from './ChoroplethLayer';
import { SchoolMarkersLayer } from '@/modules/Municipality/MunicipalityDetails/components/SchoolMarkersLayer';
import { Button } from '@/ui/components/common/button';
import { Expand, LocateIcon } from 'lucide-react';

interface MapChartProps {
  schools: SchoolForMap[];
  selectedSchoolId?: string | null | number;
}

const MapChart = ({ schools, selectedSchoolId }: MapChartProps) => {
  const mapRef = useRef<L.Map>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const paraibaInitialView: L.LatLngExpression = [-7.1, -36.8];
  const paraibaInitialZoom = 8;

  const handleRecenter = () => {
    const map = mapRef.current;
    if (map) {
      map.setView(paraibaInitialView, paraibaInitialZoom);
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
    <div
      className="relative h-[500px] w-full rounded-lg shadow-md overflow-hidden z-0"
      ref={containerRef}
    >
      <MapContainer
        ref={mapRef} 
        center={paraibaInitialView}
        zoom={paraibaInitialZoom}
        style={{ height: '100%', width: '100%' }}
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Mapa Detalhado">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Mapa Limpo">
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satélite">
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution="&copy; Esri"
            />
          </LayersControl.BaseLayer>
          <LayersControl.Overlay checked name="Visão por Escolas (Clusters)">
            <SchoolMarkersLayer
              schools={schools}
              selectedSchoolId={selectedSchoolId}
            />
          </LayersControl.Overlay>
          <LayersControl.Overlay name="Visão por Municípios (Risco)">
            <ChoroplethLayer />
          </LayersControl.Overlay>
        </LayersControl>
      </MapContainer>

      <div className="absolute bottom-12 right-4 z-[1000] flex flex-col gap-2">
        <Button
          size="icon"
          onClick={handleRecenter}
          title="Centralizar na Paraíba"
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

export default MapChart;
