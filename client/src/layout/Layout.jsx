import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="relative min-h-screen w-full">
      {/* Sidebar (fixed on the left) */}
      <Sidebar isSidebarOpen={isSidebarOpen} />

      {/* Main content area to the right of (or under) the sidebar */}
      <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <div
        className={`
          flex flex-col
          transition-all duration-300
          // If you want the main content to shift right when the sidebar is open, uncomment:
          // ${isSidebarOpen ? 'ml-64' : 'ml-0'}
          // For narrower default on md, you could do:
          // md:ml-16 md:hover:ml-56 lg:ml-56
        `}
      >
        {/* Top navbar */}
        

        {/* Outlet to render child pages (e.g., Dashboard, etc.) */}
        <main className="p-4 bg-gray-100 min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
