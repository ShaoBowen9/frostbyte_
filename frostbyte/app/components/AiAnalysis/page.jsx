import React from "react";

const AIAnalysis = ({ aiResponse, generateAnalysis }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-4xl"> {/* Full width with max */}
      <label className="block text-gray-700 font-medium mb-2 text-lg">AI Risk Analysis</label>
      <textarea
        className="w-full p-4 border-2 rounded-xl bg-gray-50 text-gray-700 text-md"
        rows="10"
        value={aiResponse}
        readOnly
        style={{ minHeight: '250px', fontFamily: 'monospace' }}
      ></textarea>
      <button
        onClick={generateAnalysis}
        className="mt-6 w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition text-lg"
      >
        Generate Safety Analysis
      </button>
    </div>
  );
};

export default AIAnalysis;