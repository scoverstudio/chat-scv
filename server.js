const express = require("express");
const path = require("path");
const socket = require("socket.io");

const app = express();

const messages = [];
const users = [];

app.use(express.static(path.join(__dirname, "/client")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/client/index.html"));
});

const server = app.listen(process.env.PORT || 8000, () => {
  console.log("Server is running on port: 8000");
});

const io = socket(server);

io.on("connection", (socket) => {
  console.log("New client! Its id – " + socket.id);
  socket.on("message", (message) => {
    console.log("Oh, I've got something from " + socket.id);
    messages.push(message);
    socket.broadcast.emit("message", message);
  });
  socket.on("join", (user) => {
    users.push(user);
    socket.broadcast.emit("newUser", user);
  });

  socket.on("disconnect", () => {
    const disconnectedUser = users.find((el) => el.id === socket.id);
    const indexOfDisconnectedUser = users.findIndex(
      (el) => el.id === socket.id
    );

    socket.broadcast.emit("removeUser", disconnectedUser);
    users.splice(indexOfDisconnectedUser, 1);
    console.log("Oh, socket " + socket.id + " has left");
  });

  console.log("I've added a listener on message event \n");
});
