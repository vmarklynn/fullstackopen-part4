const config = require("./utils/config");
const express = require("express");
const app = express();
const cors = require("cors");
const logger = require("./utils/logger");
const mongoose = require("mongoose");

require("express-async-errors");
const blogRouter = require("./controllers/blogs");
const middleware = require("./utils/middleware");

mongoose.set("strictQuery", false);

const mongoUrl = config.MONGODB_URI;
mongoose
  .connect(mongoUrl)
  .then(() => logger.info("Connected to MongoDB"))
  .catch((error) => logger.error("error connecting to MongoDB", error.message));

app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);
app.use("/api/blogs", blogRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
