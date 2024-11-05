"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { AlertaPersonalizadoProps, WeatherData } from "./types";

const AlertaPersonalizado: React.FC<AlertaPersonalizadoProps> = ({
  mensagem,
  onClose,
}) => {
  return (
    <div
      className="fixed top-4 right-4 bg-red-600 text-white p-2 lg:p-4 rounded-md flex items-center shadow-lg max-w-xs sm:max-w-sm"
      role="alert"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 mr-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1 8h.01M12 12V8m0 4h.01m-6.93 5.42a2 2 0 00-.516-.134 2 2 0 00-2.196.921c-.294.43-.858.67-1.404.622-.526-.047-1.053-.374-1.337-.918-.367-.684-.486-1.48-.324-2.215C.924 11.136 3.8 4.05 12 4c8.2.05 11.076 7.136 11.686 9.98.161.736.043 1.53-.324 2.215-.284.544-.811.871-1.337.918-.546.048-1.11-.191-1.404-.622a2 2 0 00-2.196-.921c-.184.053-.355.134-.516.134h-.1"
        />
      </svg>
      <span className="text-sm lg:text-base">{mensagem}</span>
      <button
        className="ml-4 text-xs lg:text-sm text-white hover:underline"
        onClick={onClose}
      >
        Fechar
      </button>
    </div>
  );
};

const Spinner = () => (
  <div className="flex justify-center items-center">
    <div className="animate-spin h-8 w-8 border-4 border-t-4 border-fuchsia-400 border-t-transparent rounded-full"></div>
  </div>
);

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
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric&lang=pt`
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

  return (
    <>
      <h1 className="pt-20 pb-10 px-4 sm:py-10 sm:px-9 text-left text-[40px] sm:text-[60px] font-bold text-fuchsia-200 font-poppins">
        Real Time Weather System
      </h1>
      <div className="text-center mb-4 text-black">
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
      {error && (
        <AlertaPersonalizado mensagem={error} onClose={() => setError(null)} />
      )}
      <div className="mx-auto ml-4 mr-4 sm:mx-auto sm:p-10 p-4 max-w-md bg-[#7873dc] h-200px min-h-[200px] rounded-3xl">
        {loading ? (
          <Spinner />
        ) : (
          <>
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
            <p className="mt-2 text-center font-poppins">
              Temperatura:{" "}
              {weatherData?.main.temp !== undefined
                ? Math.round(weatherData.main.temp) + " °C"
                : ""}
            </p>

            <p className="text-center font-poppins">
              Descrição: {weatherData?.weather[0].description}
            </p>
            <p className="text-center font-poppins">
              Umidade: {weatherData?.main.humidity}%
            </p>
            <p className="text-center font-poppins">
              Vento: {weatherData?.wind.speed} m/s
            </p>
          </>
        )}
      </div>
    </>
  );
};

export default WeatherPage;
