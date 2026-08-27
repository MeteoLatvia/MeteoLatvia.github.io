import { AlertTriangle, Info, Map as MapIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { brandColors } from '@/lib/theme';

// Mock data: In the future, this will be replaced by an LVĢMC / meteo.lv JSON feed
const MOCK_ALERTS = [
  {
    id: 1,
    level: 'orange', // 'yellow', 'orange', 'red'
    title: 'Oranžā līmeņa brīdinājums par pērkona negaisu',
    time: 'Spēkā no: 14:00 līdz 22:00',
    description: 'Tuvākajās stundās Latvijas centrālajos un austrumu rajonos gaidāms spēcīgs pērkona negaiss ar krasām vēja brāzmām līdz 20-24 m/s, intensīvām lietusgāzēm un krusu.',
    regions: ['Zemgale', 'Vidzeme'],
  },
  {
    id: 2,
    level: 'yellow',
    title: 'Dzeltenā līmeņa brīdinājums par karstumu',
    time: 'Spēkā no: 11:00 līdz 20:00',
    description: 'Dienas vidū un pēcpusdienā daudzviet gaisa temperatūra paaugstināsies līdz +27...+28 grādiem.',
    regions: ['Visa Latvija'],
  }
];

export function Alerts() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">Brīdinājumi</h1>
          <p className="text-medium-emphasis">Aktuālie laikapstākļu brīdinājumi Latvijas teritorijā.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium bg-landmass px-3 py-2 rounded-lg border border-border">
          <Info size={16} className="text-secondary" />
          <span>Dati no LVĢMC (Demonstrācija)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerts List */}
        <div className="lg:col-span-2 space-y-4">
          {MOCK_ALERTS.length === 0 ? (
            <div className="bg-ocean border border-border rounded-2xl p-8 text-center flex flex-col items-center justify-center">
              <div className="bg-landmass p-4 rounded-full mb-4">
                <Info size={32} className="text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Nav aktīvu brīdinājumu</h3>
              <p className="text-medium-emphasis">Šobrīd visā valsts teritorijā laikapstākļi ir mierīgi.</p>
            </div>
          ) : (
            MOCK_ALERTS.map((alert) => (
              <div 
                key={alert.id} 
                className={cn(
                  "border rounded-2xl p-5 md:p-6 flex flex-col gap-3 relative overflow-hidden",
                  alert.level === 'yellow' ? 'bg-[#FACC15]/10 border-[#FACC15]/30' : '',
                  alert.level === 'orange' ? 'bg-[#F97316]/10 border-[#F97316]/30' : '',
                  alert.level === 'red' ? 'bg-[#DC2626]/10 border-[#DC2626]/30' : ''
                )}
              >
                {/* Left color bar indicator */}
                <div className={cn(
                  "absolute left-0 top-0 bottom-0 w-1.5",
                  alert.level === 'yellow' ? 'bg-[#FACC15]' : '',
                  alert.level === 'orange' ? 'bg-[#F97316]' : '',
                  alert.level === 'red' ? 'bg-[#DC2626]' : ''
                )}></div>

                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <AlertTriangle 
                      size={24} 
                      className={cn(
                        alert.level === 'yellow' ? 'text-[#FACC15]' : '',
                        alert.level === 'orange' ? 'text-[#F97316]' : '',
                        alert.level === 'red' ? 'text-[#DC2626]' : ''
                      )} 
                    />
                    <h2 className="text-lg md:text-xl font-bold">{alert.title}</h2>
                  </div>
                </div>
                
                <div className="text-sm font-medium opacity-80">
                  {alert.time}
                </div>
                
                <p className="text-medium-emphasis leading-relaxed">
                  {alert.description}
                </p>

                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  {alert.regions.map(region => (
                    <span key={region} className="bg-background/50 border border-border/50 text-xs px-3 py-1 rounded-full font-medium text-high-emphasis">
                      {region}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Mini Map Placeholder */}
        <div className="bg-landmass border border-border rounded-2xl p-6 h-[400px] lg:h-auto flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <MapIcon size={20} className="text-medium-emphasis" />
            <h3 className="font-bold">Brīdinājumu karte</h3>
          </div>
          <div className="flex-grow bg-ocean rounded-xl border border-border flex items-center justify-center relative overflow-hidden">
            <div className="text-center p-6 z-10">
              <p className="text-sm text-medium-emphasis mb-2">Šeit tiks integrēts LVĢMC brīdinājumu GeoJSON slānis.</p>
            </div>
            {/* Visual background placeholder */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Latvia_location_map.svg/1024px-Latvia_location_map.svg.png')] bg-contain bg-no-repeat bg-center mix-blend-screen grayscale"></div>
          </div>
        </div>
      </div>
    </div>
  );
}