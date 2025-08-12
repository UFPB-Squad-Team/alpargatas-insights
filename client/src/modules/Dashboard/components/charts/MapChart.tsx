import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from '@changey/react-leaflet-markercluster';
import L from 'leaflet';
import { useEffect, useRef } from 'react';

import 'leaflet/dist/leaflet.css';
import '@changey/react-leaflet-markercluster/dist/styles.min.css';

import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import CustomPopup from '../custom/CustomPopup';
import { SchoolForMap } from '@/shared/mocks/services/getSchoolsForMap';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });

const createCustomIcon = (score: number) => {
  let color = '#FDBA74';
  if (score >= 0.9) color = '#7C2D12';
  else if (score >= 0.75) color = '#B45309';
  else if (score >= 0.4) color = '#F97316';

  const iconHtml = `
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="${color}" stroke="white" stroke-width="1.5">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>`;

  return L.divIcon({
    html: iconHtml,
    className: 'custom-marker-icon',
    iconSize: [30, 40],
    iconAnchor: [15, 40],
    popupAnchor: [0, -40],
  });
};

const createClusterCustomIcon = (cluster: L.MarkerCluster) => {
  const count = cluster.getChildCount();

  const levels = [
    { threshold: 50, size: 40, className: 'bg-brand-orange-dark text-white' },
    { threshold: 10, size: 40, className: 'bg-brand-orange text-white' },
    {
      threshold: 0,
      size: 40,
      className: 'bg-brand-orange-light text-brand-orange-dark',
    },
  ];

  const { size, className } = levels.find((level) => count >= level.threshold)!;

  return L.divIcon({
    html: `<div class="flex items-center justify-center w-full h-full rounded-full font-bold text-lg">${count}</div>`,
    className: `marker-cluster ${className}`,
    iconSize: L.point(size, size, true),
  });
};

interface MapChartProps {
  schools: SchoolForMap[];
  selectedSchoolId?: string | null | number;
}

const MapMarkers = ({ schools, selectedSchoolId }: MapChartProps) => {
  const map = useMap();

  const markerRefs = useRef<Record<string, L.Marker>>({});

  useEffect(() => {
    if (!selectedSchoolId) return;

    const school = schools.find((s) => s.escola_id_inep === selectedSchoolId);
    if (!school) return;

    const coords = school.localizacao.coordinates;

    if (coords.length >= 2) {
      const latLng: [number, number] = [coords[1], coords[0]];
      map.setView(latLng, 15, { animate: true });
    } else {
      console.warn('Coordenadas inválidas para setView:', coords);
    }

    const marker = markerRefs.current[selectedSchoolId];
    if (marker) marker.openPopup();
  }, [selectedSchoolId, schools, map]);

  return (
    <>
      {schools.map((school) => (
        <Marker
          key={school.escola_id_inep}
          position={[
            school.localizacao.coordinates[1],
            school.localizacao.coordinates[0],
          ]}
          icon={createCustomIcon(school.score_de_risco)}
          ref={(ref) => {
            if (ref) markerRefs.current[school.escola_id_inep] = ref;
          }}
        >
          <Popup>
            <CustomPopup school={school} />
          </Popup>
        </Marker>
      ))}
    </>
  );
};

const MapChart = ({ schools, selectedSchoolId }: MapChartProps) => {
  return (
    <div className="h-[500px] w-full rounded-lg shadow-md overflow-hidden">
      <MapContainer
        center={[-7.1, -36.8]}
        zoom={8}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <MarkerClusterGroup iconCreateFunction={createClusterCustomIcon}>
          <MapMarkers schools={schools} selectedSchoolId={selectedSchoolId} />
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
};

export default MapChart;
