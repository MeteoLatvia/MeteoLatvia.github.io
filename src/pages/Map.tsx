import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useQuery } from '@tanstack/react-query';
import { DEFAULT_LOCATION, fetchWeather } from '@/lib/api';
import { WeatherIcon } from '@/components/weather/WeatherIcon';

// Vite/React-Leaflet bug fix for missing marker icons
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// 1. A component that handles map clicks
function MapInteraction({ onLocationClick }: { onLocationClick: (lat: number, lon: number) => void }) {
  useMapEvents({
    click(e) {
      onLocationClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// 2. A dynamic marker that fetches its own weather data AND auto-opens
function DynamicWeatherMarker({ lat, lon, title }: { lat: number; lon: number; title?: string }) {
  const markerRef = useRef<L.Marker>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['weather', lat, lon],
    queryFn: () => fetchWeather(lat, lon),
  });

  // Auto-open the popup as soon as this marker is rendered on the map
  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.openPopup();
    }
  }, []);

  return (
    <Marker position={[lat, lon]} ref={markerRef}>
      <Popup className="font-sans min-w-[160px]">
        {isLoading && (
          <div className="text-center p-2 text-sm text-gray-600 font-medium animate-pulse">Ielādē datus...</div>
        )}
        
        {!isLoading && (isError || !data) && (
          <div className="text-center p-2 text-sm text-red-600 font-bold">Kļūda ielādējot datus</div>
        )}
        
        {!isLoading && !isError && data && (
          <div className="flex flex-col gap-2 pt-1 text-[#0B0F19]">
            <div className="font-bold text-xs uppercase tracking-wider border-b border-gray-200 pb-1 text-gray-500">
              {title || `${lat.toFixed(3)}°, ${lon.toFixed(3)}°`}
            </div>
            <div className="flex items-center gap-3">
              <div className="text-[#00a6e1]">
                <WeatherIcon code={data.current.weather_code} isDay={data.current.is_day} className="w-10 h-10" />
              </div>
              <div>
                <div className="text-2xl font-black leading-none mb-1">{Math.round(data.current.temperature_2m)}°C</div>
                <div className="text-xs font-medium text-gray-600">Vējš: {Math.round(data.current.wind_speed_10m)} m/s</div>
              </div>
            </div>
          </div>
        )}
      </Popup>
    </Marker>
  );
}

export function Map() {
  const [isMounted, setIsMounted] = useState(false);
  const [customLocations, setCustomLocations] = useState<{lat: number, lon: number}[]>([]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleMapClick = (lat: number, lon: number) => {
    setCustomLocations((prev) => [...prev, { lat, lon }]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] gap-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between px-1">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight">Interaktīvā Karte</h1>
        
        <button 
          onClick={() => setCustomLocations([])}
          className="flex items-center gap-2 bg-landmass border border-border px-4 py-2 rounded-xl text-sm font-medium hover:text-red-400 hover:border-red-400/50 transition-colors"
        >
          <span className="hidden sm:inline">Notīrīt spraudītes</span>
        </button>
      </div>

      <div className="flex-grow rounded-3xl overflow-hidden border border-border relative z-0 bg-ocean drop-shadow-xl">
        {isMounted && (
          <MapContainer 
            key="main-map"
            center={[56.8796, 24.6032]} 
            zoom={7} 
            className="w-full h-full z-0"
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.esri.com/">Esri</a> &mdash; Esri, DeLorme, NAVTEQ'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
            />
            
            <MapInteraction onLocationClick={handleMapClick} />

            <DynamicWeatherMarker lat={DEFAULT_LOCATION.lat} lon={DEFAULT_LOCATION.lon} title={DEFAULT_LOCATION.name} />
            
            {customLocations.map((loc, idx) => (
              <DynamicWeatherMarker key={`${loc.lat}-${loc.lon}-${idx}`} lat={loc.lat} lon={loc.lon} />
            ))}
            
          </MapContainer>
        )}
      </div>
      <div className="text-center text-xs text-medium-emphasis">
        Noklikšķiniet jebkur uz kartes, lai iegūtu precīzus laikapstākļu datus šajā punktā.
      </div>
    </div>
  );
}