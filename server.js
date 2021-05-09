// Import npm packages
const mongoose = require("mongoose");
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");
const passport = require("passport");
const passportLocal = require("passport-local").Strategy;
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const bodyParser = require("body-parser");

const User = require("./models/user");

const app = express();
const PORT = process.env.PORT || 8080; // Step 1

const routesApi = require("./routes/api");
// const routesUsers = require("./routes/users");

// Step 2
let newUrl =
  "mongodb+srv://ramsess90:Abc123456@cluster0.ewmw7.mongodb.net/db1?retryWrites=true&w=majority";

mongoose.connect(process.env.MONGODB_URI || newUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Mongoose is connected!!!!");
});

// Data parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Step 3

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

// HTTP request logger
app.use(morgan("tiny"));
app.use("/api", routesApi);
// app.use("/user", routesUsers);

// for users
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000", // <-- location of the react app were connecting to
    credentials: true,
  })
);
app.use(
  session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(cookieParser("secretcode"));
app.use(passport.initialize());
app.use(passport.session());
require("./passportConfig")(passport);
// app.use("/user", routesUsers);

// ----------------- users -----------------

app.post("/user/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) throw err;
    console.log("log", user, info);
    if (!user) {
      res.status(403).json({
        msg: `Incorrect username or password!`,
      });
    } else {
      req.logIn(user, (err) => {
        if (err) {
          res.status(500).json({ msg: "Error" });
          throw err;
        } else {
          res.json({ msg: "OK", userId: user._id });
        }
      });
    }
  })(req, res, next);
});

app.post("/user/register", (req, res) => {
  User.findOne({ username: req.body.username }, async (err, doc) => {
    if (err) throw err;
    if (doc) res.send("User Already Exists");
    if (!doc) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const newUser = new User({
        username: req.body.username,
        password: hashedPassword,
      });
      await newUser.save();
      console.log("reg", newUser);
      res.send("User Created");
    }
  });
});

app.delete("/user/delete", (req, res) => {
  console.log(req.user);
  if (!req.user) {
    res.status(403).json({ msg: `You don't have permission. Please login!` });
    return null;
  }
  User.findOneAndDelete({ username: req.user })
    .then((data) => {
      let username = data.username;
      res.json({ msg: `${username} was deleted` });
    })
    .catch((error) => {
      res.status(500).json({ msg: error });
      return;
    });
});

app.post("/user/reset", (req, res) => {
  // if (req.isAuthenticated()) {
  //   //user is alreay logged in
  //   return res.redirect("/");
  // }
  User.reset(req, res, (err) => {
    if (err) {
      console.log("reset", err);
      res.status(500).json({ msg: error });
      return;
      // req.flash("error", err);
      // return res.redirect("/reset");
    } else {
      // req.flash(
      //   "success",
      //   "Password successfully reset.  Please login using new password."
      // );
      res.json({ msg: "OK" });
      return;
      // return res.redirect("/login");
    }
  });
});

app.get("/user/showMyUsername", (req, res) => {
  console.log(req.user);
  if (req.user) {
    res.json(req.user); // The req.user stores the entire user that has been authenticated inside of it.
  } else res.json({ msg: "Please login" });
});
// ------------------ users end ----------

app.listen(
  PORT,
  console.log(
    `Server is starting at1 ${PORT}. (App name dbzminesweeper) (server:"dbzminesweeper.herokuapp.com")`
  )
);
