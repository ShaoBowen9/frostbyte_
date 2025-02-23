"use client"

import { useState } from "react"
import AvatarCustomizer from "../AvatarCustomizer/page"
import WeatherDisplay from "../WeatherDisplay/page"
import AIAnalysis from "../AiAnalysis/page"
import GlobeLocator from "../GlobeLocator/page"
import axios from "axios"
import { GoogleGenerativeAI } from "@google/generative-ai"
import Link from "next/link"
import SnowBackground from "../SnowBackground.tsx"
import Image from "next/image";
import logo from "../assets/logo.png";

// Add decorative elements configuration
const decorativeElements = {
  snowflakes: Array.from({ length: 15 }, (_, i) => ({
    id: `snowflake-${i}`,
    size: Math.random() * 15 + 5,
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 5}s`,
    opacity: Math.random() * 0.5 + 0.3,
  })),
}

// Rest of your existing imports and component code...

const Dashboard = () => {
  // Clothing State (keep your original structure)
  const [underLayers, setUnderLayers] = useState([])
  const [top, setTop] = useState("None")
  const [bottom, setBottom] = useState("None")

  // Location & Weather State (merged approach)
  const [cityInput, setCityInput] = useState("")
  const [selectedCity, setSelectedCity] = useState(null)
  const [countryInfo, setCountryInfo] = useState(null)
  const [weatherData, setWeatherData] = useState(null)
  const [cityOptions, setCityOptions] = useState([])

  // AI State
  const [aiResponse, setAiResponse] = useState("Gemini AI will analyze your input...")
  const [error, setError] = useState(null)

  const GEMINI_API_KEY = "AIzaSyBUp9DfpXww39o7UEofzgLvkknLDCHqUoU"
  const WEATHER_API_KEY = "02f4b78c4fe4ef6ae46a41482188ccc5"

  // City Validation (from second version)
  const validateCityWithAI = async (cityName) => {
    if (cityName.length < 3) return

    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
      const model = genAI.getGenerativeModel({ model: "gemini-pro" })

      const prompt = `For location "${cityName}", return JSON array of matches with:
        name, countryCode, state, lat, lon. Requirements:
        - Prioritize cities with population > 50,000
        - Match must contain "${cityName}" exactly
        - Use ISO country codes
        Format:
        [{"name":"...","countryCode":"...","state":"...","lat":...,"lon":...}]`

      const result = await model.generateContent(prompt)
      const text = await result.response.text()
      const jsonString = text.match(/```json([\s\S]*?)```/)?.[1] || text
      const cities = JSON.parse(jsonString)

      setCityOptions(cities)
      setError(null)
    } catch (err) {
      setError("Failed to validate location")
      setCityOptions([])
    }
  }

  // Weather Fetch (merged approach)
  const fetchWeather = async (city) => {
    try {
      // Get country details
      const countryRes = await axios.get(`https://restcountries.com/v3.1/alpha/${city.countryCode}`)
      setCountryInfo(countryRes.data[0])

      // Get weather data
      const weatherRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&units=metric&appid=${WEATHER_API_KEY}`,
      )

      setWeatherData({
        temp: weatherRes.data.main.temp,
        speed: weatherRes.data.wind.speed,
      })
      setError(null)
    } catch (err) {
      setError("Failed to fetch weather data")
      setWeatherData(null)
    }
  }

  // Analysis Generation (keep your original prompt structure)
  const generateAnalysis = async () => {
    if (!selectedCity || !weatherData) {
      setAiResponse("Error: Please enter valid city and get weather first.")
      return
    }

    const missingData = []
    if (!underLayers) missingData.push("clothing layers")
    if (!top) missingData.push("top wear")
    if (!bottom) missingData.push("bottom wear")
    if (!weatherData.temp) missingData.push("temperature")
    if (!weatherData.speed) missingData.push("wind speed")

    if (missingData.length > 0) {
      setAiResponse(`Error: Missing data - ${missingData.join(", ")}`)
      return
    }

    setAiResponse("Generating AI analysis...")

    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
      const model = genAI.getGenerativeModel({ model: "gemini-pro" })

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
6. Keep under 400 characters`

      const result = await model.generateContent(prompt)
      const responseText = await result.response.text()
      setAiResponse(responseText)
    } catch (error) {
      setAiResponse("Error: Failed to generate analysis. Please try again.")
      console.error("Gemini Error:", error)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-900 before:pointer-events-none">
      <SnowBackground />

      {/* Additional Floating Snowflakes */}
      {decorativeElements.snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="floating-snowflake"
          style={{
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            left: flake.left,
            animationDelay: flake.animationDelay,
            opacity: flake.opacity,
          }}
        />
      ))}

      {/* Snow Ground */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent z-10"></div>

      {/* Your existing component content... */}
      <div className="relative z-20 min-h-screen flex flex-col items-center p-6 text-white">
        {/* Top Navigation Buttons */}
        <div className="absolute top-6 left-6">
          <Link href="../FrostbyteGuardian">
            <button className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition">
            🔥Frostbyte Guardian 🔥
            </button>
          </Link>
        </div>

        {/* Sign Out Button */}
        <div className="absolute top-6 right-6">
          <Link href="../sign-in">
            <button className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition">
              Sign Out
            </button>
          </Link>
        </div>

        

        <h1 className="text-4xl font-bold text-blue-200 mb-6 animate-title flex items-center gap-3">
          <Image 
            src={logo} 
            alt="FrostByte Logo" 
            width={48} 
            height={48}
            className="h-10 w-10 md:h-12 md:w-12 object-contain"
          />
          FrostByte Dashboard
        </h1>
        <p className="text-lg text-gray-300 mb-4">
          Enter your location hit Get Weather. Then choose your clothing to analyze frostbite/hypothermia risk!
        </p>

        {/* Navigation Button for Saved Outfits */}
        <div className="w-full flex justify-center items-center gap-4 flex-wrap">
          <Link href="/SavedOutfits">
            <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition">
              View Saved Outfits
            </button>
          </Link>

          <div className="flex-1 max-w-md mt-4 flex gap-2">
            <input
              type="text"
              placeholder="Search city or region..."
              className="p-2 border rounded-lg flex-1 text-gray-800"
              value={cityInput}
              onChange={(e) => {
                setCityInput(e.target.value)
                validateCityWithAI(e.target.value)
              }}
            />
            <button
              onClick={() => selectedCity && fetchWeather(selectedCity)}
              className="bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
              disabled={!selectedCity}
            >
              Get Weather
            </button>
          </div>

          {cityOptions.length > 0 && (
            <div className="absolute z-30 w-full max-w-md bg-white border rounded-lg mt-1 shadow-lg max-h-60 overflow-auto">
              {cityOptions.map((city, index) => (
                <div
                  key={`${city.name}-${index}`}
                  className="p-2 hover:bg-blue-50 cursor-pointer border-b text-gray-800"
                  onClick={() => {
                    setSelectedCity(city)
                    setCityInput(`${city.name}${city.state ? `, ${city.state}` : ""} (${city.countryCode})`)
                    setCityOptions([])
                  }}
                >
                  <div className="font-medium">{city.name}</div>
                  <div className="text-sm text-gray-600">
                    {city.state && `${city.state}, `}
                    {city.countryCode}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl mt-6">
          <AvatarCustomizer
            underLayers={underLayers}
            setUnderLayers={setUnderLayers}
            top={top}
            setTop={setTop}
            bottom={bottom}
            setBottom={setBottom}
          />

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
              <h2 className="text-2xl font-semibold text-blue-200">
                {selectedCity.name}, {countryInfo.name.common}
              </h2>
              <img
                src={countryInfo.flags.png || "/placeholder.svg"}
                alt="Country Flag"
                className="h-12 mx-auto rounded shadow-md"
              />
            </div>
          </div>
        )}

        {weatherData && (
          <WeatherDisplay city={selectedCity.name} country={countryInfo.name.common} weatherData={weatherData} />
        )}

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  )
}

// Add the required CSS animations
const styles = `
  @keyframes float {
    0%, 100% {
      transform: translateY(0) rotate(0deg);
    }
    50% {
      transform: translateY(-20px) rotate(180deg);
    }
  }

  @keyframes titleBob {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  .animate-title {
    animation: titleBob 3s ease-in-out infinite;
  }

  /* Add northern lights gradient */
  .bg-gray-900::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      45deg,
      rgba(12, 20, 69, 0.7),
      rgba(97, 255, 168, 0.2),
      rgba(45, 149, 237, 0.2),
      rgba(185, 103, 255, 0.2)
    );
    background-size: 400% 400%;
    animation: aurora 15s ease infinite;
    z-index: 5;
  }

  @keyframes aurora {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
  
  .floating-snowflake {
    position: fixed;
    background-color: white;
    border-radius: 50%;
    pointer-events: none;
    animation: float 3s ease-in-out infinite;
    z-index: 15;
  }
`

// Add the styles to the document
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style")
  styleSheet.textContent = styles
  document.head.appendChild(styleSheet)
}

export default Dashboard

