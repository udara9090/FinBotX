import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [animationPhase, setAnimationPhase] = useState(0);
  const navigate = useNavigate();

  // Animation for visual elements
  useEffect(() => {
    const timer = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // API request to register the user
    try {
      const response = await api.post("/users/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (response.status === 201) {
        alert("Registration successful!");
        navigate("/login"); // Redirect to login page after successful registration
      }
    } catch (err) {
      console.error("Error registering user:", err);
      setError(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="relative min-h-screen flex justify-center items-center overflow-hidden p-4 md:p-6 lg:p-8">
      {/* Light theme gradient background inspired by Sequoia */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 z-0"></div>
      
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 opacity-5 z-5">
        <svg width="100%" height="100%">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
            <feColorMatrix type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 0.5 0"/>
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)"/>
        </svg>
      </div>
      
      {/* Finance-themed visualization elements */}
      <div className="absolute inset-0 z-10 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Chart-like grid lines */}
            {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((y, i) => (
              <line 
                key={`h-${i}`} 
                x1="0" 
                y1={y} 
                x2="100" 
                y2={y} 
                stroke="#0e7490" 
                strokeWidth="0.1" 
                strokeDasharray="1,2"
                strokeOpacity={(animationPhase === i % 4) ? "0.3" : "0.1"}
              />
            ))}
            {/* Finance data points that resemble a stock chart */}
            <polyline 
              points="10,70 20,65 30,68 40,60 50,62 60,55 70,58 80,50 90,47" 
              fill="none" 
              stroke="#0e7490" 
              strokeWidth="0.3"
              strokeOpacity="0.3"
            />
            {/* Data nodes */}
            {[
              [10,70], [20,65], [30,68], [40,60], [50,62], 
              [60,55], [70,58], [80,50], [90,47]
            ].map((coord, i) => (
              <circle
                key={`n-${i}`}
                cx={coord[0]}
                cy={coord[1]}
                r="0.5"
                fill="#0e7490"
                fillOpacity={(animationPhase === i % 4) ? "0.8" : "0.2"}
              />
            ))}
          </svg>
        </div>
      </div>
      
      {/* Light theme orbs */}
      <div 
        className={`absolute top-20 right-20 w-64 h-64 rounded-full bg-gradient-to-b from-cyan-100/30 to-transparent backdrop-blur-lg z-10 transition-all duration-3000 ease-in-out ${
          animationPhase % 2 === 0 ? 'scale-100 opacity-40' : 'scale-105 opacity-20'
        }`}
      ></div>
      <div 
        className={`absolute bottom-40 left-20 w-96 h-96 rounded-full bg-gradient-to-tr from-teal-100/30 to-transparent backdrop-blur-lg z-10 transition-all duration-3000 ease-in-out ${
          animationPhase % 2 === 1 ? 'scale-100 opacity-40' : 'scale-105 opacity-20'
        }`}
      ></div>
      
      {/* Register container with light glassmorphism effect */}
      <div className="relative w-full max-w-md mx-auto my-8 backdrop-blur-xl bg-white/70 p-8 rounded-3xl shadow-lg border border-white/60 z-20">
        {/* FinBotX logo/header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 mb-4 relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-400 to-teal-400 opacity-20 animate-pulse"></div>
            <div className="absolute inset-2 rounded-full border-2 border-cyan-400/30 flex items-center justify-center">
              <div className="text-cyan-700 text-2xl font-semibold">FB</div>
            </div>
          </div>
          <h2 className="text-3xl font-light text-gray-800">FinBotX</h2>
          <p className="text-cyan-600/70 text-sm mt-1">Create your AI finance companion account</p>
        </div>
        
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600 text-sm text-center">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name Field */}
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-4 pl-12 bg-white/80 border border-cyan-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="John Doe"
                required
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-6 h-6 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              {formData.name && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></div>
                </div>
              )}
            </div>
          </div>
          
          {/* Email Field */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-4 pl-12 bg-white/80 border border-cyan-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="your@email.com"
                required
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-6 h-6 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              {formData.email && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></div>
                </div>
              )}
            </div>
          </div>
          
          {/* Password Field */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full p-4 pl-12 bg-white/80 border border-cyan-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="••••••••"
                required
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-6 h-6 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              {formData.password && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></div>
                </div>
              )}
            </div>
          </div>
          
          {/* Confirm Password Field */}
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full p-4 pl-12 bg-white/80 border border-cyan-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="••••••••"
                required
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-6 h-6 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              {formData.confirmPassword && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></div>
                </div>
              )}
            </div>
          </div>
          
          {/* Submit Button */}
          <button
            type="submit"
            className="group w-full py-4 px-6 mt-6 bg-gradient-to-r from-cyan-600 to-teal-500 text-white font-medium rounded-xl hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300 shadow-md relative overflow-hidden"
          >
            <span className="relative z-10">Create Account</span>
            <span className="absolute inset-0 bg-white/20 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"></span>
            <span className="absolute top-0 right-0 h-full w-12 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-cyan-600 hover:text-cyan-800 transition-colors">
              Sign In
            </a>
          </p>
        </div>
        
        {/* Sequoia-themed decorative elements */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center">
          <div className="w-32 h-1 rounded-full overflow-hidden bg-gray-200">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 transition-all duration-1000 ease-in-out"
              style={{ width: `${25 + (animationPhase * 25)}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;