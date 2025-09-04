import { useMap } from 'react-leaflet';
import MarkerClusterGroup from '@changey/react-leaflet-markercluster';
import L from 'leaflet';
import { useEffect, useRef } from 'react';
import { Marker, Popup } from 'react-leaflet';
import { SchoolForMap } from '@/domain/entities/School/SchoolForMap';
import CustomPopup from '@/modules/Dashboard/components/custom/CustomPopup';

const createCustomIcon = (score: number) => {
  let color = '#FDBA74'; // Baixo Risco (Laranja claro)
  if (score >= 0.9)
    color = '#963B14'; // Alerta Máximo
  else if (score >= 0.75)
    color = '#D46419'; // Alto Risco
  else if (score >= 0.4) color = '#FFA726'; // Risco Moderado

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

interface SchoolMarkersLayerProps {
  schools: SchoolForMap[];
  selectedSchoolId?: string | null | number;
}

export const SchoolMarkersLayer = ({
  schools,
  selectedSchoolId,
}: SchoolMarkersLayerProps) => {
  const map = useMap();
  const markerRefs = useRef<Record<string, L.Marker>>({});

  useEffect(() => {
    if (!selectedSchoolId) return;
    const school = schools.find((s) => s.id === selectedSchoolId);
    if (!school) return;

    const coords = school.coordenadas;
    if (coords && coords.length >= 2) {
      const latLng: [number, number] = [coords[1], coords[0]];
      map.setView(latLng, 15, { animate: true });

      const marker = markerRefs.current[selectedSchoolId.toString()];
      if (marker) {
        setTimeout(() => marker.openPopup(), 300);
      }
    }
  }, [selectedSchoolId, schools, map]);

  return (
    <MarkerClusterGroup iconCreateFunction={createClusterCustomIcon}>
      {schools.map((school) => (
        <Marker
          key={school.id}
          position={[school.coordenadas[1], school.coordenadas[0]]}
          icon={createCustomIcon(school.scoreRiscoContextualizado)}
          ref={(ref) => {
            if (ref) markerRefs.current[school.id] = ref;
          }}
        >
          <Popup>
            <CustomPopup school={school} />
          </Popup>
        </Marker>
      ))}
    </MarkerClusterGroup>
  );
};
