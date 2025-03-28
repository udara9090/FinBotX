import { useState, useEffect } from "react";
import { api, getAuthHeaders } from "../../utils/api";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { RefreshCw, CreditCard, ChevronRight, TrendingDown, BarChart, AlertCircle } from "lucide-react";

const DebtPlanner = () => {
  const [debtAmount, setDebtAmount] = useState(0);
  const [interestRate, setInterestRate] = useState(0);
  const [simulationResult, setSimulationResult] = useState(null);
  const [availablePayment, setAvailablePayment] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDebtSimulationSubmit = async (e) => {
    e.preventDefault();

    if (debtAmount <= 0 || interestRate <= 0) {
      setError("Please fill in all fields correctly.");
      return;
    }

    setLoading(true);
    setError("");
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
      setError("Failed to simulate debt payoff.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-white text-gray-900">
      {/* Navbar - Kept exactly as in original code */}
      <div className="fixed top-0 left-0 right-0 h-16 z-30 bg-white bg-opacity-90 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <Navbar />
      </div>

      <div className="pt-16 flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Debt Planner */}
        <main className="flex-1 p-6 md:p-8 lg:p-10 bg-gradient-to-br from-gray-50 via-white to-gray-50 ml-16 md:ml-64">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <header className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-3 flex items-center">
                Debt Payoff Planner
                <ChevronRight className="h-7 w-7 ml-2 text-blue-600" />
              </h2>
              <p className="text-gray-600 max-w-2xl">
                Strategically plan and optimize your debt repayment journey with our intelligent simulation tool.
              </p>
            </header>

            {/* Debt Simulation Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-6 bg-blue-50/30 border-b border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                  <TrendingDown className="h-6 w-6 mr-3 text-blue-600" />
                  Debt Simulation
                </h3>
              </div>
              
              {/* Simulation Form */}
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
                  disabled={loading}
                >
                  <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                  <span>{loading ? "Processing Simulation..." : "Run Debt Simulation"}</span>
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
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center space-x-3">
                <AlertCircle className="h-6 w-6 text-red-500" />
                <span className="font-medium">{error}</span>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DebtPlanner;
