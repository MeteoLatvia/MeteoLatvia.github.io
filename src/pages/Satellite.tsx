import { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, ImageOverlay } from 'react-leaflet';
import L from 'leaflet';
import { Play, Pause, RefreshCw, Layers, SlidersHorizontal } from 'lucide-react';
import { format } from 'date-fns';
import { lv } from 'date-fns/locale';

// Meteosat-12 FCI Configuration based on previous architecture
const SAT_CONFIG = {
  baseUrl: "https://martins.rullz.lv/satellite/meteosat/fci/FCI_",
  urlSuffix: ".png",
  intervalMs: 10 * 60 * 1000, // 10 minutes
  historyHours: 4,
  // Strict [South, West], [North, East] from georef.json
  bounds: [
    [35.2483, -14.1214],
    [64.1907, 44.1214]
  ] as L.LatLngBoundsExpression
};

const PRODUCTS = [
  { label: '24h Microphysics RGB', value: '24h_microphysics', group: 'RGB Kompozīti' },
  { label: 'Airmass RGB', value: 'airmass', group: 'RGB Kompozīti' },
  { label: 'Cloud Phase RGB', value: 'cloud_phase', group: 'RGB Kompozīti' },
  { label: 'Convection RGB', value: 'convection', group: 'RGB Kompozīti' },
  { label: 'Natural Color RGB', value: 'natural_color', group: 'RGB Kompozīti' },
  { label: 'True Color RGB', value: 'true_color', group: 'RGB Kompozīti' },
  { label: 'HRV Clouds RGB', value: 'hrv_clouds', group: 'Mākoņu & Speciālie' },
  { label: 'Colorized IR Clouds', value: 'colorized_ir_clouds', group: 'Mākoņu & Speciālie' },
  { label: 'IR 10.5 µm', value: 'ir_105', group: 'Infrasarkanie & WV' },
  { label: 'WV 6.3 µm', value: 'wv_63', group: 'Infrasarkanie & WV' },
  { label: 'VIS 0.6 µm', value: 'vis_06', group: 'Redzamie & NIR' }
]; // Abridged for cleanliness, you can add the rest of your 30+ products here

