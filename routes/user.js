const express = require("express");
const router = express.Router();
const User = require("../models/User.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const wrapAsync = require("../utils/wrapAsync.js");

router.get("/register", (req, res) => {
  res.render("./listings/signup.ejs");
});

router.post("/register", wrapAsync(async (req, res) => {
  try {
    const { username, email,password } = req.body;
    const user = new User({ username,email });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      res.redirect("/listings");
     
    })
  } catch (e) {
    res.redirect("/register");
  }
}));

router.get("/login", (req, res) => {
  res.render("./listings/login.ejs");
});

router.post("/login", passport.authenticate("local", {
  failureRedirect: "/login",
  failureMessage: true
}), (req, res) => {
  res.redirect("/listings/new");
});


router.get("/logout", (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect("/listings");
  });
});

module.exports = router;