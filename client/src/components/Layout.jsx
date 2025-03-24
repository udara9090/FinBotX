// Layout.jsx
import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <Navbar 
        toggleSidebar={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isSidebarOpen={isMobileMenuOpen}
      />
      <Sidebar 
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      <main className="md:ml-16 lg:ml-56 transition-all duration-300 p-4 sm:p-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;