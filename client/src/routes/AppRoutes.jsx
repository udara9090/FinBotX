import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Income from "../pages/income/Income";
import Expenses from "../pages/expence/Expenses";
import SharedBudget from "../pages/shared/SharedBudget";
import FinancialInsights from "../pages/AI/FinancialInsights";
import ProtectedRoute from "../utils/ProtectedRoute"; 

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Route - Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
<Route
  path="/income"
  element={
    <ProtectedRoute>
      <Income />
    </ProtectedRoute>
  }
/>
<Route
  path="/expenses"
  element={
    <ProtectedRoute>
      <Expenses />
    </ProtectedRoute>
  }
/>
<Route
  path="/shared-finance"
  element={
    <ProtectedRoute>
      <SharedBudget />
    </ProtectedRoute>
  }
/>
<Route
  path="/financial-insights"
  element={
    <ProtectedRoute>
      <FinancialInsights />
    </ProtectedRoute>
  }
/>
        {/* Redirect any unknown paths to login */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
