"use client";

import React, { useEffect, useState } from "react";

const WeatherPage = () => {
  const [weatherData, setWeatherData] = useState<any>(null);
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

  if (loading) return <p className="text-center">Carregando...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <>
      <h1 className="text-center text-3xl mb-12 font-bold bg-zinc-400">
        Sistema de Clima em Tempo Real
      </h1>
      <div className="text-center mb-4 text-black ">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Digite o nome da cidade"
          className="p-2 w-48 rounded"
        />
        <button
          onClick={handleSearch}
          className="p-2 ml-2 bg-blue-500 text-white rounded"
        >
          Buscar
        </button>
      </div>
      <div className="p-4 max-w-md mx-auto bg-slate-500 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-center">
          Clima em {weatherData.name}
        </h2>
        <img
          src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`}
          alt={weatherData.weather[0].description}
          className="mx-auto"
        />
        <p className="mt-2 text-center">
          Temperatura: {weatherData.main.temp} °C
        </p>
        <p className="text-center">
          Descrição: {weatherData.weather[0].description}
        </p>
        <p className="text-center">Umidade: {weatherData.main.humidity}%</p>
        <p className="text-center">Vento: {weatherData.wind.speed} m/s</p>
      </div>
    </>
  );
};

export default WeatherPage;
