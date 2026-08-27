import { useQuery } from '@tanstack/react-query';
import { fetchWeather, DEFAULT_LOCATION } from '@/lib/api';
import { WeatherIcon } from '@/components/weather/WeatherIcon';
import { MapPin, Wind, Droplets, Gauge } from 'lucide-react';
import { motion } from 'framer-motion';

export function Home() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['weather', DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lon],
    queryFn: () => fetchWeather(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lon),
  });

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-64 bg-landmass rounded-2xl w-full"></div>
        <div className="h-32 bg-landmass rounded-2xl w-full"></div>
      </div>
    );
  }

  if (isError || !data) {
    return <div className="text-emergency font-bold">Kļūda ielādējot datus. Lūdzu mēģiniet vēlāk.</div>;
  }

  const current = data.current;
  const daily = data.daily;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-landmass border border-border p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-col z-10 w-full md:w-auto">
          <div className="flex items-center gap-2 text-medium-emphasis mb-2">
            <MapPin size={18} className="text-secondary" />
            <span className="text-sm font-medium tracking-wider uppercase">{DEFAULT_LOCATION.name}, LV</span>
          </div>
          
          <div className="flex items-center gap-6">
            <WeatherIcon 
              code={current.weather_code} 
              isDay={current.is_day} 
              className="w-24 h-24 md:w-32 md:h-32 drop-shadow-lg" 
            />
            <div>
              <div className="text-7xl md:text-8xl font-black tracking-tighter">
                {Math.round(current.temperature_2m)}°
              </div>
              <div className="text-medium-emphasis font-medium mt-1">
                Sajūtās kā {Math.round(current.apparent_temperature)}°
              </div>
            </div>
          </div>
        </div>

        {/* Current Conditions Grid */}
        <div className="grid grid-cols-2 gap-4 w-full md:w-auto z-10">
          <div className="bg-background/50 rounded-2xl p-4 border border-border/50 flex flex-col gap-1 min-w-[140px]">
            <Wind size={20} className="text-low-emphasis mb-1" />
            <span className="text-2xl font-bold">{Math.round(current.wind_speed_10m)} <span className="text-sm font-medium text-medium-emphasis">m/s</span></span>
            <span className="text-xs text-medium-emphasis">Vēja ātrums</span>
          </div>
          <div className="bg-background/50 rounded-2xl p-4 border border-border/50 flex flex-col gap-1 min-w-[140px]">
            <Droplets size={20} className="text-low-emphasis mb-1" />
            <span className="text-2xl font-bold">{current.relative_humidity_2m}<span className="text-sm font-medium text-medium-emphasis">%</span></span>
            <span className="text-xs text-medium-emphasis">Mitrums</span>
          </div>
          <div className="bg-background/50 rounded-2xl p-4 border border-border/50 flex flex-col gap-1 min-w-[140px] col-span-2">
            <Gauge size={20} className="text-low-emphasis mb-1" />
            <span className="text-2xl font-bold">{Math.round(current.pressure_msl)} <span className="text-sm font-medium text-medium-emphasis">hPa</span></span>
            <span className="text-xs text-medium-emphasis">Spiediens</span>
          </div>
        </div>

        {/* Background glow effect */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[300px] h-[300px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none"></div>
      </div>

      {/* Mini 7-Day Forecast Strip */}
      <div>
        <h2 className="text-xl font-bold mb-4 px-1">Tuvākās dienas</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {daily.time.map((time: string, index: number) => {
            const date = new Date(time);
            const isToday = index === 0;
            const dayName = isToday ? 'Šodien' : date.toLocaleDateString('lv-LV', { weekday: 'short' });

            return (
              <div key={time} className={`flex flex-col items-center justify-center p-4 rounded-2xl border ${isToday ? 'bg-ocean border-secondary/50' : 'bg-landmass border-border'}`}>
                <span className="text-xs font-medium uppercase text-medium-emphasis mb-3">
                  {dayName}
                </span>
                <WeatherIcon code={daily.weather_code[index]} className="w-10 h-10 mb-3" />
                <div className="flex items-center gap-3 font-bold">
                  <span>{Math.round(daily.temperature_2m_max[index])}°</span>
                  <span className="text-medium-emphasis font-medium">{Math.round(daily.temperature_2m_min[index])}°</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}