'use client';

import React, { useState } from "react";
import AvatarCustomizer from "../AvatarCustomizer/page";
import WeatherDisplay from "../WeatherDisplay/page";
import AIAnalysis from "../AiAnalysis/page";
import GlobeLocator from "../GlobeLocator/page";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";

const Dashboard = () => {
  // Clothing State (keep your original structure)
  const [underLayers, setUnderLayers] = useState([]);
  const [top, setTop] = useState("None");
  const [bottom, setBottom] = useState("None");

  // Location & Weather State (merged approach)
  const [cityInput, setCityInput] = useState("");
  const [selectedCity, setSelectedCity] = useState(null);
  const [countryInfo, setCountryInfo] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [cityOptions, setCityOptions] = useState([]);

  // AI State
  const [aiResponse, setAiResponse] = useState("Gemini AI will analyze your input...");
  const [error, setError] = useState(null);

  const GEMINI_API_KEY = "AIzaSyBUp9DfpXww39o7UEofzgLvkknLDCHqUoU";
  const WEATHER_API_KEY = "02f4b78c4fe4ef6ae46a41482188ccc5";

  // City Validation (from second version)
  const validateCityWithAI = async (cityName) => {
    if (cityName.length < 3) return;

    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const prompt = `For location "${cityName}", return JSON array of matches with:
        name, countryCode, state, lat, lon. Requirements:
        - Prioritize cities with population > 50,000
        - Match must contain "${cityName}" exactly
        - Use ISO country codes
        Format:
        [{"name":"...","countryCode":"...","state":"...","lat":...,"lon":...}]`;

      const result = await model.generateContent(prompt);
      const text = await result.response.text();
      const jsonString = text.match(/```json([\s\S]*?)```/)?.[1] || text;
      const cities = JSON.parse(jsonString);

      setCityOptions(cities);
      setError(null);
    } catch (err) {
      setError("Failed to validate location");
      setCityOptions([]);
    }
  };

  // Weather Fetch (merged approach)
  const fetchWeather = async (city) => {
    try {
      // Get country details
      const countryRes = await axios.get(
        `https://restcountries.com/v3.1/alpha/${city.countryCode}`
      );
      setCountryInfo(countryRes.data[0]);

      // Get weather data
      const weatherRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&units=metric&appid=${WEATHER_API_KEY}`
      );

      setWeatherData({
        temp: weatherRes.data.main.temp,
        speed: weatherRes.data.wind.speed,
      });
      setError(null);
    } catch (err) {
      setError("Failed to fetch weather data");
      setWeatherData(null);
    }
  };

  // Analysis Generation (keep your original prompt structure)
  const generateAnalysis = async () => {
    if (!selectedCity || !weatherData) {
      setAiResponse("Error: Please enter valid city and get weather first.");
      return;
    }

    const missingData = [];
    if (!underLayers) missingData.push("clothing layers");
    if (!top) missingData.push("top wear");
    if (!bottom) missingData.push("bottom wear");
    if (!weatherData.temp) missingData.push("temperature");
    if (!weatherData.speed) missingData.push("wind speed");

    if (missingData.length > 0) {
      setAiResponse(`Error: Missing data - ${missingData.join(", ")}`);
      return;
    }

    setAiResponse("Generating AI analysis...");

    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const prompt = `Safety Analysis Request:

**User Input Summary**
- Location: ${selectedCity.name}, ${countryInfo.name.common}
- Temperature: ${weatherData.temp}°C
- Wind Speed: ${weatherData.speed} m/s
- Clothing Layers: ${underLayers.join(", ") || "None"}
- Outer Top: ${top}
- Outer Bottom: ${bottom}

Please format your response as:
1. Begin with "Based on your selections in ${selectedCity.name}:"
2. List all clothing items clearly
3. State weather conditions
4. Provide analysis with:
   a) Hypothermia risk level
   b) Frostbite risk level
   c) Safe exposure time
   d) Improvement suggestions
5. Use emojis where appropriate
6. Keep under 400 characters`;

      const result = await model.generateContent(prompt);
      const responseText = await result.response.text();
      setAiResponse(responseText);
    } catch (error) {
      setAiResponse("Error: Failed to generate analysis. Please try again.");
      console.error("Gemini Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-300 to-white flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold text-blue-900 mb-6">FrostByte Dashboard</h1>
      <p className="text-lg text-gray-700 mb-4">Enter your location and clothing choice to analyze hypothermia risk.</p>

      <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl">
        <AvatarCustomizer 
          underLayers={underLayers}
          setUnderLayers={setUnderLayers}
          top={top}
          setTop={setTop}
          bottom={bottom}
          setBottom={setBottom}
        />

        <div className="flex flex-col w-full space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search city or region..."
              className="p-2 border rounded-lg w-full"
              value={cityInput}
              onChange={(e) => {
                setCityInput(e.target.value);
                validateCityWithAI(e.target.value);
              }}
            />

            {cityOptions.length > 0 && (
              <div className="absolute z-10 w-full bg-white border rounded-lg mt-1 shadow-lg max-h-60 overflow-auto">
                {cityOptions.map((city, index) => (
                  <div
                    key={`${city.name}-${index}`}
                    className="p-2 hover:bg-blue-50 cursor-pointer border-b"
                    onClick={() => {
                      setSelectedCity(city);
                      setCityInput(`${city.name}${city.state ? `, ${city.state}` : ''} (${city.countryCode})`);
                      setCityOptions([]);
                    }}
                  >
                    <div className="font-medium">{city.name}</div>
                    <div className="text-sm text-gray-600">
                      {city.state && `${city.state}, `}{city.countryCode}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => selectedCity && fetchWeather(selectedCity)}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
            disabled={!selectedCity}
          >
            Get Weather Data
          </button>
        </div>

        <AIAnalysis 
          aiResponse={aiResponse} 
          generateAnalysis={generateAnalysis} 
          disabled={!selectedCity || !weatherData}
        />
      </div>

      {selectedCity && countryInfo && (
        <div className="w-full max-w-4xl mt-8">
          <GlobeLocator city={selectedCity} country={countryInfo} />
          <div className="mt-4 text-center space-y-2">
            <h2 className="text-2xl font-semibold">
              {selectedCity.name}, {countryInfo.name.common}
            </h2>
            <img
              src={countryInfo.flags.png}
              alt="Country Flag"
              className="h-12 mx-auto rounded shadow-md"
            />
          </div>
        </div>
      )}

      {weatherData && (
        <WeatherDisplay 
          city={selectedCity.name} 
          country={countryInfo.name.common}
          weatherData={weatherData} 
        />
      )}

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default Dashboard;