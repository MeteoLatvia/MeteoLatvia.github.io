import { useQuery } from '@tanstack/react-query';
import { fetchWeather, DEFAULT_LOCATION } from '@/lib/api';
import { WeatherIcon } from '@/components/weather/WeatherIcon';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';
import { lv } from 'date-fns/locale';

export function Forecast() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['weather', DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lon],
    queryFn: () => fetchWeather(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lon),
  });

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-10 bg-landmass rounded w-1/3 mb-8"></div>
        <div className="h-[400px] bg-landmass rounded-3xl w-full"></div>
        <div className="h-64 bg-landmass rounded-3xl w-full"></div>
      </div>
    );
  }

  if (isError || !data) {
    return <div className="text-emergency font-bold">Kļūda ielādējot datus.</div>;
  }

  // Transform hourly data for the chart (next 48 hours)
  const currentHourIndex = data.hourly.time.findIndex((t: string) => new Date(t) >= new Date());
  const chartData = data.hourly.time
    .slice(currentHourIndex, currentHourIndex + 48)
    .map((time: string, index: number) => ({
      time: time,
      temp: Math.round(data.hourly.temperature_2m[currentHourIndex + index]),
      precip: data.hourly.precipitation_probability[currentHourIndex + index],
      formattedTime: format(parseISO(time), 'HH:mm'),
    }));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">Detalizēta Prognoze</h1>
        <p className="text-medium-emphasis">Tuvāko 48 stundu meteogramma un nedēļas pārskats ({DEFAULT_LOCATION.name}).</p>
      </div>

      {/* Meteogram Chart (Recharts) */}
      <div className="bg-landmass border border-border rounded-3xl p-6 md:p-8">
        <h2 className="text-xl font-bold mb-6">48 Stundu Temperatūra</h2>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00a6e1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00a6e1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis 
                dataKey="formattedTime" 
                stroke="#64748B" 
                fontSize={12} 
                tickLine={false}
                axisLine={false}
                minTickGap={30}
              />
              <YAxis 
                stroke="#64748B" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(val) => `${val}°`} 
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#F8FAFC' }}
                itemStyle={{ color: '#00a6e1', fontWeight: 'bold' }}
                labelStyle={{ color: '#94A3B8', marginBottom: '4px' }}
                labelFormatter={(label) => `Plkst. ${label}`}
                formatter={(value: number) => [`${value}°C`, 'Temperatūra']}
              />
              <Area 
                type="monotone" 
                dataKey="temp" 
                stroke="#00a6e1" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorTemp)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Daily List */}
      <div>
        <h2 className="text-xl font-bold mb-4 px-1">7 Dienu Pārskats</h2>
        <div className="flex flex-col gap-3">
          {data.daily.time.map((time: string, index: number) => {
            const date = parseISO(time);
            const isToday = index === 0;
            const dayName = isToday ? 'Šodien' : format(date, 'EEEE', { locale: lv });
            const formattedDate = format(date, 'd. MMM', { locale: lv });

            return (
              <div 
                key={time} 
                className={`flex items-center justify-between p-4 rounded-2xl border ${isToday ? 'bg-ocean border-secondary/50' : 'bg-landmass border-border'} hover:border-secondary/30 transition-colors`}
              >
                <div className="w-32">
                  <div className="font-bold capitalize">{dayName}</div>
                  <div className="text-xs text-medium-emphasis">{formattedDate}</div>
                </div>
                
                <div className="flex items-center gap-4 flex-grow justify-center">
                  <WeatherIcon code={data.daily.weather_code[index]} className="w-8 h-8" />
                  <div className="hidden sm:flex items-center gap-1 text-xs font-medium text-medium-emphasis w-16">
                    <span className="text-secondary/70">{data.daily.precipitation_probability_max[index]}%</span> 
                    nol.
                  </div>
                </div>

                <div className="flex items-center gap-4 w-32 justify-end font-bold text-lg text-right">
                  <span>{Math.round(data.daily.temperature_2m_max[index])}°</span>
                  <span className="text-medium-emphasis">{Math.round(data.daily.temperature_2m_min[index])}°</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}