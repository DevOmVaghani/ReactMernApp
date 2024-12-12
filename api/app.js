// app.js

require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
const fs = require("fs");
const path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var nocache = require("nocache");

var initMongo = require("../api/config/mongo");


// var indexRouter = require("./routes/index");
// var usersRouter = require("./routes/users");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(nocache());

const getLogFilePath = (url) => {
  const pathSegment = url.split("/")[2] || "general";
  const sanitizedPathSegment = pathSegment.replace(/[^a-zA-Z0-9]/g, "_");

  const currentDate = new Date().toISOString().split("T")[0];

  return path.join(
    __dirname,
    `logs/${sanitizedPathSegment}_${currentDate}.log`
  );
};

app.use((req, res, next) => {
  const logDir = path.join(__dirname, "logs");
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }

  const logFilePath = getLogFilePath(req.originalUrl);
  const logStream = fs.createWriteStream(logFilePath, { flags: "a" });

  const originalSend = res.send;

  res.send = function (body) {
    const dividerStart = "(---------------------------------------------";
    const dividerEnd = "---------------------------------------------)";

    const commonLogEntry = `
${dividerStart}
Time        : ${new Date().toISOString()}
API Path    : ${req.originalUrl}
Method      : ${req.method}
Request Body: ${JSON.stringify(req.body, null, 2)}`;

    if (!req.originalUrl.includes("/login")) {
      const logEntry = `${commonLogEntry}
Response    : ${body}
${dividerEnd}\n\n`;
      logStream.write(logEntry);
    } else {
      const logEntry = `${commonLogEntry}
Response    : <hidden>
${dividerEnd}\n\n`;
      logStream.write(logEntry);
    }

    return originalSend.call(this, body);
  };

  next();
});

// app.use("/api", indexRouter);
// app.use("/users", usersRouter);

// var testRouter = require("./modal/routes");

const notesRoutes = require("../api/login/routes"); // Your routes file path
app.use("/login", notesRoutes);


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

// Init MongoDB
initMongo();

module.exports = app;

