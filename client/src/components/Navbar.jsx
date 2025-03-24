import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaBell, FaUserCircle, FaSearch } from "react-icons/fa"; // Add FaSearch here
import DynamicIsland from "./DynamicIsland"; // Import DynamicIsland component

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const navigate = useNavigate();
  const [searchExpanded, setSearchExpanded] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="backdrop-blur-xl bg-white/70 border-b border-cyan-200/40 sticky top-0 z-30 w-full transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 z-0"></div>
      <div className="relative z-10">
        <div className="flex justify-between items-center h-16 px-4 sm:px-6">
          {/* Left: Logo & Title */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-400 to-teal-400 opacity-20"></div>
              <div className="absolute inset-0 rounded-full border-2 border-cyan-400/30 flex items-center justify-center">
                <div className="text-cyan-700 text-xs font-semibold">FB</div>
              </div>
            </div>
            <h1 className="text-lg font-light text-gray-800 truncate">
              FinBotX Dashboard
            </h1>
          </div>

          {/* Center: Dynamic Island properly centered in the navbar */}
          <div className="hidden sm:block">
            <DynamicIsland />
          </div>

          {/* Right: Controls */}
          <div className="flex items-center space-x-1 sm:space-x-4">
            {/* Sidebar toggle (mobile) */}
            <button 
              className="p-2 rounded-xl sm:hidden"
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
            >
              {isSidebarOpen ? (
                <FaTimes className="text-gray-600" />
              ) : (
                <FaBars className="text-gray-600" />
              )}
            </button>

            {/* Search */}
            <div
              className={`relative transition-all duration-300 ${
                searchExpanded
                  ? "absolute left-0 top-0 w-full h-16 flex items-center bg-white/90 px-4 z-50"
                  : "hidden sm:block"
              }`}
            >
              <input
                type="text"
                placeholder="Search..."
                className="py-2 pl-9 pr-3 w-full sm:w-36 md:w-48 lg:w-64 rounded-xl bg-white/80 border border-cyan-200/40 focus:border-cyan-400/60 focus:outline-none text-sm text-gray-700"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400 text-sm" />
              {searchExpanded && (
                <button
                  className="absolute right-4 text-gray-500"
                  onClick={() => setSearchExpanded(false)}
                >
                  <FaTimes size={18} />
                </button>
              )}
            </div>

            {/* Search toggle for mobile */}
            <button
              className="p-2 rounded-xl hover:bg-white/80 sm:hidden"
              onClick={() => setSearchExpanded(true)}
              aria-label="Open search"
            >
              <FaSearch className="text-gray-600" size={16} />
            </button>

            {/* Notifications */}
            <button
              className="p-2 rounded-xl hover:bg-white/80 relative text-gray-600 hidden sm:block"
              onClick={() => console.log("Notifications clicked")}
            >
              <FaBell size={18} />
              <span className="absolute -top-1 -right-1 bg-gradient-to-tr from-cyan-400 to-teal-400 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                2
              </span>
            </button>

            {/* User Profile */}
            <div className="flex items-center space-x-2">
              <FaUserCircle className="text-cyan-600 text-xl" />
              <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                Samantha K.
              </span>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="px-2 sm:px-3 py-2 bg-white/80 text-gray-700 rounded-xl border border-cyan-200/40 text-sm font-medium hover:bg-white hover:border-cyan-300/60 transition shadow-sm whitespace-nowrap"
            >
              <span className="hidden xs:inline">Logout</span>
              <span className="xs:hidden">Exit</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
