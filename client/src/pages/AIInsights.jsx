import React, { useEffect, useState } from "react";
import axios from "axios";
import Chart from "chart.js/auto";

const AIInsights = () => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/ai/insights", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setInsights(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching AI insights", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">📊 AI Financial Insights</h1>

      {loading ? (
        <p className="text-gray-600">Loading insights...</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Smart Saving Tips</h2>
            <p className="text-gray-600">{insights.savingTips}</p>
          </div>

          <div className="p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Alternative Expense Suggestions</h2>
            <p className="text-gray-600">{insights.expenseSuggestions}</p>
          </div>

          <div className="p-6 bg-white shadow-lg rounded-lg col-span-2">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Investment Recommendations</h2>
            <p className="text-gray-600">{insights.investmentSuggestions}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIInsights;
