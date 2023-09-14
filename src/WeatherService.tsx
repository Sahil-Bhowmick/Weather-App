const API_KEY: string = "c8404ac4402927c635b7f460759abc00";

const makeIconURL = (iconId: string): string =>
  `https://openweathermap.org/img/wn/${iconId}@2x.png`;

interface WeatherData {
  description: string;
  iconURL: string;
  temp: number;
  feels_like: number;
  temp_max: number;
  temp_min: number;
  pressure: number;
  humidity: number;
  speed: number;
  country: string;
  name: string;
}

const getFormattedWeatherData = async (
  city: string,
  units: string = "metric"
): Promise<WeatherData> => {
  const URL: string = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${units}`;

  const data = await fetch(URL)
    .then((res) => res.json())
    .then((data) => data);

  const {
    weather,
    main: { temp, feels_like, temp_max, temp_min, pressure, humidity },
    wind: { speed },
    sys: { country },
    name,
  } = data;
  const { description, icon } = weather[0];

  return {
    description,
    iconURL: makeIconURL(icon),
    temp,
    feels_like,
    temp_min,
    temp_max,
    pressure,
    humidity,
    speed,
    country,
    name,
  };
};

export { getFormattedWeatherData };
export type { WeatherData };
