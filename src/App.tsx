import { useEffect, useState, KeyboardEvent, ChangeEvent } from "react";
import hotBg from "./assets/hot.jpg";
import coldBg from "./assets/cold.jpg";
import Descriptions from "./Components/Descriptions";
import { getFormattedWeatherData, WeatherData } from "./WeatherService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CityData from "./CityList.json";
import { BsSearch } from "react-icons/bs";

function App() {
  const [city, setCity] = useState<string>("Arambagh");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [units, setUnits] = useState<"metric" | "imperial">("metric");
  const [value, setValue] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState<boolean>(true);
  const [bg, setBg] = useState(hotBg);

  useEffect(() => {
    const fetchWeatherData = async () => {
      const data = await getFormattedWeatherData(city, units);
      setWeather(data);

      //  Dynamic Background
      const threshold = units === "metric" ? 20 : 60;
      if (data?.temp && data.temp <= threshold) setBg(coldBg);
      else setBg(hotBg);
    };

    fetchWeatherData();
  }, [units, city]);

  const handleUnitsClick = () => {
    setUnits((prevUnits) => (prevUnits === "metric" ? "imperial" : "metric"));
  };

  const enterKeyPressed = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13) {
      setCity(value);
      setValue("");
      setShowSuggestions(false);
    }
  };

  const handleSearchClick = () => {
    setCity(value);
    setValue("");
    setShowSuggestions(false);
  };

  // const invalidCityToast = () => {
  //   toast.error("Oops Invalid City Name! Sorry This City Not Found! ", {
  //     position: "top-right",
  //     autoClose: 3000,
  //     hideProgressBar: false,
  //     closeOnClick: true,
  //     pauseOnHover: true,
  //     draggable: true,
  //     progress: undefined,
  //     theme: "dark",
  //   });
  // };

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    setShowSuggestions(true);
  };

  const onSearch = (searchTerm: string) => {
    setValue(searchTerm);
    setShowSuggestions(false);
  };

  return (
    <div className="app" style={{ backgroundImage: `url(${bg})` }}>
      <div className="overlay">
        {weather && (
          <div className="container">
            <div className="section section__inputs search-container">
              <div className="search-box">
                <input
                  onKeyDown={enterKeyPressed}
                  onChange={onChange}
                  type="text"
                  placeholder="Enter city name..."
                  value={value}
                />
                <button onClick={handleSearchClick}>
                  <BsSearch />
                </button>
              </div>
              {showSuggestions && (
                <div className="suggestion">
                  {CityData.filter((item) => {
                    const searchTerm = value.toLowerCase();
                    const cityName = item.name.toLowerCase();

                    return (
                      searchTerm &&
                      cityName.startsWith(searchTerm) &&
                      item.name !== searchTerm
                    );
                  })
                    .slice(0, 10)
                    .map((item) => (
                      <div
                        onClick={() => onSearch(item.name)}
                        className="suggestion-row"
                        key={item.name}
                      >
                        {item.name}
                      </div>
                    ))}
                </div>
              )}
              <button onClick={handleUnitsClick}>
                {units === "metric" ? "°F" : "°C"}
              </button>
              <ToastContainer />
            </div>
            <div className="section section__temperature">
              <div className="icon">
                <h3>{`${weather.name}, ${weather.country}`}</h3>
                <img src={weather.iconURL} alt="WeatherIcon" />
                <h3>{weather.description}</h3>
              </div>
              <div className="temperature">
                <h1>{`${weather.temp.toFixed()} °${
                  units === "metric" ? "C" : "F"
                }`}</h1>
              </div>
            </div>
            {/* Bottom Description */}
            <Descriptions weather={weather} units={units} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
