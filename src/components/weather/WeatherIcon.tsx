import { 
  Sun, Moon, Cloud, CloudRain, CloudLightning, 
  Snowflake, CloudFog, CloudSun, CloudMoon, CloudDrizzle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface WeatherIconProps {
  code: number;
  isDay?: number;
  className?: string;
}

export function WeatherIcon({ code, isDay = 1, className }: WeatherIconProps) {
  const classes = cn("text-secondary", className);

  // WMO Weather interpretation codes
  switch (true) {
    case code === 0:
      return isDay ? <Sun className={classes} /> : <Moon className={classes} />;
    case code === 1 || code === 2:
      return isDay ? <CloudSun className={classes} /> : <CloudMoon className={classes} />;
    case code === 3:
      return <Cloud className={classes} />;
    case code === 45 || code === 48:
      return <CloudFog className={cn("text-medium-emphasis", className)} />;
    case code >= 51 && code <= 57:
      return <CloudDrizzle className={classes} />;
    case code >= 61 && code <= 67:
    case code >= 80 && code <= 82:
      return <CloudRain className={classes} />;
    case code >= 71 && code <= 77:
    case code === 85 || code === 86:
      return <Snowflake className={cn("text-high-emphasis", className)} />;
    case code >= 95 && code <= 99:
      return <CloudLightning className={cn("text-alert", className)} />;
    default:
      return <Sun className={classes} />;
  }
}