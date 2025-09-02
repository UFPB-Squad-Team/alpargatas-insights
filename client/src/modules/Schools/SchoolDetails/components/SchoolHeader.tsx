import {
  MapContainer,
  TileLayer,
  LayersControl,
  CircleMarker,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { School } from '@/domain/entities/School/SchoolProps';
import { Button } from '@/ui/components/common/button';
import { Check, Share2, Users } from 'lucide-react';
import RiskIndicator from '@/ui/components/common/RiskIndicator';
import { useState, useEffect } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/ui/components/common/tooltip';

type SchoolHeaderProps = {
  school: School;
};

const dependencyStyles: { [key: string]: string } = {
  Municipal: 'bg-amber-100 text-amber-800',
  Estadual: 'bg-orange-100 text-orange-800',
};
const locationStyles: { [key: string]: string } = {
  Urbana: 'bg-red-100 text-red-800',
  Rural: 'bg-yellow-100 text-yellow-800',
};

const HeaderStat = ({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ElementType;
  value: string | number;
  label: string;
}) => (
  <div className="flex items-center gap-2 text-brand-text-secondary">
    <Icon className="h-5 w-5 text-brand-orange-dark" />
    <div>
      <p className="font-bold text-lg text-brand-text-primary">{value}</p>
      <p className="text-xs -mt-1">{label}</p>
    </div>
  </div>
);

export const SchoolHeader = ({ school }: SchoolHeaderProps) => {
  const [isClient, setIsClient] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const depStyle = dependencyStyles[school.dependenciaAdm] || 'bg-gray-100';
  const locStyle = locationStyles[school.localizacaoTipo] || 'bg-gray-100';

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
      <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
        <div className="flex-1 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-brand-text-primary">
                {school.nome}
              </h1>
              <p className="mt-1 text-brand-text-secondary">
                {school.municipio} - {school.estado} | INEP: {school.inep}
              </p>
            </div>

            <Tooltip open={isCopied}>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleShare}
                  className="bg-brand-orange-dark hover:bg-brand-orange-contrast"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Compartilhar
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <div className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <p>Link copiado!</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="flex flex-wrap gap-2">
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full ${depStyle}`}
            >
              {school.dependenciaAdm}
            </span>
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full ${locStyle}`}
            >
              {school.localizacaoTipo}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-4 border-t">
            <HeaderStat
              icon={Users}
              value={school.totalAlunos}
              label="Alunos"
            />
            <div className="flex items-center gap-2">
              <RiskIndicator score={school.scoreDeRisco} />
            </div>
          </div>
        </div>

        <div className="relative w-full md:w-1/3 h-56 rounded-lg overflow-hidden border bg-gray-100">
          {isClient && (
            <>
              <MapContainer
                center={[school.coordenadas[1], school.coordenadas[0]]}
                zoom={13}
                scrollWheelZoom={true}
                className="h-full w-full"
              >
                <LayersControl position="topright">
                  <LayersControl.BaseLayer checked name="Padrão">
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                  </LayersControl.BaseLayer>
                  <LayersControl.BaseLayer name="Satélite">
                    {' '}
                    <TileLayer
                      url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                      attribution="&copy; Esri"
                    />
                  </LayersControl.BaseLayer>
                </LayersControl>

                <CircleMarker
                  center={[school.coordenadas[1], school.coordenadas[0]]}
                  radius={8}
                  pathOptions={{
                    color: '#FFFFFF',
                    fillColor: '#D46419',
                    fillOpacity: 1,
                    weight: 2,
                  }}
                />
              </MapContainer>
            </>
          )}
        </div>
      </div>
      {/* A seção de botões que ficava aqui foi removida, deixando o componente mais compacto */}
    </div>
  );
};
