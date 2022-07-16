var express = require("express");
var router = express.Router();

//View Routes
router.get("/", function (req, res, next) {
  res.render("index", { title: "Random Number Generator" });
});

//API Routes
router.post("/api/generate", function (req, res, next) {
  const { socketId, action, min, max } = req && req.body;
  if (typeof action === "undefined") return res.status(400).json({ message: "Invalid Input" });

  const io = req.app.get("socketio");
  socketEmit(io, socketId, action, parseInt(min), parseInt(max));
  res.status(200).json({});
});

let users = {};
const socketEmit = (io, socketId, action, min, max) => {
  if (action) {
    if (!(min && max)) return;
    let num = Math.floor(Math.random() * (max - min + 1)) + min;
    io.to(socketId).emit("random", num);
    users[socketId] = setInterval(function () {
      let num = Math.floor(Math.random() * (max - min + 1)) + min;
      io.to(socketId).emit("random", num);
    }, 5000);
  } else {
    let timer = users[socketId];
    if (timer) clearInterval(timer);
  }
};

module.exports = router;
