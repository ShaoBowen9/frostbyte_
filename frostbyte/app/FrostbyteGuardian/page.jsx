"use client"

import { useState } from "react"
import Link from "next/link"
import { Snowflake, Thermometer, AlertTriangle, ArrowLeft, Wind } from "lucide-react"
import SnowBackground from "../components/SnowBackground.tsx"
import { GoogleGenerativeAI } from "@google/generative-ai"

const GEMINI_API_KEY = "AIzaSyBUp9DfpXww39o7UEofzgLvkknLDCHqUoU"

const FrostbyteGuardian = () => {
  const [symptoms, setSymptoms] = useState("")
  const [analysis, setAnalysis] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Array of snowflake configurations
  const decorativeSnowflakes = [
    { top: "10%", right: "10%", size: "12", delay: "0" },
    { top: "20%", left: "15%", size: "8", delay: "300" },
    { top: "15%", right: "25%", size: "10", delay: "150" },
    { top: "30%", left: "8%", size: "14", delay: "450" },
    { top: "40%", right: "15%", size: "9", delay: "600" },
    { bottom: "15%", left: "20%", size: "11", delay: "750" },
    { bottom: "25%", right: "12%", size: "13", delay: "900" },
    { bottom: "35%", left: "25%", size: "7", delay: "1050" },
    { bottom: "10%", right: "20%", size: "10", delay: "1200" },
    { top: "50%", right: "30%", size: "8", delay: "1350" },
    { top: "60%", left: "30%", size: "12", delay: "1500" },
    { bottom: "40%", right: "25%", size: "9", delay: "1650" },
  ]

  const analyzeSymptoms = async () => {
    if (!symptoms.trim()) {
      setError("Please describe your symptoms first")
      return
    }

    setLoading(true)
    setError("")
    setAnalysis("")

    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
      const model = genAI.getGenerativeModel({ model: "gemini-pro" })

      const prompt = `Analyze these hypothermia/frostbite symptoms: "${symptoms}". 
        Provide:
        1. Potential risk level (Low/Medium/High) with the degree of frostbite if applicable
        2. Type of risk (frostbite, hypothermia, etc) with explaination of what it is
        3. Immediate recommended actions
        4. Prevention tips
        Be short, clear and concise. Keep under 300 characters.`

      const result = await model.generateContent(prompt)
      const response = await result.response.text()
      setAnalysis(response)
    } catch (err) {
      setError("Failed to analyze symptoms. Please try again.")
      console.error("Analysis error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <SnowBackground />

      {/* Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-32 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white/10 to-transparent pointer-events-none" />

      {/* Decorative Snowflakes */}
      {decorativeSnowflakes.map((flake, index) => (
        <div
          key={index}
          className="fixed text-white/20 pointer-events-none"
          style={{
            top: flake.top,
            bottom: flake.bottom,
            left: flake.left,
            right: flake.right,
            animation: `pulse 2s infinite ${flake.delay}ms, float 20s infinite ${flake.delay}ms`,
          }}
        >
          <Snowflake className={`w-${flake.size} h-${flake.size}`} />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-20 min-h-screen flex flex-col items-center justify-center p-6">
        {/* Back Button */}
        <Link href="../components/Dashboard">
          <button className="absolute top-4 left-4 bg-blue-600/90 backdrop-blur-sm text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 border border-white/20">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </Link>

        {/* Main Content */}
        <div className="w-full max-w-2xl mx-auto bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 shadow-xl">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Thermometer className="w-8 h-8 text-blue-200" />
            <h1 className="text-4xl font-bold text-blue-100">Frostbyte Guardian</h1>
            <Thermometer className="w-8 h-8 text-blue-200" />
          </div>

          <p className="text-lg text-blue-100 mb-8 text-center">
            Enter any symptoms you are experiencing, and the AI will assess your risk level.
          </p>

          <div className="relative">
            <textarea
              className="w-full p-4 rounded-xl bg-white/90 backdrop-blur-sm border-2 border-blue-200/30 
                       shadow-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent
                       text-gray-800 placeholder-gray-500"
              rows="4"
              placeholder="Describe your symptoms (e.g., numb fingers, shivering, confusion)..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
            />
            <div className="absolute -bottom-1 left-0 right-0 h-12 bg-gradient-to-t from-white/40 to-transparent rounded-b-xl pointer-events-none" />
          </div>

          <button
            onClick={analyzeSymptoms}
            disabled={loading}
            className="mt-6 w-full bg-blue-600/90 backdrop-blur-sm text-white py-3 px-6 rounded-xl
                     hover:bg-blue-700 transition flex items-center justify-center gap-2
                     border border-white/20 shadow-lg disabled:opacity-50"
          >
            {loading ? (
              <>
                <Wind className="w-5 h-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Snowflake className="w-5 h-5" />
                Analyze Symptoms
              </>
            )}
          </button>

          {error && (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg backdrop-blur-sm flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-200" />
              <p className="text-red-200">{error}</p>
            </div>
          )}

          {analysis && (
            <div className="mt-6 p-6 bg-white/90 backdrop-blur-md rounded-xl border border-blue-200/30 shadow-lg">
              <h2 className="text-xl font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <Thermometer className="w-5 h-5" />
                Risk Analysis
              </h2>
              <p className="text-gray-800 whitespace-pre-line">{analysis}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Add floating animation keyframes
const styles = `
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}
`

// Add the styles to the document
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style")
  styleSheet.textContent = styles
  document.head.appendChild(styleSheet)
}

export default FrostbyteGuardian

