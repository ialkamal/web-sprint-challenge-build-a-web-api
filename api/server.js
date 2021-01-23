const express = require("express");
require("dotenv").config();
const actionsRouter = require("./actions/actions-router");
const projectsRouter = require("./projects/projects-router");
const server = express();

// Complete your server here!
// Do NOT `server.listen()` inside this file!

const MESSAGE = process.env.MESSAGE;

server.use(express.json());

server.use("/api/actions", actionsRouter);
server.use("/api/projects", projectsRouter);

server.use("/", (req, res) => {
  res.status(200).send(`<h1>${MESSAGE}</h1>`);
});

server.use((error, req, res, next) => {
  res.status(error.statusCode).json({ message: "server failed", error });
});

module.exports = server;
