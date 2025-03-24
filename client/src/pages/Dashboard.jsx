import { useState, useEffect } from "react";
import { getAuthHeaders, api } from "../utils/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { 
  RefreshCw, Lightbulb, AlertCircle, ChevronRight, CreditCard, 
  PieChart, TrendingUp, Calendar, Zap, Brain, Terminal, 
  Eye, Shield, AlertTriangle, ArrowUpRight, Cpu
} from "lucide-react";

const Dashboard = () => {
  const [insights, setInsights] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [aiMode, setAiMode] = useState("balanced"); // "conservative", "balanced", "aggressive"

  const fetchAIInsights = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get(`/ai/insights?mode=${aiMode}`, getAuthHeaders());
      setInsights(response.data.candidates?.[0]?.output || "No insights received.");
    } catch (err) {
      console.error("Error fetching AI insights:", err);
      setError("Failed to fetch financial insights.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAIInsights();
  }, [aiMode]);

  // Sample data for demonstration
  const transactions = [
    { id: 1, name: "Whole Foods Market", amount: "-$86.35", date: "Today", category: "Groceries", aiFlag: "normal" },
    { id: 2, name: "Amazon Prime", amount: "-$14.99", date: "Yesterday", category: "Subscriptions", aiFlag: "recurring" },
    { id: 3, name: "Direct Deposit", amount: "+$2,450.00", date: "Mar 22", category: "Income", aiFlag: "important" },
  ];

  const budgetCategories = [
    { category: "Housing", spent: 1200, total: 1500, percentage: 80, trend: "stable", aiRecommendation: "On target" },
    { category: "Food", spent: 420, total: 600, percentage: 70, trend: "increasing", aiRecommendation: "Consider meal planning" },
    { category: "Transportation", spent: 180, total: 300, percentage: 60, trend: "decreasing", aiRecommendation: "Keep reducing" },
  ];

  const financialMetrics = [
    { 
      title: "Monthly Spending", 
      value: "$2,845", 
      change: "-5.2%", 
      icon: <CreditCard className="h-5 w-5" />,
      aiInsight: "Decreased 5.2% from last month",
      sentiment: "positive" 
    },
    { 
      title: "Savings Rate", 
      value: "22%", 
      change: "+2.8%", 
      icon: <TrendingUp className="h-5 w-5" />,
      aiInsight: "Above average for your income bracket",
      sentiment: "positive"
    },
    { 
      title: "Budget Status", 
      value: "On Track", 
      change: "", 
      icon: <PieChart className="h-5 w-5" />,
      aiInsight: "90% confidence of staying on budget",
      sentiment: "neutral"
    },
    { 
      title: "Next Bill Due", 
      value: "In 3 Days", 
      change: "$49.99", 
      icon: <Calendar className="h-5 w-5" />,
      aiInsight: "Sufficient funds available",
      sentiment: "neutral"
    },
  ];

  const aiSuggestions = [
    "Consider reallocating $120 from entertainment to investments based on your spending patterns",
    "Your electricity bill is 15% higher than seasonal average - schedule an AI energy audit",
    "3 subscription services haven't been used in 60+ days - potential savings of $42/month"
  ];

  // AI sentiment indicators
  const sentimentColors = {
    positive: "text-emerald-600",
    neutral: "text-blue-600",
    negative: "text-red-600",
  };

  // AI flag indicators for transactions
  const flagIndicators = {
    normal: { color: "bg-gray-200", text: "Normal transaction" },
    recurring: { color: "bg-indigo-200", text: "Recurring subscription" },
    important: { color: "bg-emerald-200", text: "Important income" },
    unusual: { color: "bg-orange-200", text: "Unusual spending" }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navbar with AI elements */}
      <div className="fixed top-0 left-0 right-0 h-16 z-30 bg-white bg-opacity-90 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <Navbar 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
          isSidebarOpen={isSidebarOpen}
        />
      </div>

      {/* Content area with proper spacing for fixed navbar */}
      <div className="pt-16 flex flex-1">
        {/* Sidebar */}
        <Sidebar isSidebarOpen={isSidebarOpen} />

        {/* Main content */}
        <main className="flex-1 p-6 md:p-8 lg:p-10 transition-all duration-300 md:ml-16 lg:ml-56 bg-gradient-to-br from-gray-50 via-white to-gray-50">
          <div className="max-w-6xl mx-auto">
            {/* Header with welcome message and AI assistant indicator */}
            <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-medium text-gray-900 flex items-center">
                  <Brain className="mr-3 text-blue-600 h-6 w-6" />
                  FinBotX Dashboard <span className="ml-2 text-blue-600">💸</span>
                </h1>
                <p className="text-gray-500 mt-1">AI financial assistant - analyzing your finances 24/7</p>
              </div>
              
              <div className="mt-4 md:mt-0 flex items-center bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center mr-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse mr-2"></div>
                  <span className="text-blue-600 text-sm">AI Assistant</span>
                </div>
                <select 
                  className="bg-gray-100 border border-gray-200 text-gray-800 rounded px-2 py-1 text-sm"
                  value={aiMode}
                  onChange={(e) => setAiMode(e.target.value)}
                >
                  <option value="conservative">Conservative</option>
                  <option value="balanced">Balanced</option>
                  <option value="aggressive">Aggressive</option>
                </select>
              </div>
            </header>

            {/* AI Analysis Status Bar */}
            <div className="bg-white rounded-xl p-3 mb-8 border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center">
                <Terminal className="h-5 w-5 mr-2 text-blue-600" />
                <span className="text-gray-700 text-sm">AI analyzing 6 financial data sources in real-time</span>
              </div>
              <div className="flex mt-2 md:mt-0 space-x-4">
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-1 text-emerald-600" />
                  <span className="text-gray-700 text-xs">Monitoring</span>
                </div>
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-1 text-blue-600" />
                  <span className="text-gray-700 text-xs">Protected</span>
                </div>
                <div className="flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-1 text-amber-600" />
                  <span className="text-gray-700 text-xs">2 Alerts</span>
                </div>
              </div>
            </div>

            {/* Financial metrics cards with AI insights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              {financialMetrics.map((metric, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm p-5 border border-gray-200 transition-all duration-300 hover:border-blue-200 hover:shadow-md overflow-hidden relative group">
                  {/* Subtle background pattern */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="flex items-start justify-between relative">
                    <div>
                      <p className="text-gray-500 text-sm font-medium">{metric.title}</p>
                      <p className="text-xl font-semibold mt-1 text-gray-800">{metric.value}</p>
                      <div className="flex items-center mt-1">
                        {metric.change && (
                          <p className={`text-xs mr-2 ${metric.change.startsWith('+') ? 'text-emerald-600' : metric.change.startsWith('-') ? (metric.sentiment === 'positive' ? 'text-emerald-600' : 'text-red-600') : 'text-gray-500'}`}>
                            {metric.change}
                          </p>
                        )}
                      </div>
                      <div className={`text-xs mt-2 ${sentimentColors[metric.sentiment]}`}>
                        <Zap className="inline h-3 w-3 mr-1" />
                        <span>{metric.aiInsight}</span>
                      </div>
                    </div>
                    <div className="p-3 rounded-full bg-blue-50 text-blue-600">
                      {metric.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* AI Insights Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 hover:border-blue-200 hover:shadow-md transition-all duration-300 relative overflow-hidden">
              {/* Subtle background pattern */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-100 opacity-20 rounded-full blur-3xl"></div>
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 relative">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600 mr-3">
                    <Cpu className="h-5 w-5" />
                  </div>
                  <h2 className="text-lg md:text-xl font-medium text-gray-800">
                    AI Financial Insights
                  </h2>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={fetchAIInsights} 
                    className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors border border-blue-600"
                    disabled={loading}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    {loading ? 'Processing...' : 'Regenerate'}
                  </button>
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-xl p-5 md:p-6 min-h-48 md:min-h-64 border border-blue-100 relative">
                {/* Animated data processing visual effect in background */}
                <div className="absolute inset-0 overflow-hidden opacity-20">
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-600 to-transparent transform animate-pulse"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-600 to-transparent transform animate-pulse delay-150"></div>
                </div>
                
                {loading && (
                  <div className="flex items-center justify-center h-40">
                    <div className="flex flex-col items-center">
                      <div className="relative">
                        <div className="h-16 w-16 rounded-full border-t-2 border-b-2 border-blue-500 animate-spin"></div>
                        <div className="absolute inset-0 h-16 w-16 rounded-full border-r-2 border-l-2 border-blue-300 animate-pulse"></div>
                      </div>
                      <p className="text-gray-600 mt-4">Processing financial data...</p>
                    </div>
                  </div>
                )}
                
                {error && (
                  <div className="flex items-center text-red-600 p-4 bg-red-50 rounded-md border border-red-200">
                    <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                    <p>{error}</p>
                  </div>
                )}
                
                {!loading && !error && (
                  <div className="text-gray-800 p-4 overflow-x-auto rounded-lg relative">
                    <div className="absolute top-2 right-2 flex items-center text-xs text-blue-600">
                      <Terminal className="h-3 w-3 mr-1" />
                      <span>AI Analysis</span>
                    </div>
                    <div className="font-mono text-sm text-gray-700">
                      {insights}
                    </div>
                  </div>
                )}
              </div>
              
              {/* AI-generated suggestions */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                {aiSuggestions.map((suggestion, index) => (
                  <div key={index} className="bg-blue-50 p-3 rounded-lg border border-blue-100 relative overflow-hidden group hover:border-blue-300 transition-all">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex">
                      <div className="bg-blue-100 rounded-full p-1 mr-2 h-6 w-6 flex items-center justify-center flex-shrink-0">
                        <Lightbulb className="h-3 w-3 text-blue-600" />
                      </div>
                      <p className="text-xs text-gray-700">{suggestion}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Transactions with AI flags */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:border-blue-200 hover:shadow-md transition-all duration-300 relative overflow-hidden">
                {/* Subtle background pattern */}
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-100 opacity-10 rounded-full blur-3xl"></div>
                
                <div className="flex items-center justify-between mb-5 relative">
                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-blue-50 text-blue-600 mr-3">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <h2 className="text-lg md:text-xl font-medium text-gray-800">Recent Transactions</h2>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                    View All <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg transition-all duration-200 hover:bg-blue-50 border border-gray-200 relative group">
                      {/* AI flag indicator subtle line on left */}
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${flagIndicators[transaction.aiFlag].color} rounded-l-lg`}></div>
                      
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white mr-3 ${
                          transaction.category === 'Income' ? 'bg-gradient-to-br from-emerald-400 to-emerald-600' : 
                          transaction.category === 'Groceries' ? 'bg-gradient-to-br from-blue-400 to-blue-600' : 'bg-gradient-to-br from-indigo-400 to-indigo-600'
                        }`}>
                          {transaction.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{transaction.name}</p>
                          <p className="text-xs text-gray-500">{transaction.category} • {transaction.date}</p>
                        </div>
                        
                        {/* AI flag tooltip that shows on hover */}
                        <div className="hidden group-hover:block absolute left-12 bottom-1 z-10">
                          <div className="bg-white text-xs px-2 py-1 rounded text-gray-700 border border-gray-200 shadow-sm flex items-center">
                            <Zap className="h-3 w-3 mr-1 text-blue-600" />
                            {flagIndicators[transaction.aiFlag].text}
                          </div>
                        </div>
                      </div>
                      <p className={`font-medium ${transaction.amount.startsWith('+') ? 'text-emerald-600' : 'text-gray-800'}`}>
                        {transaction.amount}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Budget Overview with AI recommendations */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:border-blue-200 hover:shadow-md transition-all duration-300 relative overflow-hidden">
                {/* Subtle background pattern */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-100 opacity-10 rounded-full blur-3xl"></div>
                
                <div className="flex items-center justify-between mb-5 relative">
                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-blue-50 text-blue-600 mr-3">
                      <PieChart className="h-5 w-5" />
                    </div>
                    <h2 className="text-lg md:text-xl font-medium text-gray-800">Budget Overview</h2>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                    Manage Budgets <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  {budgetCategories.map((budget, index) => (
                    <div key={index} className="space-y-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <p className="font-medium text-gray-800">{budget.category}</p>
                          {budget.trend === "increasing" && <ArrowUpRight className="h-3 w-3 ml-1 text-red-500" />}
                          {budget.trend === "decreasing" && <ArrowUpRight className="h-3 w-3 ml-1 text-emerald-500 transform rotate-90" />}
                          {budget.trend === "stable" && <div className="h-1 w-3 ml-1 bg-blue-500 rounded-full"></div>}
                        </div>
                        <p className="text-sm text-gray-600">${budget.spent} / ${budget.total}</p>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden relative">
                        <div 
                          className={`h-full ${
                            budget.percentage > 90 ? 'bg-gradient-to-r from-red-400 to-red-500' : 
                            budget.percentage > 75 ? 'bg-gradient-to-r from-amber-400 to-amber-500' : 'bg-gradient-to-r from-emerald-400 to-emerald-500'
                          }`}
                          style={{ width: `${budget.percentage}%` }}
                        ></div>
                        
                        {/* Animated data processing pulse for AI effect */}
                        <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent opacity-10 animate-pulse"></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Lightbulb className="h-3 w-3 mr-1 text-blue-600" />
                          <p className="text-xs text-blue-600">{budget.aiRecommendation}</p>
                        </div>
                        <p className="text-xs text-gray-500">{budget.percentage}% used</p>
                      </div>
                    </div>
                  ))}
                  
                  <div className="mt-4 bg-blue-50 p-4 rounded-lg border border-blue-200 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-100/30 to-transparent"></div>
                    <div className="relative flex items-start">
                      <Brain className="h-5 w-5 mr-2 text-blue-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-800 font-medium mb-1">AI Budget Analysis</p>
                        <p className="text-xs text-gray-600">
                          You're trending under budget in Transportation. Based on your financial goals, our AI recommends reallocating $50 to your emergency fund and $20 to your vacation savings.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;