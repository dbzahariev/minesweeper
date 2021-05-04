const express = require("express");

const router = express.Router();

// const BlogPost = require('../models/blogPost');
const Games = require("../models/games");

// Routes
router.get("/", (req, res) => {
  Games.find({})
    .then((data) => {
      // console.log("Data: ", data);
      res.json(data);
    })
    .catch((error) => {
      console.log("error: ", daerrorta);
    });
});

// router.put("/put/:owner", (req, res) => {
//   const game = Games.find((game) => {
//     game?.owner === "rame";
//   }).then((data) => {
//     console.log(data);
//   });
//   // console.log(game);
//   // game.owner = "rr";

//   // if (!game) return res.status(404).json({});

//   // game.name = req.body.name;
//   res.json({});
// });

router.post("/save", (req, res) => {
  const data = req.body;

  const newGames = new Games(data);

  newGames.save((error) => {
    if (error) {
      console.log(error.message);
      res.status(500).json({ msg: error });
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
