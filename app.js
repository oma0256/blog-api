const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");

const app = express();

app.use(bodyParser.json());
app.use("/feed", feedRoutes);
app.user("/auth", authRoutes);
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  return res
    .status(error.status || 500)
    .json({ message: error.message, data: error.data });
});

mongoose
  .connect(
    "mongodb+srv://oma0256:pass1234@cluster0-lypia.mongodb.net/blog-api?retryWrites=true&w=majority",
    { useNewUrlParser: true }
  )
  .then(() => app.listen(8000))
  .catch(err => console.log(err));
