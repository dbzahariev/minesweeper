// Import npm packages
const mongoose = require("mongoose");
const express = require("express");
const morgan = require("morgan");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8080;

const routesApi = require("./routes/api");

let url =
  "mongodb+srv://ramsess90:Abc123456@cluster0.ewmw7.mongodb.net/Minesweeper?retryWrites=true&w=majority";

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Mongoose is connected!!!!");
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

app.use(morgan("tiny"));
app.use("/api", routesApi);

app.listen(PORT, console.log("Server is online!"));
