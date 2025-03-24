import { useState, useEffect } from "react";
import { api, getAuthHeaders } from "../../utils/api";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import toast from "react-hot-toast";
import { ChartBarIcon, QuestionMarkCircleIcon, LightBulbIcon, CurrencyDollarIcon } from "@heroicons/react/outline";


const FinancialInsights = () => {
  const [insights, setInsights] = useState(null);
  const [query, setQuery] = useState("");
  const [queryResponse, setQueryResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [queryLoading, setQueryLoading] = useState(false);

  useEffect(() => {
    fetchFinancialInsights();
  }, []);

  const fetchFinancialInsights = async () => {
    setLoading(true);
    try {
      const response = await api.get("/ai/insights", getAuthHeaders());
      setInsights(response.data);
    } catch (err) {
      setError("Failed to fetch financial insights.");
      toast.error("Error fetching financial insights.");
    } finally {
      setLoading(false);
    }
  };

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const handleQuerySubmit = async (e) => {
    e.preventDefault();
    setQueryLoading(true);
    try {
      const response = await api.post(
        "/ai/query",
        { query },
        getAuthHeaders()
      );
      setQueryResponse(response.data);
    } catch (err) {
      setError("Failed to fetch query response.");
      toast.error("Error processing your query.");
    } finally {
      setQueryLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Sidebar />

      <div className="flex-1 ml-64 bg-white shadow-sm">
        <Navbar />

        <div className="p-8 max-w-6xl mx-auto">
          {/* Header */}
          <header className="mb-10 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                Financial Insights
              </h1>
              <p className="text-slate-500 mt-3 text-lg">
                Your intelligent financial companion
              </p>
            </div>
            <div className="flex space-x-4">
              <CurrencyDollarIcon className="w-12 h-12 text-emerald-500 opacity-70" />
              <ChartBarIcon className="w-12 h-12 text-teal-500 opacity-70" />
            </div>
          </header>

          {/* Insights Section */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* AI Insights Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 transform transition-all hover:scale-[1.02]">
              <div className="flex items-center mb-4">
                <LightBulbIcon className="w-8 h-8 text-emerald-500 mr-3" />
                <h2 className="text-xl font-semibold text-slate-800">
                  AI Financial Insights
                </h2>
              </div>

              {loading ? (
                <div className="text-center text-slate-500 animate-pulse">
                  Generating insights...
                </div>
              ) : error ? (
                <div className="text-red-500">{error}</div>
              ) : insights ? (
                <div className="space-y-4">
                  {[
                    { 
                      title: "Smart Saving Tips", 
                      content: insights.smartSavingTips, 
                      icon: <CurrencyDollarIcon className="w-6 h-6 text-emerald-500" /> 
                    },
                    { 
                      title: "Alternative Expenses", 
                      content: insights.alternativeExpenses, 
                      icon: <ChartBarIcon className="w-6 h-6 text-teal-500" /> 
                    },
                    { 
                      title: "Investment Recommendations", 
                      content: insights.investmentRecommendations, 
                      icon: <LightBulbIcon className="w-6 h-6 text-blue-500" /> 
                    }
                  ].map((insight, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      {insight.icon}
                      <div>
                        <h3 className="font-medium text-slate-700">{insight.title}</h3>
                        <p className="text-slate-500 text-sm">
                          {insight.content || "No insights available"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-slate-500">
                  No insights available
                </div>
              )}
            </div>

            {/* Conversational Query Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 transform transition-all hover:scale-[1.02]">
              <div className="flex items-center mb-4">
                <QuestionMarkCircleIcon className="w-8 h-8 text-blue-500 mr-3" />
                <h2 className="text-xl font-semibold text-slate-800">
                  Ask a Financial Question
                </h2>
              </div>

              <form onSubmit={handleQuerySubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Your Financial Query
                  </label>
                  <input
                    type="text"
                    value={query}
                    onChange={handleQueryChange}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="e.g., How much did I spend on coffee last month?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={queryLoading}
                  className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white px-6 py-3 rounded-lg 
                  hover:from-blue-600 hover:to-teal-600 transition-all 
                  focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                  shadow-md hover:shadow-lg disabled:opacity-50"
                >
                  {queryLoading ? "Processing..." : "Get AI Insights"}
                </button>
              </form>

              {queryResponse && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-slate-700 mb-2">AI Response</h3>
                  <p className="text-slate-600">{queryResponse}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialInsights;