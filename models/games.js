const mongoose = require("mongoose");

// Schema
const Schema = mongoose.Schema;
const GamesSchema = new Schema({
  owner: String,
  games: Array,
  date: {
    type: String,
    default: Date.now(),
  },
});

// Model
const Games = mongoose.model("Games", GamesSchema);

module.exports = Games;
