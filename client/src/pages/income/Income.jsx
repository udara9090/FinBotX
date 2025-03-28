import { useState, useEffect } from "react";
import { api, getAuthHeaders } from "../../utils/api";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import toast from "react-hot-toast";

const Income = () => {
  const [incomeList, setIncomeList] = useState([]);
  const [formData, setFormData] = useState({ source: "", amount: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [totalIncome, setTotalIncome] = useState(0);
  const [editingIncome, setEditingIncome] = useState(null);

  useEffect(() => {
    fetchIncome();
  }, []);

  useEffect(() => {
    const total = incomeList.reduce((sum, item) => sum + Number(item.amount), 0);
    setTotalIncome(total);
  }, [incomeList]);

  const fetchIncome = async () => {
    setLoading(true);
    try {
      const response = await api.get("/income", getAuthHeaders());
      setIncomeList(response.data);
    } catch (err) {
      setError("Failed to fetch income records.");
      toast.error("Error fetching income records.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/income/${id}`, getAuthHeaders());
      setIncomeList(prev => prev.filter(item => item._id !== id));
      toast.success("Income deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete income.");
    }
  };

  const handleEdit = (item) => {
    setFormData({ source: item.source, amount: item.amount });
    setEditingIncome(item);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.source || !formData.amount) {
      setError("Please fill all fields.");
      toast.error("Please fill all fields.");
      return;
    }

    try {
      let response;
      if (editingIncome) {
        response = await api.put(
          `/income/${editingIncome._id}`,
          formData,
          getAuthHeaders()
        );
        setIncomeList(prev =>
          prev.map(item => item._id === editingIncome._id ? response.data : item)
        );
        toast.success("Income updated successfully!");
      } else {
        response = await api.post("/income", formData, getAuthHeaders());
        setIncomeList(prev => [...prev, response.data]);
        toast.success("Income added successfully!");
      }
      setFormData({ source: "", amount: "" });
      setEditingIncome(null);
      setError("");
    } catch (err) {
      setError("Failed to process request.");
      toast.error("Error processing request.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
    
    <div className="fixed top-0 left-0 right-0 h-16 z-30 bg-white bg-opacity-90 backdrop-blur-lg border-b border-gray-200 shadow-sm">
      <Navbar />
    </div>

    <div className="pt-16 flex flex-1">
      {/* Sidebar */}
      <Sidebar />

        <div className="p-6 max-w-6xl mx-auto">
          <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                Income Management
              </h1>
              <p className="text-slate-500 mt-2">Track and manage your income sources</p>
            </div>
            
            <div className="mt-4 md:mt-0 p-1 bg-white rounded-lg shadow-sm">
              <div className="text-xs font-medium text-slate-400 px-3 pt-2">Total balance</div>
              <div className="text-2xl font-bold text-emerald-600 px-3 pb-2">
                Rs. {totalIncome.toLocaleString()}
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-100 transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-4 text-white">
                <h2 className="text-lg font-semibold">Financial Overview</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    Total Income
                  </span>
                  <span className="text-xl font-bold text-emerald-600">Rs. {totalIncome.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                    </svg>
                    Records
                  </span>
                  <span className="font-medium px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm">{incomeList.length}</span>
                </div>
                {incomeList.length > 0 && (
                  <div className="pt-2">
                    <div className="text-sm text-slate-500 mb-2">Recent Activity</div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" 
                        style={{ width: `${Math.min(100, (incomeList.length / 10) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6 border border-slate-100 transform transition-all duration-300 hover:shadow-lg">
              <h2 className="text-lg font-semibold text-slate-700 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
                {editingIncome ? "Edit Income" : "Add New Income"}
              </h2>
              
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg text-red-700 text-sm flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Income Source</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm8 0a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        name="source"
                        value={formData.source}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                        placeholder="e.g., Salary, Freelance"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Amount (LKR)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-slate-400">Rs.</span>
                      </div>
                      <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                        placeholder="e.g., 50000"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2 gap-2">
                  {editingIncome && (
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({ source: "", amount: "" });
                        setEditingIncome(null);
                      }}
                      className="bg-slate-100 text-slate-600 px-6 py-2 rounded-lg hover:bg-slate-200 transition-all shadow-md"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-2 rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 shadow-md hover:shadow-lg"
                  >
                    {editingIncome ? "Update Income" : "Add Income"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="mt-8 bg-white rounded-xl shadow-md p-6 border border-slate-100 transition-all duration-300 hover:shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-slate-700 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                Income Records
              </h2>
              <span className="text-sm px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full">{incomeList.length} records</span>
            </div>

            {loading ? (
              <div className="py-8 flex justify-center items-center">
                <div className="animate-pulse flex space-x-4">
                  <div className="rounded-full bg-slate-200 h-10 w-10"></div>
                  <div className="flex-1 space-y-4 py-1">
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-slate-200 rounded"></div>
                      <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : incomeList.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <p className="text-slate-600 mb-2 text-lg font-medium">No income records found</p>
                <p className="text-slate-400 mb-6">Add your first income source to get started</p>
                <button
                  onClick={() => document.querySelector('input[name="source"]').focus()}
                  className="text-sm px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
                >
                  Add your first income
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-slate-100">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Source
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {incomeList.map((item, index) => (
                      <tr key={item._id} className={`hover:bg-slate-50 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-slate-800 flex items-center">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                            {item.source}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-500">
                            {new Date(item.date).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="text-emerald-600 font-semibold px-4 py-1 bg-emerald-50 rounded-full inline-block">
                            Rs. {Number(item.amount).toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="text-emerald-600 hover:text-emerald-800 transition-colors"
                            aria-label="Edit"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                            aria-label="Delete"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Income;