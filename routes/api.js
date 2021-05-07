const express = require("express");

const router = express.Router();

// const BlogPost = require('../models/blogPost');
const Games = require("../models/games");

// Routes
router.get("/", (req, res) => {
  let id = req?.query?.id;
  if (id) {
    Games.findById(id)
      .then((data) => {
        res.json(data);
      })
      .catch((error) => {
        res.status(404).json({ msg: `Not found ${error.kind} (${id})` });
        return;
      });
  } else {
    Games.find({})
      .then((data) => {
        res.json(data);
      })
      .catch((error) => {
        res.status(500).json({ msg: error });
        return;
      });
  }
});

router.post("/addgame", (req, res) => {
  const data = req.body || {};
  let id = req?.query?.id;

  // console.log(data);

  if (!id) {
    res.status(404).json({ msg: `Not found id (${id})` });
    return;
  }
  if (!data.time || !data.date) {
    res.status(404).json({ msg: `Not found time or date` });
    return;
  }
  Games.findById(id).then((foundedGame) => {
    let oldGames = foundedGame.games.slice();
    oldGames.push(data);
    console.log(oldGames, id);
    Games.findByIdAndUpdate(
      id,
      { games: oldGames },
      { useFindAndModify: false }
    )
      .then(() => {
        res.json({ msg: "OK" });
        return;
      })
      .catch((error) => {
        res.status(404).json({ msg: `Not found ${error.kind} (${id})` });
        return;
      });
  });
});

router.post("/update", (req, res) => {
  const data = req.body || {};
  let id = req?.query?.id;

  console.log(data.games);

  if (!id) {
    res.status(404).json({ msg: `Not found id (${id})` });
    return;
  }
  if (!data.owner && !data.games) {
    res.status(404).json({ msg: `Not found body` });
    return;
  }
  if (id) {
    Games.findByIdAndUpdate(id, data, { useFindAndModify: false })
      .then((data2) => {
        console.log(data2);
        // res.json({ data });
        res.json({ msg: "OK" });
        return;
      })
      .catch((error) => {
        res.status(404).json({ msg: `Not found ${error.kind} (${id})` });
        return;
      });
  } else {
    res.status(404).json({ msg: `Not found id (${id})` });
    return;
  }
});

router.post("/create", (req, res) => {
  const data = req.body;
  console.log(data);

  if (data.owner && data.games) {
    const newGames = new Games(data);
    newGames.save((error) => {
      if (error) {
        res.status(500).json({ msg: error });
        return;
      }
      // Games
      return res.json({
        msg: "Your data has been saved!!!!!!",
      });
    });
  } else if (!data.owner) {
    res.status(400).json({ msg: "Not found owner" });
  } else if (!data.games) {
    res.status(400).json({ msg: "Not found games" });
  }
});

router.get("/name", (req, res) => {
  const data = {
    username: "peterson",
    age: 5,
  };
  res.json(data);
});

module.exports = router;
