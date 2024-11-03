"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { WeatherData } from "./types";

const WeatherPage = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState<string>("São Paulo");
  const [inputValue, setInputValue] = useState<string>("");

  const API_KEY = "aea7aeabc31e6173bd597d7b9c61712f";

  const fetchWeatherData = async (cityName: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar os dados");
      }

      const data = await response.json();
      setWeatherData(data);
      setError(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocorreu um erro desconhecido");
      }
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData(city);
  }, [city]);

  const handleSearch = () => {
    if (inputValue.trim() !== "") {
      setCity(inputValue);
      setInputValue("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  if (loading)
    return <p className="text-center text-2xl font-bold">Carregando...</p>;
  if (error)
    return (
      <p className="text-red-600 text-center font-bold text-2xl">{error}</p>
    );

  return (
    <>
      <h1 className="py-6 px-4 sm:py-10 sm:px-9 text-left text-[40px] sm:text-[60px] font-bold text-fuchsia-200 font-poppins  ">
        Real Time Weather System
      </h1>
      <div className="text-center mb-4 text-black ">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Digite o nome da cidade"
          className="p-2 w-52 rounded font-poppins text-[15px]"
        />
        <button
          onClick={handleSearch}
          className="p-2 ml-2 bg-fuchsia-400 text-white rounded font-poppins text-[15px]"
        >
          Buscar
        </button>
      </div>
      <div className="mx-auto ml-4 mr-4  sm:mx-auto sm:p-10 p-4 max-w-md bg-[#7873dc] min-h-[200px] rounded-3xl">
        <h2 className="sm:text-[30px]/[40px] text-[25px] font-bold text-center font-poppins">
          Clima em {weatherData?.name}
        </h2>
        {weatherData && weatherData.weather && weatherData.weather[0] && (
          <Image
            src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`}
            alt={weatherData.weather[0].description}
            width={50}
            height={500}
            className="mx-auto"
          />
        )}
        <p className="mt-2 text-center font-poppins ">
          Temperatura: {weatherData?.main.temp} °C
        </p>
        <p className="text-center font-poppins ">
          Descrição: {weatherData?.weather[0].description}
        </p>
        <p className="text-center font-poppins ">
          Umidade: {weatherData?.main.humidity}%
        </p>
        <p className="text-center font-poppins ">
          Vento: {weatherData?.wind.speed} m/s
        </p>
      </div>
    </>
  );
};

export default WeatherPage;
