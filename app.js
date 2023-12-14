var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const session = require("express-session");
const bodyParser = require("body-parser");
const fs = require("fs");

const sessionMiddleware = session({
  secret: "secret",
  resave: true,
  saveUninitialized: true,
});

const publicPath = path.join(__dirname, "public");
const uploadPath = path.join(publicPath, "uploads");
const account_list = JSON.parse(fs.readFileSync("./contas.json"));
const admin = account_list.find((account) => account.isAdmin === true);

//Verifica se tem algum passe a ser emitido ou a ser mudado
if (
  admin &&
  Array.isArray(admin.emitList) &&
  admin.emitList.length === 0 &&
  Array.isArray(admin.changeList) &&
  admin.changeList.length === 0
) {
  if (fs.existsSync(uploadPath)) {
    fs.rmSync(uploadPath, { recursive: true });
  }
  fs.mkdirSync(uploadPath);
}

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var loginRouter = require("./routes/login");
var registoRouter = require("./routes/registo");
var contactarRouter = require("./routes/contactar");
var passRouter = require("./routes/pass");
var getPassRouter = require("./routes/getPass");
var emitPassRouter = require("./routes/emitPass");
var paymentRouter = require("./routes/payment");
var paragensRouter = require("./routes/paragens");

var app = express();
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(sessionMiddleware);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(function (req, res, next) {
  res.locals.isAdmin = req.session.isAdmin;
  next();
});

app.use("/", indexRouter);
app.use("/login", loginRouter);
app.use("/users", usersRouter);
app.use("/contactar", contactarRouter);
app.use("/pass", passRouter);
app.use("/getPass", getPassRouter);
app.use("/emitPass", emitPassRouter);
app.use("/registo", registoRouter);
app.use("/payment", paymentRouter);
app.use("/paragens", paragensRouter);

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

app.listen(3000, function () {
  console.log("App listening on port");
});

module.exports = app;
