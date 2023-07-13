const express = require("express");
const app = express();
const log = require("morgan")("dev");
const mongoose = require("mongoose");
const auth = require("./Utils/jwt.js");
const unless = require("express-unless");
const users = require("./Controllers/UserController.js");
const errors = require("./Utils/errorHandler.js");

// middleware for authenticating token submitted with requests
auth.authenticateToken.unless = unless;
app.use(
  auth.authenticateToken.unless({
    path: [
      { url: "/status", methods: ["GET"] },
      { url: "/users/login", methods: ["POST"] },
      { url: "/users/register", methods: ["POST"] },
    ],
  })
);

app.use(log);
app.use(express.json()); // middleware for parsing application/json
app.use("/users", users); // middleware for listening to routes
app.use(errors.errorHandler); // middleware for error responses

// MongoDB connection, success and error event responses
const uri = "mongodb://localhost/UserAuth";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => console.log(`Connected to DATABASE at ${uri}`));

app.get("/status", (req, res) => {
  res.json(
    `Server is running on ${process.env.PORT || 3002} port: (${
      process.env.NODE_ENV
    } mode).`
  );
});

app.listen(process.env.PORT || 3002, (req, res) => {
  console.log(
    `Server is running on ${process.env.PORT || 3002} port: (${
      process.env.NODE_ENV
    } mode).`
  );
});
