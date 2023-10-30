const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const uuid = require("uuid");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const app = express();
const socket = require("socket.io");
require("dotenv").config();
const User = require("./model/userModel"); 

app.use(cors());
app.use(express.json());

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.52tpxzp.mongodb.net/?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("DB Connection Successful");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.post("/api/register", async (req, res) => {
  const { username, email, password } = req.body;
  const uniqueKey = uuid.v4();
  console.log(uniqueKey);
  const newUser = new User({
    username,
    email,
    password,
    uniqueKey,
  });
  try {
    await newUser.save();
    res.json({ message: "Usuário Registrado com Sucesso", uniqueKey });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const server = app.listen(process.env.PORT, () =>
  console.log(`Server started on ${process.env.PORT}`)
);

const io = socket(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  }
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});
