const express = require("express");

const router = express.Router();

// const BlogPost = require('../models/blogPost');
const Games = require("../models/games");

// Routes
router.get("/", (req, res) => {
  Games.find({})
    .then((data) => {
      console.log("Data: ", data);
      res.json(data);
    })
    .catch((error) => {
      console.log("error: ", daerrorta);
    });
});

router.post("/save", (req, res) => {
  const data = req.body;

  const newGames = new Games(data);

  newGames.save((error) => {
    if (error) {
      res.status(500).json({ msg: "Sorry, internal server errors" });
      return;
    }
    // Games
    return res.json({
      msg: "Your data has been saved!!!!!!",
    });
  });
});

router.get("/name", (req, res) => {
  const data = {
    username: "peterson",
    age: 5,
  };
  res.json(data);
});

module.exports = router;
