require("dns").setServers(["8.8.8.8", "8.8.4.4"]);
require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const connectDB = require("./config/db");
const Chat = require("./models/Chat"); // ✅ 1. Chat Model Import kiya

/* =========================
   DATABASE
========================= */
connectDB();

/* =========================
   SERVER & SOCKET.IO SETUP
========================= */
const PORT = process.env.PORT || 5000;

// 1. HTTP Server create karo (app.listen ki jagah)
const server = http.createServer(app);

// 2. Socket.io initialize karo (CORS same rakho jo app.js mein hai)
const io = new Server(server, {
  cors: {
    origin: [
      "https://plutoastro.com",
      "https://www.plutoastro.com",
      "http://localhost:3000",
      "https://plutoastro-h2aqh5da6-shubham4deys-projects.vercel.app"
    ],
    credentials: true,
    methods: ["GET", "POST"]
  }
});

// 3. Socket.io ko app ke andar available karao (agar routes mein use karna ho)
app.set("io", io);

// 4. Socket.io Connection Logic (Real-time Chat + Database Save)
io.on("connection", (socket) => {
  console.log("✅ A user/astrologer connected:", socket.id);

  // User ya Astrologer jab chat room join kare
  socket.on("join_chat", (data) => {
    socket.join(data.roomId);
    console.log(`👥 Joined room: ${data.roomId}`);
  });

  // ✅ Jab User message bheje (Database Save + Real-time Emit)
  socket.on("send_message", async (data) => {
    try {
      const newMessage = {
        senderId: data.senderId,
        senderName: data.senderName || "User",
        senderType: "user",
        text: data.text,
        timestamp: new Date()
      };

      // MongoDB mein save/update karo
      await Chat.findOneAndUpdate(
        { userId: data.userId, astrologerId: data.astrologerId },
        { 
          $push: { messages: newMessage },
          lastMessage: data.text,
          lastMessageTime: new Date(),
          isActive: true
        },
        { upsert: true, new: true }
      );

      // Room mein real-time message bhejo
      io.to(data.roomId).emit("receive_message", newMessage);
    } catch (error) {
      console.error("❌ Error saving user message:", error);
    }
  });

  // ✅ Jab Astrologer reply kare (Database Save + Real-time Emit)
  socket.on("astrologer_reply", async (data) => {
    try {
      const newMessage = {
        senderId: data.senderId,
        senderName: data.senderName || "Astrologer",
        senderType: "astrologer",
        text: data.text,
        timestamp: new Date()
      };

      // MongoDB mein save/update karo
      await Chat.findOneAndUpdate(
        { userId: data.userId, astrologerId: data.astrologerId },
        { 
          $push: { messages: newMessage },
          lastMessage: data.text,
          lastMessageTime: new Date(),
          isActive: true
        },
        { upsert: true, new: true }
      );

      // Room mein real-time message bhejo
      io.to(data.roomId).emit("receive_message", newMessage);
    } catch (error) {
      console.error("❌ Error saving astrologer reply:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// 5. Server start karo
server.listen(PORT, () => {
  console.log(`🚀 Server Running On Port ${PORT} with Socket.io`);
});

/* =========================
   HANDLE UNCAUGHT ERRORS
========================= */
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err.message);
  process.exit(1);
});