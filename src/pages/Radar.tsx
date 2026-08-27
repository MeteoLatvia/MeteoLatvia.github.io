import { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, ImageOverlay } from 'react-leaflet';
import L from 'leaflet';
import { Play, Pause, RefreshCw, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { lv } from 'date-fns/locale';

// OPERA Radar Configuration based on previous architecture
const RADAR_CONFIG = {
  baseUrl: "https://martins.rullz.lv/radar/opera/",
  urlPrefix: "OPERA_",
  urlSuffix: ".png",
  intervalMs: 5 * 60 * 1000, // 5 minutes
  historyHours: 3,
  // Leaflet uses [[South, West], [North, East]] in [Latitude, Longitude] format.
  bounds: [
    [31.74973208008318, -39.53578641250335], // Dienvidrietumu stūris
    [73.92709751434613, 57.80425125826406]  // Ziemeļaustrumu stūris
  ] as L.LatLngBoundsExpression
};

export function Radar() {
  const [timestamps, setTimestamps] = useState<Date[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mapReady, setMapReady] = useState(false);
  
  const animationRef = useRef<NodeJS.Timeout | null>(null);

  // Generates the specific URL for a given timestamp
  const getImageUrl = useCallback((date: Date) => {
    const yr = date.getUTCFullYear();
    const mo = String(date.getUTCMonth() + 1).padStart(2, '0');
    const dy = String(date.getUTCDate()).padStart(2, '0');
    const hr = String(date.getUTCHours()).padStart(2, '0');
    const mn = String(date.getUTCMinutes()).padStart(2, '0');
    return `${RADAR_CONFIG.baseUrl}${RADAR_CONFIG.urlPrefix}${yr}${mo}${dy}_${hr}${mn}${RADAR_CONFIG.urlSuffix}`;
  }, []);

  // Initialize and fetch the latest available radar image
  const initRadar = useCallback(async () => {
    setIsLoading(true);
    setIsPlaying(false);
    if (animationRef.current) clearInterval(animationRef.current);

    const now = new Date();
    let checkTime = new Date(Math.floor(now.getTime() / RADAR_CONFIG.intervalMs) * RADAR_CONFIG.intervalMs);
    let latestTime: Date | null = null;

    // Ping recent intervals to find the latest published image
    for (let i = 0; i < 12; i++) {
      try {
        const url = getImageUrl(checkTime);
        const res = await fetch(url, { method: 'HEAD', cache: 'no-store' });
        if (res.ok) {
          latestTime = checkTime;
          break;
        }
      } catch (e) {
        // Continue checking older times
      }
      checkTime = new Date(checkTime.getTime() - RADAR_CONFIG.intervalMs);
    }

    if (latestTime) {
      // Build the timeline array (last 3 hours)
      const timeArray: Date[] = [];
      const totalSteps = (RADAR_CONFIG.historyHours * 60) / 5;
      for (let i = 0; i < totalSteps; i++) {
        timeArray.push(new Date(latestTime.getTime() - i * RADAR_CONFIG.intervalMs));
      }
      const sortedArray = timeArray.reverse();
      setTimestamps(sortedArray);
      setCurrentIndex(sortedArray.length - 1);
      
      // Preload images silently for smooth playback
      sortedArray.forEach(t => {
        const img = new Image();
        img.src = getImageUrl(t);
      });
    }
    
    setIsLoading(false);
  }, [getImageUrl]);

  useEffect(() => {
    setMapReady(true);
    initRadar();
    // Refresh background data every 5 minutes
    const refreshInterval = setInterval(initRadar, RADAR_CONFIG.intervalMs);
    return () => clearInterval(refreshInterval);
  }, [initRadar]);

  // Handle Playback Animation
  useEffect(() => {
    if (isPlaying) {
      animationRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % timestamps.length);
      }, 500); // 500ms per frame
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
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">Skatīt Radaru</h1>
          <p className="text-medium-emphasis">OPERA Eiropas meteoroloģisko radaru kompozīts (atjaunojas ik pēc 5 min).</p>
        </div>
      </div>

      {/* Main Map Container */}
      <div className="flex-grow rounded-3xl overflow-hidden border border-border relative z-0 bg-ocean drop-shadow-xl flex flex-col">
        
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-50 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
            <RefreshCw className="animate-spin text-secondary w-8 h-8" />
            <p className="font-medium text-lg">Meklē jaunāko radara attēlu...</p>
          </div>
        )}

        <div className="relative flex-grow">
          {mapReady && (
            <MapContainer 
              center={[56.8796, 24.6032]} 
              zoom={6.5} 
              className="w-full h-full z-0 bg-ocean"
              zoomControl={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
              />
              {/* Render the radar image for the currently selected timestamp */}
              {activeTime && (
                <ImageOverlay
                  url={getImageUrl(activeTime)}
                  bounds={RADAR_CONFIG.bounds}
                  opacity={0.75}
                  zIndex={10}
                />
              )}
            </MapContainer>
          )}

          {/* Timeline Control Panel Overlay */}
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
                </div>
              </div>

              <button 
                onClick={initRadar}
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

      {/* Precipitation Intensity Legend */}
      <div className="bg-landmass border border-border rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
        <div className="flex items-center gap-2">
          <Info size={18} className="text-secondary" />
          <h4 className="font-bold text-sm">Nokrišņu intensitāte (mm/h)</h4>
        </div>
        
        {/* Colorbar matching the old design thresholds */}
        <div className="flex w-full md:w-auto h-8 rounded-lg overflow-hidden border border-border text-[10px] font-bold text-black/50 text-center">
          <div className="flex-1 min-w-[32px] bg-[#00e5ff] flex items-center justify-center" title="0.05 mm/h">0.05</div>
          <div className="flex-1 min-w-[32px] bg-[#0088ff] flex items-center justify-center text-white/70" title="0.1 mm/h">0.1</div>
          <div className="flex-1 min-w-[32px] bg-[#0033ff] flex items-center justify-center text-white/70" title="0.3 mm/h">0.3</div>
          <div className="flex-1 min-w-[32px] bg-[#00ff00] flex items-center justify-center" title="0.5 mm/h">0.5</div>
          <div className="flex-1 min-w-[32px] bg-[#00aa00] flex items-center justify-center text-white/70" title="1 mm/h">1</div>
          <div className="flex-1 min-w-[32px] bg-[#005500] flex items-center justify-center text-white/70" title="2 mm/h">2</div>
          <div className="flex-1 min-w-[32px] bg-[#ffff00] flex items-center justify-center" title="4 mm/h">4</div>
          <div className="flex-1 min-w-[32px] bg-[#ffaa00] flex items-center justify-center" title="8 mm/h">8</div>
          <div className="flex-1 min-w-[32px] bg-[#ff0000] flex items-center justify-center text-white/70" title="16 mm/h">16</div>
          <div className="flex-1 min-w-[32px] bg-[#aa00ff] flex items-center justify-center text-white/70" title="50+ mm/h">50+</div>
        </div>
      </div>
      
    </div>
  );
}