export function Satellite() {
  const [timestamps, setTimestamps] = useState<Date[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mapReady, setMapReady] = useState(false);
  
  const [activeProduct, setActiveProduct] = useState('24h_microphysics');
  const [opacity, setOpacity] = useState(0.85);
  
  const animationRef = useRef<NodeJS.Timeout | null>(null);

  // Generates URL based on old codebase logic
  const getImageUrl = useCallback((date: Date, product: string) => {
    const yr = date.getUTCFullYear();
    const mo = String(date.getUTCMonth() + 1).padStart(2, '0');
    const dy = String(date.getUTCDate()).padStart(2, '0');
    const hr = String(date.getUTCHours()).padStart(2, '0');
    const mn = String(Math.floor(date.getUTCMinutes() / 10) * 10).padStart(2, '0');
    return `${SAT_CONFIG.baseUrl}${yr}${mo}${dy}_${hr}${mn}_${product}${SAT_CONFIG.urlSuffix}`;
  }, []);

  const initSatellite = useCallback(async () => {
    setIsLoading(true);
    setIsPlaying(false);
    if (animationRef.current) clearInterval(animationRef.current);

    const now = new Date();
    let checkTime = new Date(Math.floor(now.getTime() / SAT_CONFIG.intervalMs) * SAT_CONFIG.intervalMs);
    let latestTime: Date | null = null;

    // Ping recent intervals to find latest published image
    for (let i = 0; i < 18; i++) {
      try {
        const url = getImageUrl(checkTime, activeProduct);
        const res = await fetch(url, { method: 'HEAD', cache: 'no-store' });
        if (res.ok) {
          latestTime = checkTime;
          break;
        }
      } catch (e) {
        // Skip
      }
      checkTime = new Date(checkTime.getTime() - SAT_CONFIG.intervalMs);
    }

    if (latestTime) {
      const timeArray: Date[] = [];
      const totalSteps = (SAT_CONFIG.historyHours * 60) / 10;
      for (let i = 0; i < totalSteps; i++) {
        timeArray.push(new Date(latestTime.getTime() - i * SAT_CONFIG.intervalMs));
      }
      const sortedArray = timeArray.reverse();
      setTimestamps(sortedArray);
      setCurrentIndex(sortedArray.length - 1);
      
      // Preload the latest 3 images silently
      sortedArray.slice(-3).forEach(t => {
        const img = new Image();
        img.src = getImageUrl(t, activeProduct);
      });
    } else {
      setTimestamps([]);
    }
    
    setIsLoading(false);
  }, [activeProduct, getImageUrl]);

  useEffect(() => {
    setMapReady(true);
    initSatellite();
    const refreshInterval = setInterval(initSatellite, SAT_CONFIG.intervalMs);
    return () => clearInterval(refreshInterval);
  }, [initSatellite]);

  // Handle Playback Animation
  useEffect(() => {
    if (isPlaying && timestamps.length > 0) {
      animationRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % timestamps.length);
      }, 400); 
    } else if (animationRef.current) {
      clearInterval(animationRef.current);
    }
    return () => {
      if (animationRef.current) clearInterval(animationRef.current);
    };
  }, [isPlaying, timestamps.length]);

  const activeTime = timestamps[currentIndex];

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] gap-4 animate-in fade-in duration-500">
      
      {/* Header & Controls */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 px-1">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">Satelītattēli</h1>
          <p className="text-medium-emphasis">Meteosat-12 (FCI) dati. Atjaunojas ik pēc 10 minūtēm.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-landmass p-3 rounded-2xl border border-border">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Layers size={18} className="text-secondary shrink-0" />
            <select 
              className="bg-ocean border border-border text-high-emphasis text-sm rounded-lg px-3 py-2 outline-none focus:border-secondary transition-colors w-full sm:w-48"
              value={activeProduct}
              onChange={(e) => setActiveProduct(e.target.value)}
            >
              {Array.from(new Set(PRODUCTS.map(p => p.group))).map(group => (
                <optgroup key={group} label={group}>
                  {PRODUCTS.filter(p => p.group === group).map(p => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div className="hidden sm:block w-px h-8 bg-border"></div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <SlidersHorizontal size={18} className="text-secondary shrink-0" />
            <input 
              type="range" 
              min="0.1" 
              max="1" 
              step="0.05" 
              value={opacity}
              onChange={(e) => setOpacity(parseFloat(e.target.value))}
              className="w-full sm:w-32 accent-secondary"
            />
          </div>
        </div>
      </div>

      {/* Main Map Container */}
      <div className="flex-grow rounded-3xl overflow-hidden border border-border relative z-0 bg-ocean drop-shadow-xl flex flex-col">
        
        {isLoading && (
          <div className="absolute inset-0 z-50 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
            <RefreshCw className="animate-spin text-secondary w-8 h-8" />
            <p className="font-medium text-lg">Ielādē satelīta datus...</p>
          </div>
        )}

        <div className="relative flex-grow">
          {mapReady && (
            <MapContainer 
              center={[56.8796, 24.6032]} 
              zoom={5} 
              className="w-full h-full z-0 bg-ocean"
              zoomControl={false}
            >
              <TileLayer
                attribution='&copy; Esri'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
              />
              {activeTime && (
                <ImageOverlay
                  url={getImageUrl(activeTime, activeProduct)}
                  bounds={SAT_CONFIG.bounds}
                  opacity={opacity}
                  zIndex={10}
                />
              )}
            </MapContainer>
          )}

          {/* Timeline Control Panel */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl bg-background/90 backdrop-blur-md border border-border rounded-2xl p-4 z-40 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                disabled={isLoading || timestamps.length === 0}
                className="w-12 h-12 flex items-center justify-center bg-secondary text-white rounded-full hover:bg-secondary/80 transition-colors disabled:opacity-50"
              >
                {isPlaying ? <Pause fill="currentColor" /> : <Play fill="currentColor" className="ml-1" />}
              </button>
              
              <div className="text-center">
                <div className="text-xl font-bold tracking-wider">
                  {activeTime ? format(activeTime, 'HH:mm', { locale: lv }) : '--:--'}
                </div>
                <div className="text-xs text-medium-emphasis">
                  {activeTime ? format(activeTime, 'dd.MM.yyyy') : '---'}
                  <span className="ml-2 px-2 py-0.5 bg-landmass rounded-md text-[10px] uppercase font-bold text-secondary">
                    {activeProduct.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              <button 
                onClick={initSatellite}
                className="w-12 h-12 flex items-center justify-center border border-border text-medium-emphasis rounded-full hover:text-white hover:bg-landmass transition-colors"
              >
                <RefreshCw size={20} />
              </button>
            </div>
            
            <input 
              type="range" 
              min="0" 
              max={Math.max(0, timestamps.length - 1)} 
              value={currentIndex}
              onChange={(e) => {
                setIsPlaying(false);
                setCurrentIndex(parseInt(e.target.value));
              }}
              disabled={isLoading || timestamps.length === 0}
              className="w-full accent-secondary cursor-pointer h-2 bg-landmass rounded-lg appearance-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}