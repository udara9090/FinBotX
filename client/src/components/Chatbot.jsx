import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FiSend, FiMoon, FiSun, FiMic, FiMicOff } from "react-icons/fi";
import { useSpeechRecognition } from "react-speech-recognition";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const { transcript, listening, resetTranscript, startListening, stopListening } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) setInput(transcript);
  }, [transcript]);

  const sendMessage = async () => {
    if (!input) return;
    const userMessage = { text: input, sender: "user" };
    setMessages([...messages, userMessage]);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/ai/chat",
        { prompt: input },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      const botMessage = { text: res.data.response, sender: "bot" };
      setMessages([...messages, userMessage, botMessage]);
    } catch (error) {
      console.error("Chatbot Error", error);
    }

    setInput("");
    resetTranscript();
  };

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"} fixed bottom-4 right-4 w-80 shadow-lg rounded-lg transition-all`}>
      {/* Chatbot Header */}
      <div className="p-4 flex justify-between items-center border-b">
        <h2 className="font-semibold">💬 AI Chatbot</h2>
        <div className="flex gap-2">
          {/* Dark Mode Toggle */}
          <button onClick={() => setDarkMode(!darkMode)} className="text-xl">
            {darkMode ? <FiSun /> : <FiMoon />}
          </button>
        </div>
      </div>

      {/* Chat Display */}
      <div className="p-4 h-64 overflow-y-auto">
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`p-2 my-2 rounded-lg w-fit ${msg.sender === "user" ? "bg-blue-500 text-white ml-auto" : "bg-gray-300 text-black"}`}
          >
            {msg.text}
          </motion.div>
        ))}
      </div>

      {/* Input Field */}
      <div className="flex p-2 border-t">
        <input
          type="text"
          className="flex-1 p-2 border rounded-lg"
          placeholder="Ask a financial question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        
        {/* Voice Input Button */}
        <button className={`ml-2 text-blue-600 ${listening ? "animate-pulse" : ""}`} onClick={() => {
          if (isListening) {
            stopListening();
          } else {
            startListening();
          }
          setIsListening(!isListening);
        }}>
          {isListening ? <FiMicOff size={20} /> : <FiMic size={20} />}
        </button>

        {/* Send Button */}
        <button className="ml-2 text-blue-600" onClick={sendMessage}>
          <FiSend size={20} />
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
