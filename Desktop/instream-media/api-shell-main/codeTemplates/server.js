const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const http = require("http");
const https = require("https");
const fs = require("fs");
const aws = require("aws-sdk");

// TODO Update aws config to include credentials
aws.config.update({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION,
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
});
// S3
module.exports.s3 = new aws.S3();

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err);
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: "./config.env" });
const app = require("./app");
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    // useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false
  })
  .then(() => console.log("DB connection successful!"));

const port = process.env.DEV_PORT || 4000;
if (process.env.NODE_ENV === "production") {
  // Listen both http & https ports
  // const httpServer = http.createServer(app);
  const httpsServer = https.createServer(
    {
      key: fs.readFileSync(
        `/etc/letsencrypt/live/${process.env.BACKEND_URL}/privkey.pem`
      ),
      cert: fs.readFileSync(
        `/etc/letsencrypt/live/${process.env.BACKEND_URL}/fullchain.pem`
      ),
    },
    app
  );

  httpsServer.listen(443, () => {
    console.log("HTTPS Server running on port 443");
  });
} else {
  const httpServer = http.createServer(app);
  httpServer.listen(port, () => {
    console.log(`HTTP Server running on port ${port}`);
  });
}

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  console.log("👋 SIGTERM RECEIVED. Shutting down gracefully");
  server.close(() => {
    console.log("💥 Process terminated!");
  });
});
