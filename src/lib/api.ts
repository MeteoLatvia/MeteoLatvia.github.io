export const DEFAULT_LOCATION = {
  name: 'Rīga',
  lat: 56.9496,
  lon: 24.1052,
};

export async function fetchWeather(lat = DEFAULT_LOCATION.lat, lon = DEFAULT_LOCATION.lon) {
  // Added &hourly=temperature_2m,precipitation_probability,weather_code to the URL
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Europe%2FRiga&models=best_match`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch weather data');
  }
  
  return response.json();
}