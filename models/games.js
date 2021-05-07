const mongoose = require("mongoose");

// Schema
const Schema = mongoose.Schema;
const GamesSchema = new Schema({
  owner: { type: String, require: true },
  games: { type: Array, require: true },
  date: {
    type: String,
    default: Date.now(),
  },
});

// Model
const Games = mongoose.model("Games", GamesSchema);

module.exports = Games;
