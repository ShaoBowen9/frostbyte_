"use client"

const AIAnalysis = ({ aiResponse, generateAnalysis }) => {
  return (
    <div className="bg-gradient-to-br from-[#f0f8ff] via-[#e6f3ff] to-[#f0f8ff] p-6 rounded-xl shadow-lg w-full max-w-4xl">
      <label className="block text-[#000080] font-medium mb-2 text-lg">AI Risk Analysis</label>
      <div className="relative w-full overflow-hidden rounded-xl bg-gradient-to-br from-[#f5faff] via-[#edf6ff] to-[#f5faff] p-[2px]">
        <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        <textarea
          className="w-full p-4 rounded-xl text-[#000080] text-md relative
                     bg-gradient-to-br from-[#f5faff] via-[#edf6ff] to-[#f5faff]
                     border-0 focus:outline-none focus:ring-2 focus:ring-blue-200"
          rows="10"
          value={aiResponse}
          readOnly
          style={{ minHeight: "250px", fontFamily: "monospace" }}
        />
      </div>
      <button
        onClick={generateAnalysis}
        className="mt-6 w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition text-lg"
      >
        Generate Safety Analysis
      </button>
    </div>
  )
}

export default AIAnalysis

