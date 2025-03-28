import { useState, useEffect } from "react";
import { getAuthHeaders, api } from "../utils/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { 
  RefreshCw, Lightbulb, AlertCircle, ChevronRight, CreditCard, 
  PieChart, TrendingUp, Calendar, Zap, Brain, Terminal, 
  Eye, Shield, AlertTriangle, ArrowUpRight, Cpu, BarChart, TrendingDown
} from "lucide-react";

const Dashboard = () => {
  const [insights, setInsights] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [aiMode, setAiMode] = useState("balanced"); // "conservative", "balanced", "aggressive"

  const [debtAmount, setDebtAmount] = useState(0);
  const [interestRate, setInterestRate] = useState(0);
  const [simulationResult, setSimulationResult] = useState(null);
  const [availablePayment, setAvailablePayment] = useState(0);
  const [debtLoading, setDebtLoading] = useState(false);
  const [debtError, setDebtError] = useState("");

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

  const handleDebtSimulationSubmit = async (e) => {
    e.preventDefault();

    if (debtAmount <= 0 || interestRate <= 0) {
      setDebtError("Please fill in all fields correctly.");
      return;
    }

    setDebtLoading(true);
    setDebtError("");
    try {
      const response = await api.post(
        "/ai/debt-simulation-with-income-expenses",
        { debtAmount, interestRate },
        getAuthHeaders()
      );
      setSimulationResult(response.data);
      setAvailablePayment(response.data.availablePayment);
    } catch (err) {
      console.error("Debt simulation error:", err);
      setDebtError("Failed to simulate debt payoff.");
    } finally {
      setDebtLoading(false);
    }
  };

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

  const flagIndicators = {
    normal: { color: "bg-gray-200", text: "Normal transaction" },
    recurring: { color: "bg-indigo-200", text: "Recurring subscription" },
    important: { color: "bg-emerald-200", text: "Important income" },
    unusual: { color: "bg-orange-200", text: "Unusual spending" }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="fixed top-0 left-0 right-0 h-16 z-30 bg-white bg-opacity-90 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />
      </div>

      <div className="pt-16 flex flex-1">
        <Sidebar isSidebarOpen={isSidebarOpen} />

        <main className="flex-1 p-6 md:p-8 lg:p-10 transition-all duration-300 md:ml-16 lg:ml-56 bg-gradient-to-br from-gray-50 via-white to-gray-50">
          <div className="max-w-6xl mx-auto">
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
                <select className="bg-gray-100 border border-gray-200 text-gray-800 rounded px-2 py-1 text-sm" value={aiMode} onChange={(e) => setAiMode(e.target.value)}>
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

            {/* Debt Planner */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-6 bg-blue-50/30 border-b border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                  <TrendingDown className="h-6 w-6 mr-3 text-blue-600" />
                  Debt Simulation
                </h3>
              </div>
              <form onSubmit={handleDebtSimulationSubmit} className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total Debt Amount</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">LKR</span>
                      <input
                        type="number"
                        value={debtAmount}
                        onChange={(e) => setDebtAmount(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition"
                        placeholder="Enter total debt"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">%</span>
                      <input
                        type="number"
                        value={interestRate}
                        onChange={(e) => setInterestRate(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition"
                        placeholder="Annual interest rate"
                      />
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                  disabled={debtLoading}
                >
                  <RefreshCw className={`h-5 w-5 ${debtLoading ? 'animate-spin' : ''}`} />
                  <span>{debtLoading ? "Processing Simulation..." : "Run Debt Simulation"}</span>
                </button>
              </form>
            </div>

            {/* Simulation Results */}
            {simulationResult && (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="p-6 bg-green-50/30 border-b border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                    <BarChart className="h-6 w-6 mr-3 text-green-600" />
                    Payoff Projection
                  </h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <p className="text-sm text-gray-600 mb-1">Months to Payoff</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {simulationResult.months} months
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <p className="text-sm text-gray-600 mb-1">Total Interest</p>
                      <p className="text-2xl font-bold text-red-600">
                        {simulationResult.totalInterest.toFixed(2)} LKR
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <p className="text-sm text-gray-600 mb-1">Monthly Payment</p>
                      <p className="text-2xl font-bold text-green-600">
                        {availablePayment.toFixed(2)} LKR
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Error Handling */}
            {debtError && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center space-x-3">
                <AlertCircle className="h-6 w-6 text-red-500" />
                <span className="font-medium">{debtError}</span>
              </div>
            )}

            {/* Recent Transactions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:border-blue-200 hover:shadow-md transition-all duration-300 relative overflow-hidden">
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
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
