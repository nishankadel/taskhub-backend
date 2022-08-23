// Importing required modules
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
require("./db/connection");

// create app server
const app = express();

// create port variables
const port = process.env.PORT || 8000;

// use express parsers
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

// using other middlewares
app.use(morgan("tiny"));

// Setup cors middlewares
app.use(
  cors({
    origin: ["http://localhost:3000", "https://taskhub-client.netlify.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// setting up router
app.use("/api/auth", require("./routers/authRouter"));
app.use("/api/profile", require("./routers/profileRouter"));
app.use("/api/projects", require("./routers/projectRouter"));
app.use("/api/normal", require("./routers/normalRouter"));
app.use("/api/todos", require("./routers/todoRouter"));

// running server
app.listen(port, () => console.log(`Backend Server Running at ${port}`));
// mongodb+srv://nishankadel:nishankadel@th-cluster.theehme.mongodb.net/?retryWrites=true&w=majority
