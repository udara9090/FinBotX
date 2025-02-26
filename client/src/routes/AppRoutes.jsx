import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AIInsights from "../pages/AIInsights";
// import Dashboard from "../pages/Dashboard";
// import Expenses from "../pages/Expenses";
// import Budget from "../pages/Budget";
// import Login from "../pages/Login";
// import Register from "../pages/Register";
import Chatbot from "../components/Chatbot";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Dashboard />} /> */}
        <Route path="/insights" element={<AIInsights />} />
        {/* <Route path="/expenses" element={<Expenses />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> */}
        <Route path="/chat" element={<Chatbot />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
