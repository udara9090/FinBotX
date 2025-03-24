import React from "react";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster />
      <AppRoutes />
    </div>
  );
};

export default App;
