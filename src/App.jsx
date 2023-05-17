import React, { useEffect, useState } from "react";
import hotBg from "./assets/hot.jpg";
import coldBg from "./assets/cold.jpg";
import Descriptions from "./Components/Descriptions";
import { getFormattedWeatherData } from "./WeatherService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CityData from "./CityList.json";

function App() {
  const [city, setCity] = useState("Arambagh");
  const [weather, setWeather] = useState(null);
  const [units, setUnits] = useState("metric");
  const [value, setValue] = useState("");

  const [bg, setBg] = useState(hotBg);

  useEffect(() => {
    const fetchWeatherData = async () => {
      const data = await getFormattedWeatherData(city, units);
      setWeather(data);

      //  Dynamic Background

      const threshold = units === "metric" ? 20 : 60;
      if (data.temp <= threshold) setBg(coldBg);
      else setBg(hotBg);
    };

    fetchWeatherData();
  }, [units, city]);


  const handleUnitsClick = (e) => {
    const button = e.currentTarget;
    const currentUnit = button.innerText.slice(1);

    const isCelsius = currentUnit === "C";
    button.innerText = isCelsius ? "°F" : "°C";
    setUnits(isCelsius ? "metric" : "imperial");
  };

  const enterKeyPressed = (e) => {
    if (e.keyCode === 13) {
      setCity(e.currentTarget.value);
      setValue("");
      e.currentTarget.blur();
    }
  };

  const handleSearchClick = () => {
    const input = document.querySelector("input[name='city']");
    setCity(input.value);
    input.value = "";
    setValue("");
  };

  

  const invalidCityToast = () => {
    toast.error("Oops Invalid City Name! Sorry This City Not Found! ", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };

  const onChange = (event) => {
    setValue(event.target.value);
  };

  const onSearch = (searchTerm) => {
    setValue(searchTerm);
  };

  return (
    <div className="app" style={{ backgroundImage: `url(${bg})` }}>
      <div className="overlay">
        {weather && (
          <div className="container">
            <div className="section section__inputs search-container">
              <input
                onKeyDown={enterKeyPressed}
                onChange={onChange}
                type="text"
                name="city"
                placeholder="Enter City."
                value={value}
              />

              <div className="suggestion">
                {CityData.filter((item) => {
                  const searchTerm = value.toLowerCase();
                  const cityName = item.name.toLowerCase();

                  return (
                    searchTerm &&
                    cityName.startsWith(searchTerm) &&
                    name !== searchTerm
                  );
                })
                  .slice(0, 10)
                  .map((item) => (
                    <div
                      onClick={() => onSearch(item.name)}
                      className="suggestion-row"
                      key={item.id}
                    >
                      {item.name}
                    </div>
                  ))}
              </div>
              <button
                onClick={() => {
                  handleSearchClick();
                  onSearch(value);
                  // invalidCityToast();
                }}
              >
                Search
              </button>

              <button onClick={(e) => handleUnitsClick(e)}>°F</button>
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
