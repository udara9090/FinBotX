import { useState, useEffect } from "react";
import { api, getAuthHeaders } from "../../utils/api";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import toast from "react-hot-toast";

const SharedBudget = () => {
  const [sharedBudgets, setSharedBudgets] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ name: "", totalBudget: "", selectedUsers: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch shared budgets and users on mount
  useEffect(() => {
    fetchSharedBudgets();
    fetchUsers();
  }, []);

  // Fetch shared budgets
  const fetchSharedBudgets = async () => {
    setLoading(true);
    try {
      const response = await api.get("/shared-budget", getAuthHeaders());
      setSharedBudgets(response.data);
    } catch (err) {
      setError("Failed to fetch shared budgets.");
      toast.error("Error fetching shared budgets.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/users", getAuthHeaders());
      setUsers(response.data);
    } catch (err) {
      setError("Failed to fetch users.");
      toast.error("Error fetching users.");
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle user selection (improved)
  const toggleUserSelection = (userId) => {
    setFormData((prev) => {
      const selectedUsers = [...prev.selectedUsers];
      const index = selectedUsers.indexOf(userId);
      
      if (index === -1) {
        selectedUsers.push(userId);
      } else {
        selectedUsers.splice(index, 1);
      }
      
      return {
        ...prev,
        selectedUsers,
      };
    });
  };

  // Handle form submission for shared budget creation
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.totalBudget || formData.selectedUsers.length === 0) {
      setError("Please fill all fields.");
      toast.error("Please fill all fields.");
      return;
    }

    try {
      const response = await api.post("/shared-budget", {
        name: formData.name,
        totalBudget: formData.totalBudget,
        users: formData.selectedUsers,
      }, getAuthHeaders());
      
      setSharedBudgets((prev) => [...prev, response.data]);
      setFormData({ name: "", totalBudget: "", selectedUsers: [] });
      setError("");
      setShowForm(false);
      toast.success("Shared budget created successfully!");
    } catch (err) {
      setError("Failed to create shared budget.");
      toast.error("Error creating shared budget.");
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Calculate progress percentage
  const calculateProgress = (spent, total) => {
    const percentage = (spent / total) * 100;
    return Math.min(percentage, 100); // Cap at 100%
  };

  // Get user name by ID
  const getUserName = (userId) => {
    const user = users.find(u => u._id === userId);
    return user ? user.name : "Unknown User";
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
    
    <div className="fixed top-0 left-0 right-0 h-16 z-30 bg-white bg-opacity-90 backdrop-blur-lg border-b border-gray-200 shadow-sm">
      <Navbar />
    </div>

    <div className="pt-16 flex flex-1">
      {/* Sidebar */}
      <Sidebar />

        <div className="p-6 max-w-6xl mx-auto">
          <header className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                  Shared Budget Management
                </h1>
                <p className="text-slate-500 mt-2">Track and manage your shared budgets with friends and family</p>
              </div>
              <button
                onClick={() => setShowForm(!showForm)}
                className="mt-4 md:mt-0 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-5 py-2 rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 shadow-md flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
                {showForm ? "Cancel" : "Create New Budget"}
              </button>
            </div>
          </header>

          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100 transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <div className="bg-emerald-100 p-3 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Total Shared Budgets</p>
                  <h3 className="text-2xl font-bold text-slate-800">{sharedBudgets.length}</h3>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100 transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <div className="bg-indigo-100 p-3 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Total Users</p>
                  <h3 className="text-2xl font-bold text-slate-800">{users.length}</h3>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100 transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <div className="bg-amber-100 p-3 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Average Budget</p>
                  <h3 className="text-2xl font-bold text-slate-800">
                    {sharedBudgets.length > 0 
                      ? formatCurrency(sharedBudgets.reduce((acc, budget) => acc + Number(budget.totalBudget), 0) / sharedBudgets.length)
                      : formatCurrency(0)}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* Create Shared Budget Form (Collapsible) */}
          {showForm && (
            <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100 mb-8 animate-fadeIn">
              <h2 className="text-lg font-semibold text-slate-700 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
                Create New Shared Budget
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Budget Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      placeholder="e.g., Roommates Budget"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Total Budget (LKR)</label>
                    <input
                      type="number"
                      name="totalBudget"
                      value={formData.totalBudget}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      placeholder="e.g., 100000"
                    />
                  </div>

                  {/* Improved User Selection UI */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Share With ({formData.selectedUsers.length} selected)
                    </label>
                    
                    {/* Search input */}
                    <div className="relative mb-2">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        placeholder="Search users..."
                        className="pl-10 w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    
                    {/* Selected users pills */}
                    {formData.selectedUsers.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {formData.selectedUsers.map(userId => (
                          <div key={`selected-${userId}`} className="bg-emerald-100 text-emerald-800 rounded-full px-3 py-1 text-sm flex items-center">
                            {getUserName(userId)}
                            <button 
                              type="button"
                              onClick={() => toggleUserSelection(userId)}
                              className="ml-2 text-emerald-500 hover:text-emerald-700 focus:outline-none"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* User selection with checkboxes in a scrollable area */}
                    <div className="border border-slate-200 rounded-lg overflow-y-auto max-h-60 bg-white">
                      {filteredUsers.length === 0 ? (
                        <div className="p-4 text-center text-slate-500">No users found</div>
                      ) : (
                        filteredUsers.map(user => (
                          <div 
                            key={user._id}
                            className={`flex items-center p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-b-0 ${
                              formData.selectedUsers.includes(user._id) ? 'bg-emerald-50' : ''
                            }`}
                            onClick={() => toggleUserSelection(user._id)}
                          >
                            <input
                              type="checkbox"
                              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded mr-3"
                              checked={formData.selectedUsers.includes(user._id)}
                              onChange={() => {}} // Handled by div click
                            />
                            <div className="flex-1">
                              <div className="text-sm font-medium text-slate-700">{user.name}</div>
                              {user.email && <div className="text-xs text-slate-500">{user.email}</div>}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-all focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-2 rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 shadow-md hover:shadow-lg"
                  >
                    Create Budget
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Shared Budgets List */}
          <div>
            <h2 className="text-xl font-semibold text-slate-700 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              Your Shared Budgets
            </h2>

            {loading ? (
              <div className="py-8 flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                <span className="ml-3 text-slate-600">Loading budgets...</span>
              </div>
            ) : sharedBudgets.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-8 border border-slate-100 flex flex-col items-center justify-center text-center">
                <div className="bg-slate-50 p-4 rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-slate-700 mb-2">No shared budgets yet</h3>
                <p className="text-slate-500 mb-4">Create your first shared budget to start tracking expenses with others.</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-5 py-2 rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 shadow-md flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                  Create New Budget
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sharedBudgets.map((budget) => (
                  <div key={budget._id} className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-4 text-white">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">{budget.name}</h3>
                        <div className="bg-white/20 px-2 py-1 rounded text-sm">{budget.users.length} users</div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-500">Total Budget:</span>
                        <span className="font-semibold">{formatCurrency(budget.totalBudget)}</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-500">Amount Spent:</span>
                        <span className="font-semibold">{formatCurrency(budget.spent || 0)}</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-500">Remaining:</span>
                        <span className={`font-semibold ${(budget.totalBudget - (budget.spent || 0)) < 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                          {formatCurrency(budget.totalBudget - (budget.spent || 0))}
                        </span>
                      </div>
                      
                      {/* Progress bar */}
                      <div className="mt-4">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Budget Used</span>
                          <span>{Math.min(Math.round((budget.spent || 0) / budget.totalBudget * 100), 100)}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${
                              calculateProgress(budget.spent || 0, budget.totalBudget) > 90 
                                ? 'bg-red-500' 
                                : calculateProgress(budget.spent || 0, budget.totalBudget) > 75 
                                  ? 'bg-amber-500' 
                                  : 'bg-emerald-500'
                            }`}
                            style={{ width: `${calculateProgress(budget.spent || 0, budget.totalBudget)}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      {/* Shared with avatars */}
                      <div className="mt-4">
                        <div className="text-xs text-slate-500 mb-2">Shared with:</div>
                        <div className="flex flex-wrap gap-1">
                          {budget.users.map((userId, index) => (
                            <div 
                              key={`${budget._id}-user-${index}`}
                              className="bg-slate-100 text-slate-700 text-xs rounded-full px-2 py-1 inline-flex items-center"
                            >
                              <span className="w-5 h-5 rounded-full bg-emerald-400 text-white flex items-center justify-center mr-1 text-xs font-medium">
                                {getUserName(userId).charAt(0)}
                              </span>
                              <span className="truncate max-w-32">{getUserName(userId)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-end mt-4">
                        <button className="text-emerald-600 hover:text-emerald-800 text-sm font-medium flex items-center">
                          View Details
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedBudget;