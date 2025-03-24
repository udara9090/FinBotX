// DynamicIsland.js
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell, FaMicrophone, FaChartLine } from "react-icons/fa";

// Dynamic Island component properly centered horizontally
const DynamicIsland = () => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [notification, setNotification] = useState(null);
  
  // Simulate receiving notifications
  useEffect(() => {
    const notifications = [
      { type: "finance", title: "AAPL up 3.2%", duration: 5000 },
      { type: "alert", title: "New message received", duration: 4000 }
    ];
    
    const timer = setTimeout(() => {
      setNotification(notifications[Math.floor(Math.random() * notifications.length)]);
      setTimeout(() => setNotification(null), 5000);
    }, 10000);
    
    return () => clearTimeout(timer);
  }, [notification]);

  return (
    <div
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      onClick={() => setExpanded(!expanded)}
      className={`relative flex items-center justify-center bg-black rounded-pill shadow-lg transition-all duration-500 ease-in-out cursor-pointer overflow-hidden
        ${expanded ? "w-72 h-10" : notification ? "w-36 h-8" : "w-28 h-8"}
        ${notification && !expanded ? "animate-pulse" : ""}`}
      style={{ 
        borderRadius: "20px", 
        boxShadow: expanded ? "0 8px 32px rgba(0, 0, 0, 0.15)" : "0 4px 12px rgba(0, 0, 0, 0.1)",
        marginTop: "3px",
        marginBottom: "3px"
      }}
    >
      {expanded ? (
        // Fully expanded state
        <div className="flex items-center justify-between w-full px-5 py-1">
          {/* Left action */}
          <button
            className="text-gray-400 hover:text-white focus:outline-none transition-colors duration-200"
            onClick={(e) => {
              e.stopPropagation();
              console.log("Voice command triggered");
            }}
          >
            <div className="flex flex-col items-center">
              <FaMicrophone size={16} />
              <span className="text-xs mt-0.5">Voice</span>
            </div>
          </button>
          
          {/* Middle action */}
          <button
            className="text-gray-400 hover:text-white focus:outline-none transition-colors duration-200"
            onClick={(e) => {
              e.stopPropagation();
              navigate("/"); 
            }}
          >
            <div className="flex flex-col items-center">
              <FaChartLine size={16} />
              <span className="text-xs mt-0.5">Finance</span>
            </div>
          </button>
          
          {/* Right action */}
          <button
            className="text-gray-400 hover:text-white focus:outline-none transition-colors duration-200"
            onClick={(e) => {
              e.stopPropagation();
              console.log("Notifications clicked");
            }}
          >
            <div className="flex flex-col items-center">
              <FaBell size={16} />
              <span className="text-xs mt-0.5">Alerts</span>
            </div>
          </button>
        </div>
      ) : notification ? (
        // Notification state
        <div className="flex items-center justify-between w-full px-3">
          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
            notification.type === "finance" ? "bg-green-500" : "bg-blue-500"
          }`}>
            {notification.type === "finance" ? 
              <FaChartLine size={10} className="text-white" /> : 
              <FaBell size={10} className="text-white" />
            }
          </div>
          <span className="text-xs text-white font-medium ml-2">{notification.title}</span>
        </div>
      ) : (
        // Default collapsed state
        <div className="flex items-center justify-center space-x-2">
          <div className="w-2.5 h-2.5 bg-gray-600 rounded-full"></div>
          <div className="w-2.5 h-2.5 bg-gray-600 rounded-full"></div>
        </div>
      )}
    </div>
  );
};

export default DynamicIsland;
