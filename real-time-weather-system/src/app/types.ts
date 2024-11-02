export interface WeatherData {
  name: string;
  weather: { icon: string; description: string }[];
  main: { temp: number; humidity: number };
  wind: { speed: number };
}
