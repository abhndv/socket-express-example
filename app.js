const createError = require("http-errors");
const express = require("express");
const path = require("path");
const app = express();

app.set("port", process.env.PORT || 3000);
const server = app.listen(app.get("port"), () => {
  console.log(`Express server listening on port ${app.get("port")}`);
});

const io = require('socket.io')(server);
app.set('socketio', io);

let connectionList = [];
// To clear duplicate connections
io.on("connection", (socket) => {
  connectionList.push(socket.id);
  if (connectionList.includes(socket.id)) {
    io.removeAllListeners("connection");
  }
  socket.on("disconnect", () => {
    connectionList = connectionList.filter((x) => x !== socket.id);
  });
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", require("./routes/index"));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
