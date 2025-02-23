import React from "react";

const WeatherDisplay = ({ city, weatherData }) => {
  return (
    <div className="mt-6 p-4 bg-white shadow-lg rounded-xl w-full max-w-lg text-center">
      <h2 className="text-xl font-semibold text-blue-900">Weather in {city}</h2>
      <p className="text-gray-700">🌡️ Temperature: {weatherData.temp}°C</p>
      <p className="text-gray-700">💨 Wind Speed: {weatherData.speed} m/s</p>
    </div>
  );
};

export default WeatherDisplay;