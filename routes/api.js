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
        res.status(404).json({
          msg: `Not found ${error.kind} (${id})`,
          type: typeMsg.error,
        });
        return;
      });
  } else {
    Games.find({})
      .then((data) => {
        res.json(data);
      })
      .catch((error) => {
        res.status(500).json({ msg: error, type: typeMsg.error });
        return;
      });
  }
});

let typeMsg = {
  success: "success",
  error: "error",
  info: "info",
  warning: "warning",
};

router.post("/update", (req, res) => {
  const data = req.body || {};
  let id = req?.query?.id;

  if (!id) {
    res.status(404).json({ msg: `Not found id (${id})`, type: typeMsg.error });
    return;
  }
  if (!data.owner && !data.games) {
    res.status(404).json({ msg: `Not found body`, type: typeMsg.error });
    return;
  }
  if (id) {
    Games.findByIdAndUpdate(id, data, { useFindAndModify: false })
      .then((data2) => {
        res.json({ msg: "OK", type: typeMsg.success });
        return;
      })
      .catch((error) => {
        res.status(404).json({
          msg: `Not found ${error.kind} (${id})`,
          type: typeMsg.error,
        });
        return;
      });
  } else {
    res.status(404).json({ msg: `Not found id (${id})`, type: typeMsg.error });
    return;
  }
});

router.post("/addgame", (req, res) => {
  const data = req.body || {};
  let name = req?.query?.name;

  if (!name) {
    return res.json({ msg: `Not found id (${name})`, type: typeMsg.error });
  }
  if (!data.time || !data.date) {
    return res.json({ msg: `Not found time or date`, type: typeMsg.error });
  }

  Games.findOne({ owner: name })
    .then((foundedGame) => {
      let oldGames = foundedGame.games.slice();
      oldGames.push(data);
      Games.findOneAndUpdate(
        { owner: name },
        { games: oldGames },
        { useFindAndModify: false }
      )
        .then(() => {
          return res.json({
            msg: "Game is added successfully!",
            type: typeMsg.success,
          });
        })
        .catch((error) => {
          return res.status(404).json({
            msg: `Not found ${error.kind} (${name})`,
            type: typeMsg.error,
          });
        });
    })
    .catch((error) => {
      return res.status(404).json({
        msg: `Not found ${error.kind} (${name})`,
        type: typeMsg.error,
      });
    });
});

router.post("/addgamebyid", (req, res) => {
  const data = req.body || {};
  let id = req?.query?.id;

  if (!id) {
    res.status(404).json({ msg: `Not found id (${id})`, type: typeMsg.error });
    return;
  }
  if (!data.time || !data.date) {
    res
      .status(404)
      .json({ msg: `Not found time or date`, type: typeMsg.error });
    return;
  }
  Games.findById(id).then((foundedGame) => {
    let oldGames = foundedGame.games.slice();
    oldGames.push(data);
    Games.findByIdAndUpdate(
      id,
      { games: oldGames },
      { useFindAndModify: false }
    )
      .then(() => {
        res.json({ msg: "OK", type: typeMsg.success });
        return;
      })
      .catch((error) => {
        res.status(404).json({
          msg: `Not found ${error.kind} (${id})`,
          type: typeMsg.error,
        });
        return;
      });
  });
});

router.post("/cleanup", (req, res) => {
  const data = req.body;

  Games.find({ owner: "ramsess" })
    .then((foundedGames) => {
      let foundedGame = foundedGames[0];
      let oldGames = foundedGame.games.slice();
      oldGames = oldGames.filter((games) => games.time > 5);
      let id2 = foundedGame._id;
      Games.findByIdAndUpdate(
        id2,
        { games: oldGames },
        { useFindAndModify: false }
      )
        .then(() => {
          res.json({ msg: "OK", type: typeMsg.success });
          return;
        })
        .catch((error) => {
          res.status(404).json({
            msg: `Not found ${error.kind} (${id2})`,
            type: typeMsg.error,
          });
          return;
        });
    })
    .catch((error) => {
      console.error(error);
      res.json({ msg: "err" });
    });

  // Games.findOne({ owner: data.owner }).then((games) => {
  //   for (let game of games) {
  //   }
  //   res.json({ msg: "OK" });
  // });

  // Games.findOneAndDelete({ owner: data.owner })
  //   .then((foundedGame) => {
  //     res.json({ msg: "Ok" });
  //   })
  //   .catch((error) => {
  //     res.json({ msg: "err", error: error });
  //   });
});

router.post("/create", (req, res) => {
  const data = req.body;

  if (data.owner && data.games) {
    const newGames = new Games(data);
    newGames.save((error) => {
      if (error) {
        res.status(500).json({ msg: error, type: typeMsg.error });
        return;
      }
      // Games
      return res.json({
        msg: "Game is added successfully!",
        type: typeMsg.success,
      });
    });
  } else if (!data.owner) {
    res.json({ msg: "Not found owner", type: typeMsg.error });
  } else if (!data.games) {
    res.json({ msg: "Not found games", type: typeMsg.error });
  }
});

router.post("/save", (req, res) => {
  const data = req.body;

  const newGames = new Games(data);

  newGames.save((error) => {
    if (error) {
      res.status(500).json({ msg: error, type: typeMsg.error });
      return;
    }
    // Games
    return res.json({
      msg: "Your data has been saved!!!!!!",
      type: typeMsg.success,
    });
  });
});

module.exports = router;
