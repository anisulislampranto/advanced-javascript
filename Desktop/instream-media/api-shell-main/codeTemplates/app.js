const path = require("path");
const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const cors = require("cors");
const passport = require("passport");

// Imports from api-shell module
const AppError = require("./modules/api-shell/utils/appError");
const globalErrorHandler = require("./modules/api-shell/controllers/errorController");
const userRouter = require("./modules/api-shell/modules/users/userRoutes");
const teamRouter = require("./modules/api-shell/modules/teams/teamRoutes");
const invitationRouter = require("./modules/api-shell/modules/teams/invitationRoutes");

// Start express app
const app = express();

app.enable("trust proxy");

// 1) GLOBAL MIDDLEWARES
// Implement CORS
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production" ? process.env.FRONTEND_URL : true,
    credentials: true,
  })
);

app.options("*", cors());

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 200,
  windowMs: 10 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an 10 minutes!",
});
app.use("/", limiter);

// Pass the global passport object into the configuration function
require("./modules/api-shell/controllers/passport")(passport);
// This will initialize the passport object on every request
app.use(passport.initialize());

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
// TODO Check if this is needed
app.use(
  hpp({
    whitelist: [],
  })
);

app.use(compression());

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
app.use("/v1/users", userRouter);
app.use("/v1/teams", teamRouter);
app.use("/v1/invitations", invitationRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
