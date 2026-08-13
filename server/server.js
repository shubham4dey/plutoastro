require("dns").setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();
 
const http = require("http");

const { Server } = require("socket.io");
 
const app = require("./app");

const connectDB = require("./config/db");

const Chat = require("./models/Chat");

const ChatSession = require("./models/ChatSession");

const CallSession = require("./models/CallSession");
 
connectDB();
 
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
 
const io = new Server(server, {

  cors: {

    origin: [

      "http://localhost:3000",

      "https://plutoastro.com",

      "https://www.plutoastro.com",

      "https://plutoastro-h2aqh5da6-shubham4deys-projects.vercel.app",

    ],

    credentials: true,

    methods: ["GET", "POST"],

  },

});
 
app.set("io", io);
 
const capitalize = (str) => {

  if (!str) return str;

  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

};
 
io.on("connection", (socket) => {

  console.log("🟢 Socket Connected:", socket.id);
 
  socket.on("join_chat", ({ roomId }) => {

    try {

      if (!roomId) {

        console.log("❌ Room ID Missing");

        return;

      }

      socket.join(roomId);

      console.log(`👥 ${socket.id} joined room ${roomId}`);

    } catch (err) {

      console.error("JOIN CHAT ERROR:", err);

    }

  });
 
  socket.on("send_message", async (chat) => {

    try {

      console.log("📨 Received Message:", chat);
 
      if (!chat.roomId) {

        console.log("❌ Room ID Missing");

        return;

      }
 
      const session = await ChatSession.findOne({ roomId: chat.roomId });
 
      if (!session) {

        console.log("❌ Chat Session Not Found for room:", chat.roomId);

        socket.emit("message_error", {

          success: false,

          message: "Chat session not found",

        });

        return;

      }
 
      const senderType = capitalize(chat.senderType);
 
      if (senderType !== "User" && senderType !== "Astrologer") {

        console.log("❌ Invalid senderType:", chat.senderType);

        socket.emit("message_error", {

          success: false,

          message: "Invalid sender type",

        });

        return;

      }
 
      let receiverId;

      let receiverType;
 
      if (senderType === "User") {

        receiverId = session.astrologerId;

        receiverType = "Astrologer";

      } else {

        receiverId = session.userId;

        receiverType = "User";

      }
 
      const savedChat = await Chat.create({

        roomId: chat.roomId,

        sessionId: session._id,

        userId: session.userId,

        astrologerId: session.astrologerId,

        senderId: chat.senderId,

        senderType: senderType,

        receiverId: receiverId,

        receiverType: receiverType,

        message: chat.text || chat.message,

        messageType: chat.messageType || "text",

        attachment: chat.attachment || "",

      });
 
      console.log("✅ Message Saved to DB:", savedChat._id);
 
      const populatedChat = await Chat.findById(savedChat._id)

        .populate("senderId", "name email image")

        .populate("receiverId", "name email image")

        .populate("userId", "name email")

        .populate("astrologerId", "name image");
 
      io.to(chat.roomId).emit("receive_message", populatedChat);

    } catch (err) {

      console.error("❌ SEND MESSAGE ERROR");

      console.error(err);
 
      socket.emit("message_error", {

        success: false,

        message: "Failed to send message",

        error: process.env.NODE_ENV === "development" ? err.message : undefined,

      });

    }

  });
 
  socket.on("typing", (data) => {

    try {

      socket.to(data.roomId).emit("typing", {

        roomId: data.roomId,

        userId: data.userId,

        userName: data.userName || "User",

      });

    } catch (err) {

      console.error("TYPING ERROR:", err);

    }

  });
 
  socket.on("stop_typing", (data) => {

    try {

      socket.to(data.roomId).emit("stop_typing", {

        roomId: data.roomId,

        userId: data.userId,

      });

    } catch (err) {

      console.error("STOP TYPING ERROR:", err);

    }

  });
 
  socket.on("seen", async (data) => {

    try {

      const result = await Chat.updateMany(

        {

          roomId: data.roomId,

          receiverId: data.userId,

          seen: false,

        },

        {

          seen: true,

          seenAt: new Date(),

        }

      );
 
      console.log(`✅ Marked ${result.modifiedCount} messages as seen`);
 
      socket.to(data.roomId).emit("seen", {

        roomId: data.roomId,

        userId: data.userId,

        modifiedCount: result.modifiedCount,

      });

    } catch (err) {

      console.error("❌ SEEN ERROR:", err);

    }

  });
 
  socket.on("chat_ended", async (data) => {

    try {

      const updatedSession = await ChatSession.findOneAndUpdate(

        { roomId: data.roomId },

        {

          status: "ended",

          endedAt: new Date(),

        },

        { new: true }

      );
 
      if (updatedSession) {

        console.log(`✅ Chat ended for room: ${data.roomId}`);

        io.to(data.roomId).emit("chat_ended", {

          roomId: data.roomId,

          session: updatedSession,

        });

      } else {

        console.log("❌ Session not found for chat_ended:", data.roomId);

      }

    } catch (err) {

      console.error("❌ CHAT ENDED ERROR:", err);

    }

  });
 
  socket.on("user_online", (data) => {

    try {

      socket.to(data.roomId).emit("user_online", {

        roomId: data.roomId,

        userId: data.userId,

        onlineAt: new Date(),

      });

    } catch (err) {

      console.error("USER ONLINE ERROR:", err);

    }

  });
 
  socket.on("user_offline", (data) => {

    try {

      socket.to(data.roomId).emit("user_offline", {

        roomId: data.roomId,

        userId: data.userId,

        offlineAt: new Date(),

      });

    } catch (err) {

      console.error("USER OFFLINE ERROR:", err);

    }

  });
 
  // ✅ NEW: Astrologer joined chat → user ko notify karo

  socket.on("astrologer_joined_chat", (data) => {

    console.log("🧑‍🦱 Astrologer joined chat room:", data.roomId);

    socket.to(data.roomId).emit("astrologer_joined", { roomId: data.roomId });

  });
 
  socket.on("join_astrologer_room", async ({ astrologerId }) => {

    socket.join(`astrologer_${astrologerId}`);

    console.log(`📞 Astrologer joined call room: ${astrologerId}`);
 
    try {

      const pendingCalls = await CallSession.find({

        astrologerId,

        status: "ringing",

      });
 
      if (pendingCalls.length > 0) {

        console.log(`🔔 Found ${pendingCalls.length} pending calls`);

      }
 
      pendingCalls.forEach((s) => {

        socket.emit("incoming_call", {

          roomId: s.roomId,

          astrologerId: s.astrologerId,

          userId: s.userId,

        });

      });

    } catch (e) {

      console.error("PENDING CALLS ERROR:", e);

    }

  });
 
  socket.on("call_request", (data) => {

    console.log("📞 Call Request:", data.roomId);

    io.to(`astrologer_${data.astrologerId}`).emit("incoming_call", data);

  });
 
  socket.on("join_call", ({ roomId }) => {

    socket.join(roomId);

    console.log(`📞 ${socket.id} joined call room ${roomId}`);

  });
 
  socket.on("callee_ready", (data) => {

    console.log(`🔔 Callee ready in room: ${data.roomId}`);

    socket.to(data.roomId).emit("callee_ready", data);

  });
 
  socket.on("call_accepted", async (data) => {

    try {

      console.log("✅ Call Accepted:", data.roomId);

      await CallSession.findOneAndUpdate(

        { roomId: data.roomId },

        { status: "active", startedAt: new Date() },

        { new: true }

      );

      io.to(data.roomId).emit("call_accepted", data);

    } catch (err) {

      console.error("CALL ACCEPTED ERROR:", err);

    }

  });
 
  socket.on("call_rejected", async (data) => {

    try {

      console.log("❌ Call Rejected:", data.roomId);

      await CallSession.findOneAndUpdate(

        { roomId: data.roomId },

        { status: "rejected", endedAt: new Date() },

        { new: true }

      );

      io.to(data.roomId).emit("call_rejected", data);

    } catch (err) {

      console.error("CALL REJECTED ERROR:", err);

    }

  });
 
  socket.on("offer", (data) => socket.to(data.roomId).emit("offer", data));

  socket.on("answer", (data) => socket.to(data.roomId).emit("answer", data));

  socket.on("ice-candidate", (data) =>

    socket.to(data.roomId).emit("ice-candidate", data)

  );
 
  socket.on("call_ended", async (data) => {

    try {

      console.log("🔴 Call Ended:", data.roomId);

      socket.to(data.roomId).emit("call_ended", data);

    } catch (err) {

      console.error("CALL ENDED ERROR:", err);

    }

  });
 
  socket.on("disconnect", () => {

    console.log("🔴 Socket Disconnected:", socket.id);

  });

});
 
server.listen(PORT, () => {

  console.log(`🚀 Server Running On Port ${PORT} with Socket.io`);

});
 
server.on("error", (err) => {

  console.error("SERVER ERROR");

  console.error(err);

});
 
process.on("unhandledRejection", (err) => {

  console.error("❌ Unhandled Rejection");

  console.error(err);

});
 
process.on("uncaughtException", (err) => {

  console.error("❌ Uncaught Exception");

  console.error(err);

});
 