require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const http = require("http");
const { Server } = require("socket.io");

// Initialize Express
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow frontend to connect
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
connectDB();

// Import Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/expenses", require("./routes/expenseRoutes"));
app.use("/api/income", require("./routes/incomeRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));
app.use("/api/shared-budget", require("./routes/sharedBudgetRoutes"));

// WebSockets Connection
io.on("connection", (socket) => {
  console.log("🔌 New WebSocket Connection: " + socket.id);

  // Listen for budget updates from clients
  socket.on("update-budget", (data) => {
    console.log("📢 Budget Update:", data);

    // Broadcast the update to all connected users
    io.emit("budget-updated", data);
  });

  socket.on("disconnect", () => {
    console.log("❌ WebSocket Disconnected: " + socket.id);
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
